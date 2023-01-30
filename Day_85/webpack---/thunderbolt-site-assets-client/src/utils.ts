import { Experiments } from '@wix/thunderbolt-symbols'

export function stringifyExperiments(beckyExperiments: Experiments): string {
	return Object.entries(beckyExperiments)
		.map((experiment) => `${experiment[0]}:${experiment[1]}`)
		.join(',')
}
