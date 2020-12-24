import React, { Component } from 'react';

export class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            zipcode: ""
        }
    }

    //TODO
    //change from body json to query style 
    onSubmit = async (e) => {
        e.preventDefault();
        const { email } = this.state;
        const { zipcode } = this.state;
        const sendData = { email, zipcode };
        const response = await fetch("https://raincheck.tk/api/addUser", {
            method: "POST",
            body: JSON.stringify(sendData),
            headers: new Headers({
                "Content-Type":"application/json"
            })
        });
        if (response.status >= 300) {
            const error = await response.text();
            console.log(error);
            return;
        }
        //alert("Error subscribing to RainCheck");
    }

/////////////////////////////////////////////////////////////////////
    /*fetch('https://example.com?' + new URLSearchParams({
        foo: 'value',
        bar: 2,
    }))*/
/////////////////////////////////////////////////////////////////////

    setValue = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const { email, zipcode } = this.state;
        return (
            <form onSubmit={(e) => this.onSubmit(e)}>
            <div className="form-group">
                <label htmlFor="name">Zip Code</label>
                <input className="form-control" id="name" name={"zipcode"} placeholder="98105" onChange={this.setValue} value={zipcode}/>
            </div> 
            
            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" className="form-control" id="email" name={"email"} placeholder="johnny@example.com" onChange={this.setValue} value={email}/>
            </div>
            <div className="form-group">
                <button className="form-control btn btn-primary" type="submit">
                    Subscribe
                </button>
            </div>
            </form>
        );
    }
}
