import React, { ComponentType } from 'react'

export type AppControllerCompProps = {
	id: string
}

const AppController: ComponentType<AppControllerCompProps> = ({ id }) => {
	return <div id={id} style={{ display: 'none' }}></div>
}

export default AppController
