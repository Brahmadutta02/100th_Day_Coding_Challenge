import React from 'react'

export default class Profile extends React.Component{

    testFun()
    {
        alert("testFun")
    }

    render()
    {
        return(
            <div>
                <h1>Profile</h1>
                <button onClick={()=>{this.testFun()}}>Click Me</button>
            </div>
        )
    }
}