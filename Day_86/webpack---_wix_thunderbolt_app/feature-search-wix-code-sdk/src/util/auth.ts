import { SEARCH_APP_DEF_ID } from '../constants'
import { SessionServiceAPI } from '../../../thunderbolt-symbols/src'

const APP_INSTALLATION_ERROR = new Error('Search application must be installed in order to use Search in Corvid')

export const getInstance = (sessionService: SessionServiceAPI): string => {
	try {
		const token = sessionService.getInstance(SEARCH_APP_DEF_ID)

		if (!token) {
			throw APP_INSTALLATION_ERROR
		}

		return token
	} catch (e) {
		throw APP_INSTALLATION_ERROR
	}
}
