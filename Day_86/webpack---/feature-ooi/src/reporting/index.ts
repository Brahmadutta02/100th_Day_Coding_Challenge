import { ScopeContext } from '@sentry/types'
import { withDependencies } from '@wix/thunderbolt-ioc'
import { ViewerModel, ViewerModelSym } from '@wix/thunderbolt-symbols'
import LazySentry from '../lazySentry'

export type Reporter = { reportError: (error: Error, dsn?: string, context?: Partial<ScopeContext>) => void }
export const OOIReporterSymbol = Symbol('OOIReporter')

export default withDependencies(
	[ViewerModelSym],
	({ requestUrl: url }: ViewerModel): Reporter => {
		return {
			reportError: (error, dsn?, context?) => {
				if (dsn) {
					const sentry = new LazySentry({ dsn })
					sentry.captureException(error, {
						captureContext: {
							...context,
							tags: {
								platform: 'true',
								isSSR: `${!process.env.browser}`,
								url,
								...context?.tags,
							},
						},
					})
				}
			},
		}
	}
)
