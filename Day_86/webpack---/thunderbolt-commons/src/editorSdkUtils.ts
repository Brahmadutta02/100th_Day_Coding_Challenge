import { getEditorSDKurl } from '@wix/platform-editor-sdk/lib/loader'
import { EditorSDKModule, EditorSDK, ApplicationContextOptions } from '@wix/platform-editor-sdk'

export interface InitEditorSdkOptions {
	loadEditorScript: (sdkScriptSrc: string) => Promise<unknown>
	sendMessageToEditor: (ev: MessageEvent) => void
	getWindowUrl: () => string
}

export const initEditorSdk = async (options: InitEditorSdkOptions): Promise<EditorSDK> => {
	const { sendMessageToEditor, loadEditorScript, getWindowUrl } = options
	const channel = new MessageChannel()

	const windowUrl = getWindowUrl()
	const params = new URL(windowUrl).searchParams
	const sdkVersion = params.get('sdkVersion')
	const appDefinitionId = params.get('appDefinitionId')
	const applicationIdParam = params.get('applicationId')

	if (!applicationIdParam || !appDefinitionId) {
		throw new Error('Could not find application id params')
	}

	if (typeof appDefinitionId !== 'string') {
		throw new Error('appDefinitionId should be string')
	}

	const applicationId = Number(applicationIdParam)

	if (isNaN(applicationId)) {
		throw new Error('Could not parse applicationId')
	}

	if (!sdkVersion) {
		throw new Error('Could not find sdkVersion')
	}

	const contextOptions: ApplicationContextOptions = {
		applicationId,
		appDefinitionId,
	}

	channel.port1.onmessage = (ev) => {
		sendMessageToEditor(ev)
	}

	const sdkScriptSrc = getEditorSDKurl(windowUrl)

	await loadEditorScript(sdkScriptSrc)

	await editorSDK.__initWithTarget(channel.port2, [], '')

	return editorSDK.getBoundedSDK(contextOptions)
}

declare const editorSDK: EditorSDKModule
