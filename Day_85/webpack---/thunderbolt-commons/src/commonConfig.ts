import type { CommonConfig, CommonConfigHeader } from '@wix/thunderbolt-symbols'

// https://github.com/wix-private/fed-infra/blob/87e30c76eee659b0cbb1d3fa431413c831cbae4e/wix-headers/src/headers/common-config.ts#L38
export const getCommonConfigHeader = (commonConfig: CommonConfig): CommonConfigHeader => {
	const commonConfigHeader: any = { ...commonConfig }
	// Needed since the Aspect in the server expects BSI according to it's proto: https://github.com/wix-private/fed-infra/blob/master/fed-infra-protos/src/main/proto/common-config.proto#L26
	commonConfigHeader.BSI = commonConfigHeader.bsi
	// using deny list instead so we don't need to manually add every new property
	delete commonConfigHeader.consentPolicyHeader
	delete commonConfigHeader.consentPolicy
	return commonConfigHeader
}
