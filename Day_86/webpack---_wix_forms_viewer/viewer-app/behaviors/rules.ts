import _ from 'lodash'
import { Rule, Action, Operation } from '@wix/forms-common/dist/src/rules/rule'
import { getFieldType, FIELD_TYPE, getFieldRawValue, isComplexAddress } from '../viewer-utils'
import { findContradictingRules } from '@wix/forms-common'
import { RulesExecutionFailedError } from '../errors'
import { siteStore } from '../stores/site-store'
import { submitUtils } from '../submit-utils'
import { IController } from '../controllers/controllers'

interface FieldsMap {
  [fieldId: string]: {
    sdk: WixCodeField
    registeredEvents: string[]
  }
}

interface Executions {
  [sdkAction: string]: string[]
}

/**
 *
 * @param operator - QL operator
 * @returns A Corvid event name based on the given operator
 */
const mapOperatorToEvent = (operator: string, field: WixCodeField) => {
  switch (operator) {
    case '$exists':
    case '$eq':
    case '$hasSome':
      switch (getFieldType(field)) {
        case FIELD_TYPE.TEXT_INPUT:
        case FIELD_TYPE.TEXT_BOX:
          return 'onInput'
        default:
          return 'onChange'
      }
    default:
      return
  }
}

/**
 *
 * @param operator - QL operator
 * @param value - Expected value based on selected predicate
 * @returns A predefined predicate with the given expected value to be check against
 */
const mapOperatorToPredicate = (operator: string, value): ((field: WixCodeField) => boolean) => {
  switch (operator) {
    case '$exists':
      return (field: WixCodeField) => {
        const fieldValue = getFieldRawValue(field)
        const booleanValue = !!fieldValue
        switch (getFieldType(field)) {
          case FIELD_TYPE.CHECKBOX:
            return value ? fieldValue : !fieldValue
          case FIELD_TYPE.DATE:
            return value ? _.isDate(fieldValue) : !_.isDate(fieldValue)
          case FIELD_TYPE.RATING:
            return value ? booleanValue : !booleanValue
          case FIELD_TYPE.AUTOCOMPLETE_ADDRESS: {
            const newValue = !!_.get(fieldValue, 'formatted', '')
            return value ? newValue : !newValue
          }
          case FIELD_TYPE.COMPLEX_PHONE: {
            const newValue = !!_.get(fieldValue, 'value', false)
            return value ? newValue : !newValue
          }
          case FIELD_TYPE.COMPLEX_ADDRESS: {
            const allFieldsNotRequied = _.every(field.innerFields, (f) => !f.required)
            return allFieldsNotRequied
              ? value
                ? _.some(field.innerFields, (f) => f.value)
                : _.every(field.innerFields, (f) => !f.value)
              : _.every(field.innerFields, (f) => (value ? !f.required || f.value : !f.value))
          }
          default:
            return value ? !_.isEmpty(fieldValue) : _.isEmpty(fieldValue)
        }
      }
    case '$eq':
      return (field: WixCodeField) => getFieldRawValue(field) === value
    case '$hasSome':
      return (field: WixCodeField) => {
        const fieldValue = getFieldRawValue(field)

        switch (true) {
          case _.isArray(value):
            switch (true) {
              case _.isArray(fieldValue):
                return !_.isEmpty(_.intersection(value, fieldValue))
              default:
                return _.includes(value, fieldValue)
            }
          default:
            switch (true) {
              case _.isArray(fieldValue):
                return _.includes(fieldValue, value)
              default:
                return fieldValue === value
            }
        }
      }

    default:
      return () => false
  }
}

/**
 * @returns A map of fields and events to trigger the given rule
 * For example:
 * A response for a rule with condition on fieldId1 for input change & fieldId2 for input change OR out of focus
 * [
 *  {
 *    fieldId1: [onInput]
 *  },
 *  {
 *    fieldId2: [onInput, onBlur]
 *   }
 * ]
 */
