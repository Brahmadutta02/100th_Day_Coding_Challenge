import _ from 'lodash'

export const error_mandatory_val = _.template(
	'The <%=propertyName%> parameter is required for <%=functionName%> method.'
)
export const error_type = _.template(
	'The <%=propertyName%> parameter that is passed to the <%=functionName%> method cannot be set to the value <%=wrongValue%>. It must be of type <%=expectedType%>.'
)
export const error_length_in_range = _.template(
	'The value of <%=propertyName%> parameter that is passed to the <%=functionName%> method cannot be set to the value "<%=wrongValue%>". Its length must be between <%=minLength%> and <%=maxLength%>.'
)
export const error_length_accept_single_value = _.template(
	'The value of <%=propertyName%> parameter that is passed to the <%=functionName%> method cannot be set to the value "<%=wrongValue%>". Its length must be <%=acceptedLength%>.'
)
export const error_length_exceeds = _.template(
	'The value of <%=propertyName%> parameter that is passed to the <%=functionName%> method cannot be set to the value "<%=wrongValue%>" because its length exceeds <%=maxLength%>.'
)
