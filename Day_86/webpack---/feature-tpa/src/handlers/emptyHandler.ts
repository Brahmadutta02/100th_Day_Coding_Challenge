import { withDependencies } from '@wix/thunderbolt-ioc'
import { TpaHandlerProvider } from '@wix/thunderbolt-symbols'

const noop = () => {}

export const EmptyHandlers = withDependencies(
	[],
	(): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				getSiteRevision: noop,
				getDeviceType: noop,
				toWixDate: noop,
				getCompId: noop,
				getOrigCompId: noop,
				getWidth: noop,
				isInModal: noop,
				getLocale: noop,
				getCacheKiller: noop,
				getTarget: noop,
				getInstanceId: noop,
				getSignDate: noop,
				getUid: noop,
				getPermissions: noop,
				getIpAndPort: noop,
				getDemoMode: noop,
				getInstanceValue: noop,
				getSiteOwnerId: noop,
				getImageUrl: noop,
				getResizedImageUrl: noop,
				getAudioUrl: noop,
				getDocumentUrl: noop,
				getSwfUrl: noop,
				getPreviewSecureMusicUrl: noop,
				getStyleParams: noop,
				getStyleColorByKey: noop,
				getColorByreference: noop,
				getSiteTextPresets: noop,
				getFontsSpriteUrl: noop,
				getStyleFontByKey: noop,
				getStyleFontByReference: noop,
				getSiteColors: noop,
				getViewModeInternal: noop,
				postMessage: noop,
				getEditorFonts: noop,
				setUILIBParamValue: noop,
				removeAppMetadata: noop,
				setAppMetadata: noop,
				setColorParam: noop,
				setStyleParam: noop,
				/**
				 * This editor handler resizes the component without affecting adjacent components
				 * it's the equivalent of using the editor's size toolbar
				 */
				resizeComponent: noop,
				setValue: noop,
				isSupported: noop,
				appEngaged: noop,
				getInstalledInstance: noop,
				isApplicationInstalled: noop,
				isCustomApplicationPermissionsGranted: noop,
				isGroupApplicationPermissionsGranted: noop,
				setFullWidth: noop,
			}
		},
	})
)