const extractAffectedFields = (
  rule: Rule,
  fields: FieldsMap,
): { fieldId: string; events: string[] }[] => {
  if (!rule.conditions) {
    return []
  }

  // currently supports only a single condition as { "item": { "$operator": value }}
  const fieldId = _.head(_.keys(rule.conditions))

  if (!fields[fieldId]) {
    return []
  }

  const operator = _.head(_.keys(rule.conditions[fieldId]))
  const event = mapOperatorToEvent(operator, fields[fieldId].sdk)
  if (isComplexAddress(fields[fieldId].sdk)) {
    const { innerFields } = fields[fieldId].sdk

    return _.map(innerFields, (f) => ({
      fieldId: f.uniqueId,
      events: [mapOperatorToEvent(operator, fields[f.uniqueId].sdk)],
    }))
  }

  return [{ fieldId, events: [event] }]
}

const getFieldIds = (action: Action) => {
  if (!action.compId) {
    return []
  }

  return _.isString(action.compId) ? [action.compId] : action.compId
}

const invokeSdkAction = ({
  sdkAction,
  fields,
  executions,
  action,
}: {
  sdkAction: string
  fields: FieldsMap
  executions: Executions
  action: ($field: WixCodeField) => void
}) => {
  const affectedIds = []

  _.forEach(fields, (field) => {
    if (!_.includes(executions[sdkAction], field.sdk.uniqueId)) {
      action(field.sdk)
      affectedIds.push(field.sdk.uniqueId)
    }
  })

  return { [sdkAction]: affectedIds }
}

const expand = (fields: FieldsMap, executions: Executions) => {
  return invokeSdkAction({
    sdkAction: 'visibility',
    fields,
    executions,
    action: ($field) => $field.expand(),
  })
}

const collapse = (fields: FieldsMap, executions: Executions) => {
  return invokeSdkAction({
    sdkAction: 'visibility',
    fields,
    executions,
    action: ($field) => $field.collapse(),
  })
}

const required = (fields: FieldsMap, value: boolean, executions: Executions) => {
  return invokeSdkAction({
    sdkAction: 'required',
    fields,
    executions,
    action: ($field) => {
      if (isComplexAddress($field)) {
        _.each($field.innerFields, (f) => {
          f.required = value
        })
      } else {
        $field.required = value
      }

      if ($field.resetValidityIndication) {
        $field.resetValidityIndication()
      }
    },
  })
}

/**
 *
 * @returns A boolean value to indicate if the rule conditions valid or not
 */
const validateConditions = (rule: Rule, fields: FieldsMap): boolean => {
  const conditions = rule.conditions

  if (!conditions) {
    return true
  }

  // currently supports only a single condition as { "item": { "$operator": value }}
  const fieldId = _.head(_.keys(rule.conditions))

  if (!fields[fieldId]) {
    return false
  }

  const operator = _.head(_.keys(rule.conditions[fieldId]))
  const operatorValue = _.head(_.values(rule.conditions[fieldId]))

  return mapOperatorToPredicate(operator, operatorValue)(fields[fieldId].sdk)
}

const executeAction = (
  action: Action,
  fields: FieldsMap,
  { positive, executions }: { positive: boolean; executions: Executions },
): Executions => {
  const fieldIds = getFieldIds(action)
  const selectedFields = _.pick(fields, fieldIds)

  switch (action.operation) {
    case Operation.Show:
      return (positive ? expand : collapse)(selectedFields, executions)
    case Operation.Hide:
      return (positive ? collapse : expand)(selectedFields, executions)
    case Operation.Required:
      return required(selectedFields, !!positive, executions)
    case Operation.Optional:
      return required(selectedFields, !positive, executions)
    default:
      return {}
  }
}

/**
 *
 * @returns An executions data per sdk action, for example: { expand: [formId1, formId2] }
 */
const executeActions = ({
  rule,
  fields,
  executions,
}: {
  rule: Rule
  fields: FieldsMap
  executions: Executions
}): Executions => {
  const positive = validateConditions(rule, fields)
  return _.chain(rule.actions)
    .map((action) => executeAction(action, fields, { positive, executions }))
    .reduce((result, value) => {
      _.forEach(value, (fieldIds, sdkAction) => {
        if (!result[sdkAction]) {
          result[sdkAction] = []
        }

        if (positive) {
          result[sdkAction] = _.concat(result[sdkAction], fieldIds)
        }
      })

      return result
    }, {})
    .value()
}

/**
 *
 * @description Scan given rules, execute only the first rule and skip all the other valid rules, for every rule with false condition revert the actions
 */
