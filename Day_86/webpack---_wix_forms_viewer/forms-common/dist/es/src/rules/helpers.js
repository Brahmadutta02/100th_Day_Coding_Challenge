var _a;
import {
    __assign,
    __spreadArray
} from "tslib";
import * as _ from 'lodash';
import {
    Operation
} from './rule';
import {
    buildCondition
} from './query-builder';
var getConditionField = function(rule) {
    return _.head(_.entries(rule.conditions))[0];
};
var getConditionOperationTypeAndValue = function(rule) {
    var filter = _.head(_.entries(rule.conditions))[1];
    var _a = _.head(_.entries(filter)),
        op = _a[0],
        val = _a[1];
    switch (op) {
        case '$eq':
        case '$hasSome':
            return {
                operation: "filled with" /* ConditionOperationType.FilledWith */ ,
                value: val,
            };
        case '$exists':
            return {
                operation: val ?
                    "filled" /* ConditionOperationType.Filled */ :
                    "not filled" /* ConditionOperationType.NotFilled */ ,
            };
        default:
            return {
                operation: null,
            };
    }
};
var getActionFieldList = function(rule) {
    var compId = _.get(rule, 'actions[0].compId');
    return _.isArray(compId) ? compId : [compId];
};
var getConditionOperationType = function(rule) {
    return getConditionOperationTypeAndValue(rule).operation;
};
var OppositeOperations = (_a = {},
    _a["filled" /* ConditionOperationType.Filled */ ] = ["not filled" /* ConditionOperationType.NotFilled */ ],
    _a["filled with" /* ConditionOperationType.FilledWith */ ] = ["not filled" /* ConditionOperationType.NotFilled */ ],
    _a["not filled" /* ConditionOperationType.NotFilled */ ] = [
        "filled" /* ConditionOperationType.Filled */ ,
        "filled with" /* ConditionOperationType.FilledWith */ ,
    ],
    _a[Operation.Hide] = [Operation.Show],
    _a[Operation.Show] = [Operation.Hide],
    _a[Operation.Optional] = [Operation.Required],
    _a[Operation.Required] = [Operation.Optional],
    _a);
var isConditionFieldEquals = function(rule1, rule2) {
    return getConditionField(rule1) === getConditionField(rule2);
};
var isConditionOperationEquals = function(rule1, rule2) {
    return getConditionOperationType(rule1) === getConditionOperationType(rule2);
};
var isActionOperationEquals = function(rule1, rule2) {
    return _.get(rule1, 'actions[0].operation') === _.get(rule2, 'actions[0].operation');
};
var getCommonFields = function(rule1, rule2) {
    return _.intersection(getActionFieldList(rule1), getActionFieldList(rule2));
};
var isOppositeOperation = function(op1, op2) {
    return op1 && op2 && _.includes(OppositeOperations[op1], op2);
};
var isOppositeConditionOperation = function(rule1, rule2) {
    return isOppositeOperation(getConditionOperationType(rule1), getConditionOperationType(rule2));
};
var isOppositeActionOperation = function(rule1, rule2) {
    return isOppositeOperation(_.get(rule1, 'actions[0].operation'), _.get(rule2, 'actions[0].operation'));
};
var contradictionType1 = function(_a) {
    var conditionFieldEquals = _a.conditionFieldEquals,
        oppositeConditionOperation = _a.oppositeConditionOperation,
        actionOperationEquals = _a.actionOperationEquals;
    return conditionFieldEquals && oppositeConditionOperation && actionOperationEquals;
};
var contradictionType2 = function(_a) {
    var conditionFieldEquals = _a.conditionFieldEquals,
        conditionOperationEquals = _a.conditionOperationEquals,
        oppositeActionOperation = _a.oppositeActionOperation;
    return conditionFieldEquals && conditionOperationEquals && oppositeActionOperation;
};
var findContradictionRuleIndex = function(comparedRule, rules, fromIndex) {
    return _.findIndex(rules, function(rule) {
        if (!rule.enabled) {
            return false;
        }
        var commonFields = getCommonFields(comparedRule, rule);
        var conditionFieldEquals = isConditionFieldEquals(comparedRule, rule);
        var conditionOperationEquals = isConditionOperationEquals(comparedRule, rule);
        var oppositeConditionOperation = isOppositeConditionOperation(comparedRule, rule);
        var oppositeActionOperation = commonFields.length > 0 &&
            isOppositeActionOperation(comparedRule, rule);
        var actionOperationEquals = commonFields.length > 0 && isActionOperationEquals(comparedRule, rule);
        var predsInput = {
            conditionFieldEquals: conditionFieldEquals,
            conditionOperationEquals: conditionOperationEquals,
            oppositeConditionOperation: oppositeConditionOperation,
            oppositeActionOperation: oppositeActionOperation,
            actionOperationEquals: actionOperationEquals,
        };
        return _.overSome([contradictionType1, contradictionType2])(predsInput);
    }, fromIndex);
};
var findContradictingRules = function(rules) {
    var reversedRules = _.reverse(__spreadArray([], rules, true));
    return _(reversedRules)
        .map(function(rule, index) {
            return findContradictionRuleIndex(rule, reversedRules, index + 1);
        })
        .map(function(index) {
            return (index === -1 ? -1 : rules.length - index - 1);
        })
        .reverse()
        .value();
};
var extractAffectedFieldIds = function(rule) {
    var childMap = function(childConditions) {
        return _.chain(childConditions)
            .keys()
            .map(function(k) {
                return _.startsWith(k, '$') ? mapConditions(childConditions[k]) : k;
            })
            .value();
    };
    var mapConditions = function(conditions) {
        return _.isArray(conditions) ? _.map(conditions, childMap) : childMap(conditions);
    };
    return {
        conditions: _.chain(mapConditions(rule.conditions))
            .flattenDeep()
            .uniq()
            .value(),
        actions: _.chain(rule.actions)
            .map(function(action) {
                return action.compId;
            })
            .flattenDeep()
            .uniq()
            .value(),
    };
};
var duplicateCondition = function(condition, idMappings) {
    var _a;
    var _b = _.head(_.entries(condition)),
        field = _b[0],
        filter = _b[1];
    return buildCondition((_a = {}, _a[idMappings[field]] = filter, _a));
};
var duplicateAction = function(action, idMappings) {
    return (__assign(__assign({}, action), {
        compId: _.isArray(action.compId) ?
            _.map(action.compId, function(id) {
                return idMappings[id];
            }) :
            idMappings[action.compId]
    }));
};
var duplicateRules = function(rules, idMappings) {
    return rules.map(function(rule) {
        return (__assign(__assign({}, rule), {
            conditions: duplicateCondition(rule.conditions, idMappings),
            actions: _.map(rule.actions, function(action) {
                return duplicateAction(action, idMappings);
            })
        }));
    });
};
export {
    findContradictingRules,
    extractAffectedFieldIds,
    duplicateRules
};
//# sourceMappingURL=helpers.js.map