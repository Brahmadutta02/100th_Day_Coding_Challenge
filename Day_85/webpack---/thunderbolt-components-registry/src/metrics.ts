export interface IRegistryRunAndReport {
	runAndReport: <T>(metric: string, fn: () => Promise<T>) => Promise<T>
}

const env = process.env.browser ? 'client' : 'ssr'

export function getReportMetricName({ host, cached }: { host: string; cached?: boolean }) {
	const suffix = cached ? `_cached` : ''
	return `create_registry_${host}_${env}${suffix}`
}