const runRules = (rules: Rule[], fields: FieldsMap): void => {
  const executions: Executions = {}

  _.forEach(rules, (rule) => {
    const currentExecutions = executeActions({ rule, fields, executions })
    _.forEach(currentExecutions, (fieldIds, sdkAction) => {
      if (!executions[sdkAction]) {
        executions[sdkAction] = []
      }

      executions[sdkAction] = _.uniq(_.concat(executions[sdkAction], fieldIds))
    })
  })
}

/**
 *
 * @returns A 2 level map of fieldIds & event names and which rules related to them, this useful to quickly register each event for every field
 * For example:
 * {
 *  fieldId1: {
 *    onInput: [rule1, rule2],
 *    onBlur: [rule3]
 *  },
 *  fieldId2: {
 *    onBlur: [rule1]
 *  }
 * }
 */
const mapRulesPerFieldAndEvent = (rules: Rule[], fields: FieldsMap) => {
  const rulesPerFieldAndEvent: { [fieldId: string]: { [event: string]: Rule[] } } = {}

  _.forEach(rules, (rule) => {
    if (!rule.enabled) {
      return
    }

    const affectedFields = extractAffectedFields(rule, fields)

    _.forEach(affectedFields, ({ fieldId, events }) => {
      if (!rulesPerFieldAndEvent[fieldId]) {
        rulesPerFieldAndEvent[fieldId] = {}
      }

      _.forEach(events, (event) => {
        if (!rulesPerFieldAndEvent[fieldId][event]) {
          rulesPerFieldAndEvent[fieldId][event] = []
        }

        rulesPerFieldAndEvent[fieldId][event].push(rule) // Currently this rules array not in use
      })
    })
  })

  return rulesPerFieldAndEvent
}

/**
 *
 * @returns A map of field uniqueId and Corvid field and placeholder for events that already registered for this field
 */
const mapFieldsPerUniqueId = (fields: WixCodeField[]): FieldsMap =>
  _.reduce(
    fields,
    (acc, field) => {
      acc[field.uniqueId] = { sdk: field, registeredEvents: [] }
      if (isComplexAddress(field)) {
        _.each(field.innerFields, (innerField) => {
          acc[innerField.uniqueId] = { sdk: innerField, registeredEvents: [] }
        })
      }
      return acc
    },
    {},
  )

/**
 *
 * @returns rules without contradicting or disabled rules
 */
const filterDisabledRules = (rules: Rule[], fields: FieldsMap) => {
  const contradictionMapping = findContradictingRules(rules)
  return _.filter(rules, (rule, idx) => {
    const ruleIsEnabled = rule.enabled && contradictionMapping[idx] === -1
    if (ruleIsEnabled) {
      const affectedFields = extractAffectedFields(rule, fields)
      return affectedFields.reduce(
        (acc, field) => acc && !fields[field.fieldId].sdk.disableFromRule,
        true,
      )
    } else {
      return false
    }
  })
}

export const registerRulesIfExists = (controller: IController, components: WixCodeField[]) => {
  if (!controller.controllerSettings.ok) {
    return
  }

  const allRules: Rule[] = _.get(controller.controllerSettings, 'data.rules', [])

  if (_.isEmpty(allRules)) {
    return
  }
  const fieldsMap: FieldsMap = mapFieldsPerUniqueId(components)
  const rules = filterDisabledRules(allRules, fieldsMap)

  const rulesPerFieldAndEvent = mapRulesPerFieldAndEvent(rules, fieldsMap)

  _.forEach(rulesPerFieldAndEvent, (events, fieldId) => {
    _.forEach(events, (r, event) => {
      const { sdk, registeredEvents } = fieldsMap[fieldId]

      if (sdk[event]) {
        if (!_.includes(registeredEvents, event)) {
          sdk[event](() => {
            try {
              runRules(rules, fieldsMap)
            } catch (err) {
              siteStore.captureException(new RulesExecutionFailedError(err))
            }
          })

          registeredEvents.push(event)
        }
      }
    })
  })

  runRules(rules, fieldsMap)

  submitUtils.registerOnFieldsReset(() => {
    runRules(rules, fieldsMap)
  })
}
