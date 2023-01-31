import {
	SeoWixCodeSdkFactoryState,
	SeoVeloState,
	SeoVeloPayload,
	SeoFactoryState,
	InitialTagsPayload,
} from '../../types'
import { DEFAULT_STATUS_CODE, SeoTagsPayload } from 'feature-seo'
import {
	getTitle,
	getLinks,
	getMetaTags,
	getSchemas,
	getInitialTags,
	getDefaultItemPayload,
} from '@wix/advanced-seo-utils/renderer-api'
import { getVeloTags } from './get-velo-overrides'

const generateVeloState = ({
	tags = [],
	seoStatusCode = DEFAULT_STATUS_CODE,
	userOverrides = {},
	itemPayload = getDefaultItemPayload(),
	tpaOverrides = [] as Array<any>,
	dynamicPageData = [] as Array<any>,
	componentsItemPayload = [] as Array<SeoTagsPayload>,
}): SeoWixCodeSdkFactoryState => ({
	velo: {
		title: getTitle(tags) || '',
		links: getLinks(tags) || [],
		metaTags: getMetaTags(tags) || [],
		structuredData: getSchemas(tags) || [],
		seoStatusCode,
	},
	userOverrides,
	itemPayload,
	tpaOverrides,
	dynamicPageData,
	componentsItemPayload,
})

const initState = (payload: InitialTagsPayload): SeoFactoryState => {
	const { siteLevelSeoData, pageLevelSeoData } = payload
	const state: SeoFactoryState['state'] = generateVeloState({ ...payload, tags: getInitialTags(payload) })
	const setVeloState: SeoFactoryState['setVeloState'] = (partialState) => {
		state.velo = { ...state.velo, ...partialState }
		state.userOverrides = { ...state.userOverrides, ...partialState }
	}
	const setState: SeoFactoryState['setState'] = async (newVeloPayload) => {
		const veloPayload = {
			siteLevelSeoData,
			pageLevelSeoData,
			userOverrides: state.userOverrides,
			tpaOverrides: state.tpaOverrides,
			dynamicPageData: state.dynamicPageData,
			componentsItemPayload: state.componentsItemPayload,
			...newVeloPayload,
		}
		const newState = await generateState(veloPayload)
		Object.assign(state, newState)
	}

	return { state, setVeloState, setState }
}

const generateState = async (payload: SeoVeloPayload): Promise<SeoWixCodeSdkFactoryState> => {
	const {
		siteLevelSeoData,
		pageLevelSeoData,
		veloState = {} as SeoVeloState,
		veloItemPayload = getDefaultItemPayload(),
		userOverrides = {},
		tpaOverrides = [] as Array<any>,
		dynamicPageData = [] as Array<any>,
		componentsItemPayload = [] as Array<SeoTagsPayload>,
	} = payload
	const { seoStatusCode } = veloState
	const api = await import('@wix/advanced-seo-utils/async' /* webpackChunkName: "seo-async-api" */)
	const veloOverrides = await getVeloTags(veloState)
	const tags = await api.getTags({
		siteLevelSeoData,
		pageLevelSeoData,
		veloOverrides,
		veloItemPayload,
		tpaOverrides,
		dynamicPageData,
		componentsItemPayload,
	})

	const generatedState = generateVeloState({
		tags,
		seoStatusCode,
		userOverrides,
		itemPayload: veloItemPayload,
		tpaOverrides,
		dynamicPageData,
		componentsItemPayload,
	})

	return generatedState
}
export { initState }
