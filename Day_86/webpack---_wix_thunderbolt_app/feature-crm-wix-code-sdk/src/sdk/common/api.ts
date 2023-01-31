export const post = async ({ url, instanceId, body }) => {
	const res = await fetch(url, {
		method: 'post',
		headers: {
			'x-wix-client-artifact-id': 'wix-crm-thunderbolt',
			Authorization: instanceId,
			Accept: 'application/json',
		},
		credentials: 'same-origin',
		body: JSON.stringify(body),
	})
	if (!res.ok) {
		return Promise.reject(await formatPlatformizedHttpError(res))
	}
	return res.json()
}

export const formatPlatformizedHttpError = async function (response: any) {
	const status = response.status,
		responseText = await response?.text()
	if (!status && !responseText) {
		return response
	}
	if (status === 400) {
		return 'Bad Request: please check the user inputs.'
	}
	if (status === 404) {
		return 'Not Found: the requested item no longer exists.'
	}
	let errorMessage
	try {
		errorMessage = JSON.parse(responseText).message
	} catch (e) {}
	return (errorMessage || 'unknown failure') + ' (' + (status || 0) + ')'
}
