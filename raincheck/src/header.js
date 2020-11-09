import React, { Component } from 'react';  //import React component
import { Link } from 'react-router-dom';
import Subscriber from './subscribe';
import PostUser from './talkServer';
import GetZip from './talkServer';
import Rain from './rainCheckBody';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userEmail: '',
            userPhone: '',
            zipValue: ''
        };

        this.handleUserEmail = this.handleUserEmail.bind(this);
        this.handleUserPhone = this.handleUserPhone.bind(this);
        this.handleZipChange = this.handleZipChange.bind(this);
    }
    
    handleUserEmail(event) {
        this.setState({userEmail: event.target.value, userPhone: this.state.userPhone, zipValue: this.state.zipValue})
    }

    handleUserPhone(event) {
        this.setState({userEmail: this.state.userEmail, userPhone: event.target.value, zipValue: this.state.zipValue})
    }

    handleZipChange(event) {
        this.setState({userEmail: this.state.userEmail, userPhone: this.state.userPhone, zipValue: event.target.value})
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.zipValue !== '') {
            <GetZip zipValue={this.state.zipValue} />
            //<Rain zipValue={this.state.zipValue} />
        }
    }    
    
    handleNotifySubmit(event) {
        event.preventDefault();
        if (this.state.zipValue !== '') {
            <Subscriber zipValue={this.state.zipValue} /> // pass the zipValue to the subscribe.js
            
        }
    }    

    render() {
        return (
            <div className="headerRainCheck">
                <nav className="navbar fixed-top navbar-expand-lg navbar-light">
                    <Link to='/' className="rainCheck"><img src="img/Umbrella.png" alt="RainCheck Icon" />RainCheck</Link>
                    <form className="form-inline my-2 my-lg-0" onSubmit={(event) => this.handleSubmit(event)}>
                        <input className="form-control mr-sm-2" id="zip" type="number" placeholder="Zip Code" aria-label="Search" value={this.props.zipVal} onChange={(event) => this.handleZipChange(event)} />
                        <button className="btn btn-outline-info my-2 my-sm-0" type="submit">Search</button>
                    </form>
                </nav>
            </div>
        );
    }
}

export default Header;