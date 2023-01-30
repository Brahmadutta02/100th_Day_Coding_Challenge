export const importEditorSdkFactory = async () => {
	const { EditorSdkFactory } =
		process.env.PACKAGE_NAME === 'thunderbolt-ds'
			? await import('feature-editor-wix-code-sdk/dsFactory' /* webpackChunkName: "feature-ds-editor-wix-code-sdk" */)
			: await import('feature-editor-wix-code-sdk/factory' /* webpackChunkName: "feature-editor-wix-code-sdk" */)
	return EditorSdkFactory
}
