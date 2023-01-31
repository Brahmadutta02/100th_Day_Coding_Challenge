import React, { ComponentType } from 'react'

type TpaWorkerProps = {
	id: string
	src: string
	title: string
	seoHtmlContent?: string
}

const TPAWorker: ComponentType<TpaWorkerProps> = (props) => {
	const IFRAME_CROSS_DOMAIN_PERMISSIONS = ['autoplay', 'camera', 'microphone', 'geolocation', 'vr'].join(';')
	const { id, src, title } = props || {}
	return (
		<div id={id}>
			<iframe
				style={{ display: 'none' }}
				name={id}
				allowFullScreen={true}
				// @ts-ignore
				allowTransparency="true"
				allowvr="true"
				frameBorder="0"
				src={src}
				title={title}
				allow={IFRAME_CROSS_DOMAIN_PERMISSIONS}
			/>
		</div>
	)
}

export default TPAWorker
