/**
 A LIST CONTAIN THE EVENTS THAT WILL NOT BE MUTED
 */
export const ThunderboltMutingBlackList: Set<string> = new Set([
	'page-navigation',
	'page_features_loaded',
	'multilingual_init',
	'partially_visible',
	'script_loaded',
	'init_app_for_page',
	'create_controllers',
	'controller_page_ready',
	'await_controller_promise',
	'controller_script_loaded',
])
/**
 A LIST CONTAIN THE EVENTS THAT WILL ALWAYS BE MUTED
 */
export const ThunderboltMutingWhiteList: Set<string> = new Set([
	// 'page_features_loaded', FOR EXAMPLE
])

export const AppsMutingWhiteList: Set<string> = new Set([
	'1380b703-ce81-ff05-f115-39571d94dfcd', // ECOM
])
