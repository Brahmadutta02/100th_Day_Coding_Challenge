import { FIELDS } from '../../constants/roles'
import { IController } from '../controllers/controllers'

export const addRegistrationFormValidation = (controller: IController) => {
  const REQUIRED_REGISTRATION_TEXT_ROLES = [
    FIELDS.ROLE_FIELD_REGISTRATION_FORM_LOGIN_EMAIL,
    FIELDS.ROLE_FIELD_REGISTRATION_FORM_PASSWORD,
  ]

  const requiredInputTextFields = controller.getFieldsByRoles(REQUIRED_REGISTRATION_TEXT_ROLES)
  const email = requiredInputTextFields[0]

  requiredInputTextFields.forEach((field) => {
    field.required = true
    field.resetValidityIndication()
  })

  email?.onBlur?.((_e) => {
    email.value = email?.value?.toLowerCase()
  })
}
