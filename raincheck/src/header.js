import React, { Component, useState } from 'react';  //import React component
import { Link } from 'react-router-dom';
//import { Container } from './subscribe';
//import { PostUser } from './talkServer';
import { getPost } from './talkServer';
import Rain from './rainCheckBody';
import { Subscribe } from './subscriberNEW';
import { Button, Form, Input } from 'antd';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            zipcode: '',
            weather: {}
        };

        this.handleZipChange = this.handleZipChange.bind(this);
    }
    
    handleZipChange(event) {
        this.setState({zipcode: event.target.value});
        // this.props.handleZipVal(this.state.zipcode);
    }

    // handleSubmit(event) {    //submit for zip weather lookup    (Q for Kaz: will my GetZip auto update the state for weather with data from api?)--------------------
    //     event.preventDefault();
    //     if (this.state.zipcode !== '') {
    //         return (
    //             <div>
    //                 {GetZip.getPost()}
    //                 <Rain weather={this.state.weather} />
    //             </div>
    //         );
    //     }
    // }    

    // handleSubmit = (event) => {
    //     this.handleSubmit(event);
    // }

    // handleSubmit(event) {    //submit for zip weather lookup    (Q for Kaz: will my GetZip auto update the state for weather with data from api?)--------------------
    //     event.preventDefault();
    //     if (this.state.zipcode !== '') {
    //         {GetZip}
    //     }
    // }   

    handleSubmit(event) {    //submit for zip weather lookup
        event.preventDefault();
        if (this.state.zipcode !== '') {
            // this.setState.weather = getPost(this.state.zipcode)
            getPost(this.state.zipcode).then((res) => {
                this.setState({weather: res});
                this.props.handleWeatherChange1(res);
            })
        }
    }
   
    // handleSubscribeSubmit(event) {  //submit for subscribe to notifications w/ email
    //     event.preventDefault();
    //     if (event.target.zipcode.value !== '' && event.target.email.value !== '') {
    //         <PostUser zipcode={event.target.zipcode.value} email={event.target.email.value} />
    //     }
    //     //console.log(event.target.zipcode.value);
    //     //console.log(event.target.email.value)
    // }

    render() {
        return (
            <div className="headerRainCheck">
                <nav className="navbar navbar-expand-lg navbar-light">
                    <Link to='/' className="rainCheck"><img className="headimg" src="img/umbrella.png" alt="RainCheck Icon" />RainCheck</Link>
                    <Input className="header-input" id="zip" type="number" placeholder="Zip Code" aria-label="Search" value={this.props.zipcode} onChange={(event) => this.handleZipChange(event)} />
                    <Button className="btn btn-outline-info header-button" onClick={(event) => this.handleSubmit(event)}>Search Me</Button>
                    {/* <Container triggerText={'+Get Notified+'} onSubmit={this.handleSubscribeSubmit} /> */}
                    {/* <Container triggerText={'+Get Notified+'} /> */}
                    <Subscribe />
                </nav>
            </div>
        );
    }
}

export default Header;