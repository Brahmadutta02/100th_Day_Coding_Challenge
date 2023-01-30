import { initCustomElements } from '@wix/thunderbolt-custom-elements'
import { instance as biService } from '../bi-module/instance'

const { experiments, media, requestUrl } = window.viewerModel
initCustomElements({ experiments, media, requestUrl }, biService)
