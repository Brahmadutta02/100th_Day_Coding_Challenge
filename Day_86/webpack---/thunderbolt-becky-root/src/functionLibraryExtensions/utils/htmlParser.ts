// Regular Expressions for parsing tags and attributes
const startTag = /^<([-A-Za-z0-9_?:]+)((?:\s+(?:x:)?[-A-Za-z0-9_]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/
const endTag = /^<\/([-A-Za-z0-9_?:]+)[^>]*>/
const attr = /((?:x:)?[-A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g

// Empty Elements - HTML 4.01
const empty = makeMap('area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed')

// Block Elements - HTML 4.01
const block = makeMap(
	'address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul'
)

// Inline Elements - HTML 4.01
const inline = makeMap(
	'a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var'
)

// Elements that you can, intentionally, leave open
// (and which close themselves)
const closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr')

// Attributes that have their values filled in disabled="disabled"
const fillAttrs = makeMap(
	'checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected'
)

// Special Elements (can contain anything)
const special = makeMap('script,style')

function handleChars(all: any, text: string) {
	text = text.replace(/<!--(.*?)-->/g, '$1').replace(/<!\[CDATA\[(.*?)]]>/g, '$1')

	// @ts-ignore
	if (this.chars) {
		// @ts-ignore
		this.chars(text)
	}
	return ''
}

type Attributes = Array<Partial<{ name: string; value: string; escaped: string }>>
type Start = (tagName: string, attributes: Attributes, unary: boolean, tag: string) => void

// there is a type in the schema of the component - WRichTextDefinition['data'].text
type Handler = Partial<{ comment: any; start: Start; chars: any; end: any }>
export const HTMLParser = (html: string, handler: Handler) => {
	let index
	let chars
	let match
	let last = html
	/**
	 * @type {(string[]) & {last?: function():*}}
	 */
	const stack: Array<string> & { last?: () => string } = []
	stack.last = function () {
		return this[this.length - 1]
	}

	while (html) {
		chars = true

		// Make sure we're not in a script or style element
		if (!stack.last() || !special[stack.last()]) {
			// Comment
			if (html.indexOf('<!--') === 0) {
				index = html.indexOf('-->')

				if (index >= 0) {
					// maybe we can remove all of this?

					if (handler.comment) {
						handler.comment(html.substring(4, index))
					}
					html = html.substring(index + 3)
					chars = false
				}

				// end tag
			} else if (html.indexOf('</') === 0) {
				match = html.match(endTag)

				if (match) {
					html = html.substring(match[0].length)
					// @ts-ignore
					match[0].replace(endTag, parseEndTag)
					chars = false
				}

				// start tag
			} else if (html.indexOf('<') === 0) {
				match = html.match(startTag)

				if (match) {
					html = html.substring(match[0].length)
					// @ts-ignore
					match[0].replace(startTag, parseStartTag)
					chars = false
				}
			}

			if (chars) {
				index = html.indexOf('<')

				const text = index < 0 ? html : html.substring(0, index)
				html = index < 0 ? '' : html.substring(index)

				if (handler.chars) {
					handler.chars(text)
				}
			}
		} else {
			html = html.replace(new RegExp(`(.*)</${stack.last()}[^>]*>`, 'i'), handleChars.bind(handler))

			parseEndTag('', stack.last())
		}

		if (html === last) {
			throw `Parse Error: ${html}` // eslint-disable-line no-throw-literal
		}
		last = html
	}

	// Clean up any remaining tags
	parseEndTag()

	function parseStartTag(tag: string, tagName: string, rest: string, unary: boolean) {
		tagName = tagName.toLowerCase()

		if (block[tagName]) {
			// @ts-ignore
			while (stack.last() && inline[stack.last()]) {
				// @ts-ignore
				parseEndTag('', stack.last())
			}
		}

		// @ts-ignore
		if (closeSelf[tagName] && stack.last() === tagName) {
			parseEndTag('', tagName)
		}

		unary = empty[tagName] || !!unary

		if (!unary) {
			stack.push(tagName)
		}

		if (handler.start) {
			const attrs: Attributes = []

			// @ts-ignore
			rest.replace(attr, function (mtch, name) {
				let value = null
				for (let i = 2; i < 5; i++) {
					// eslint-disable-next-line prefer-rest-params
					if (value === null && arguments[i]) {
						// eslint-disable-next-line prefer-rest-params
						value = arguments[i]
						break
					}
				}
				if (value === null && fillAttrs[name]) {
					value = name
				}
				if (value === null) {
					value = ''
				}

				attrs.push({
					name,
					value,
					escaped: value.replace(/(^|[^\\])"/g, '$1\\"'), // "
				})
			})

			if (handler.start) {
				handler.start(tagName, attrs, unary, tag)
			}
		}
	}

	function parseEndTag(tag?: string, tagName?: string) {
		// If no tag name is provided, clean shop
		let pos
		if (!tagName) {
			pos = 0
		} else {
			// Find the closest opened tag of the same type
			for (pos = stack.length - 1; pos >= 0; pos--) {
				if (stack[pos] === tagName) {
					break
				}
			}
		}

		if (pos >= 0) {
			// Close all the open elements, up the stack
			for (let i = stack.length - 1; i >= pos; i--) {
				if (handler.end) {
					handler.end(stack[i])
				}
			}

			// Remove the open elements from the stack
			stack.length = pos
		}
	}
}

function makeMap(str: string): Partial<{ [key: string]: boolean }> {
	const obj: Partial<{ [key: string]: boolean }> = {}
	const items = str.split(',')
	for (const item of items) {
		obj[item] = true
	}
	return obj
}
