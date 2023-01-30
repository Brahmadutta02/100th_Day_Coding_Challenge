import { IControllersExports } from '../types'
import { CONTROLLERS_EXPORTS } from './moduleNames'

const controllersExports: IControllersExports = {}

const ControllersExports = (): IControllersExports => controllersExports

export default {
	factory: ControllersExports,
	deps: [],
	name: CONTROLLERS_EXPORTS,
}
