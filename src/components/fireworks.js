
import React, { Component } from 'react'


export default class Fireworks extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="pyro">
                <div className="before"></div>
                <div className="after"></div>
            </div>
        )
    }
}
