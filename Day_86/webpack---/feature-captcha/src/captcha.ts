import { withDependencies } from '@wix/thunderbolt-ioc'
import {
	IStructureAPI,
	StructureAPI,
	Props,
	IPropsStore,
	DIALOG_COMPONENT_ID,
	ICyclicTabbing,
} from '@wix/thunderbolt-symbols'
import { CyclicTabbingSymbol } from 'feature-cyclic-tabbing'
import type { CaptchaDialogProps, ICaptchaApi } from './types'

/**
 * Exposing access to open and close the captcha dialog component in a site level
 */
export const Captcha = withDependencies(
	[StructureAPI, Props, CyclicTabbingSymbol],
	(structureApi: IStructureAPI, propsStore: IPropsStore, cyclicTabbing: ICyclicTabbing): ICaptchaApi => {
		return {
			open(props: CaptchaDialogProps) {
				cyclicTabbing.enableCyclicTabbing(DIALOG_COMPONENT_ID)
				propsStore.update({ [DIALOG_COMPONENT_ID]: props })
				structureApi.addComponentToDynamicStructure(DIALOG_COMPONENT_ID, {
					componentType: 'CaptchaDialog',
					components: [],
				})
			},
			close() {
				cyclicTabbing.disableCyclicTabbing(DIALOG_COMPONENT_ID)
				structureApi.removeComponentFromDynamicStructure(DIALOG_COMPONENT_ID)
			},
		}
	}
)
