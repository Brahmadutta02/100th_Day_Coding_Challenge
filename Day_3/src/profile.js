import React from 'react'

export default class Profile extends React.Component{
    constructor(){
        super();
        this.state = {
            name:'Harry',
            email:'harrypotter@gmail.com',
            count: 0
        }
    }
    updateState()
    {
        this.setState({
            name:'Potter',
            count: this.state.count+1
        })
    }
    render()
    {
        return(
            <div>
                <h1>Hello {this.state.name}</h1>
                <h1>Email: {this.state.email}</h1>
                <h1>count: {this.state.count}</h1>
                <button onClick={()=>{this.updateState()}}>Update Name</button>
            </div>
        )
    }
}