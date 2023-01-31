import type { Language } from '@wix/thunderbolt-becky-types'
import type { Translations, TranslatedLanguage } from './types'

// https://github.com/wix-private/santa-langs/tree/master/src/main/resources/santa-viewer/bundles
const languageLoader: { [language in TranslatedLanguage]: () => Promise<{ default: Translations }> } = {
	ar: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_ar.json' /* webpackChunkName: "santa-langs-ar" */
		),
	bg: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_bg.json' /* webpackChunkName: "santa-langs-bg" */
		),
	ca: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_ca.json' /* webpackChunkName: "santa-langs-ca" */
		),
	zh: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_zh.json' /* webpackChunkName: "santa-langs-zh" */
		),
	cs: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_cs.json' /* webpackChunkName: "santa-langs-cs" */
		),
	da: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_da.json' /* webpackChunkName: "santa-langs-da" */
		),
	nl: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_nl.json' /* webpackChunkName: "santa-langs-nl" */
		),
	fi: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_fi.json' /* webpackChunkName: "santa-langs-fi" */
		),
	fr: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_fr.json' /* webpackChunkName: "santa-langs-fr" */
		),
	de: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_de.json' /* webpackChunkName: "santa-langs-de" */
		),
	el: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_el.json' /* webpackChunkName: "santa-langs-el" */
		),
	he: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_he.json' /* webpackChunkName: "santa-langs-he" */
		),
	hi: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_hi.json' /* webpackChunkName: "santa-langs-hi" */
		),
	hu: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_hu.json' /* webpackChunkName: "santa-langs-hu" */
		),
	id: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_id.json' /* webpackChunkName: "santa-langs-id" */
		),
	it: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_it.json' /* webpackChunkName: "santa-langs-it" */
		),
	ja: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_ja.json' /* webpackChunkName: "santa-langs-ja" */
		),
	jp: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_ja.json' /* webpackChunkName: "santa-langs-ja" */
		),
	ko: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_ko.json' /* webpackChunkName: "santa-langs-ko" */
		),
	kr: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_ko.json' /* webpackChunkName: "santa-langs-ko" */
		),
	lt: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_lt.json' /* webpackChunkName: "santa-langs-lt" */
		),
	ms: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_ms.json' /* webpackChunkName: "santa-langs-ms" */
		),
	no: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_no.json' /* webpackChunkName: "santa-langs-no" */
		),
	pl: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_pl.json' /* webpackChunkName: "santa-langs-pl" */
		),
	pt: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_pt.json' /* webpackChunkName: "santa-langs-pt" */
		),
	ro: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_ro.json' /* webpackChunkName: "santa-langs-ro" */
		),
	ru: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_ru.json' /* webpackChunkName: "santa-langs-ru" */
		),
	es: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_es.json' /* webpackChunkName: "santa-langs-es" */
		),
	sk: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_sk.json' /* webpackChunkName: "santa-langs-sk" */
		),
	sl: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_sl.json' /* webpackChunkName: "santa-langs-sl" */
		),
	sv: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_sv.json' /* webpackChunkName: "santa-langs-sv" */
		),
	tl: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_tl.json' /* webpackChunkName: "santa-langs-tl" */
		),
	th: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_th.json' /* webpackChunkName: "santa-langs-th" */
		),
	tr: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_tr.json' /* webpackChunkName: "santa-langs-tr" */
		),
	uk: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_uk.json' /* webpackChunkName: "santa-langs-uk" */
		),
	vi: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_vi.json' /* webpackChunkName: "santa-langs-vi" */
		),
	en: () =>
		import(
			'@wix/santa-langs/dist/statics/resources/santa-viewer/bundles/_generated/santa_viewer_en.json' /* webpackChunkName: "santa-langs-en" */
		),
}

export const getTranslation = async (userLanguage: Language) => {
	const translationLoader = languageLoader[userLanguage as TranslatedLanguage] || languageLoader.en!
	const translationModule = await translationLoader()
	return translationModule.default
}
