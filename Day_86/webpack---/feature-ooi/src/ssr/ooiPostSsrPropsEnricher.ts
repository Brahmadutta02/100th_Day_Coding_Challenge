import _ from 'lodash'
import { withDependencies } from '@wix/thunderbolt-ioc'
import { IAppWillRenderFirstPageHandler, IAppDidMountHandler, IPropsStore, Props } from '@wix/thunderbolt-symbols'
import { IWarmupDataProvider, WarmupDataProviderSymbol } from 'feature-warmup-data'
import { OOIWarmupData } from '../types'

export default withDependencies<IAppDidMountHandler & IAppWillRenderFirstPageHandler>(
	[WarmupDataProviderSymbol, Props],
	(warmupDataProvider: IWarmupDataProvider, props: IPropsStore) => ({
		appWillRenderFirstPage: async () => {
			const ooiWarmupData = await warmupDataProvider.getWarmupData<OOIWarmupData>('ooi')
			_.forEach(ooiWarmupData?.failedInSsr, (__, compId) => {
				props.update({
					[compId]: {
						__VIEWER_INTERNAL: {
							failedInSsr: true,
						},
					},
				})
			})
		},
		appDidMount: async () => {
			const ooiWarmupData = await warmupDataProvider.getWarmupData<OOIWarmupData>('ooi')
			_.forEach(ooiWarmupData?.failedInSsr, (__, compId) => {
				props.update({
					[compId]: {
						__VIEWER_INTERNAL: {},
					},
				})
			})
		},
	})
)
