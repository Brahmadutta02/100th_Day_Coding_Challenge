// @ts-nocheck

/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/**
 * This shim allows elements written in, or compiled to, ES5 to work on native
 * implementations of Custom Elements v1. It sets new.target to the value of
 * this.constructor so that the native HTMLElement constructor can access the
 * current under-construction element's definition.
 */

/* eslint strict:0*/
export default function (contextWindow) {
	if (
		// No Reflect, no classes, no need for shim because native custom elements
		// require ES2015 classes or Reflect.
		contextWindow.Reflect === undefined ||
		contextWindow.customElements === undefined ||
		// The webcomponentsjs custom elements polyfill doesn't require
		// ES2015-compatible construction (`super()` or `Reflect.construct`).
		contextWindow.customElements.hasOwnProperty('polyfillWrapFlushCallback')
	) {
		return
	}
	const BuiltInHTMLElement = contextWindow.HTMLElement
	contextWindow.HTMLElement = /** @this {!Object} */ function HTMLElement() {
		return contextWindow.Reflect.construct(BuiltInHTMLElement, [], /** @type {!Function} */ this.constructor) // eslint-disable-line no-extra-parens
	}
	contextWindow.HTMLElement.prototype = BuiltInHTMLElement.prototype
	contextWindow.HTMLElement.prototype.constructor = contextWindow.HTMLElement
	contextWindow.Object.setPrototypeOf(contextWindow.HTMLElement, BuiltInHTMLElement)
}
