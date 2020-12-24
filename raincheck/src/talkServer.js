import { Component } from 'react';  //import React component

// class GetZip extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             zipcode: this.props.zipcode,
//             weather: {}
//         };
//         console.log("IN TALKSERVER BITCH")
//         console.log(this.state.zipcode)
//     }

//     getPost() {
//         fetch(`https://raincheck.tk/api/getWeather/?zipcode=${this.state.zipcode}`, {
//         "method": "GET",
//         })
//         .then((res) => res.json())
//         .then((data) => {
//             this.setState({zipcode: this.state.zipcode, weather: data});
//             console.log("IT WORKEDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")
//         }).catch((error) => {
//             this.showError(error);
//         });          
//     }
// }

export async function getPost(zipcode) {
    let weather;
    await fetch(`https://raincheck.tk/api/getWeather/?zipcode=${zipcode}`, {
    "method": "GET",
    })
    .then((res) => res.json())
    .then((data) => {
        weather = data;
    }).catch((error) => {
        this.showError(error);
    });
    return weather;
}




// export class PostUser extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             zipcode: this.props.zipcode,
//             email: this.props.email
//         };
//     }

//     post() {
//     fetch('https://raincheck.tk/api/addUser', {   //verify with Kaz that this is right way to POST to api ------------------------------------
//         method: 'POST',
//         body: `zipcode=${this.state.zipcode}&email=${this.state.email}`})
//         .then(res => res.json())
//         .catch(error => console.error('Error:', error))
//         .then(response => console.log('Success:', response));
//     }

//     render() {
//         return this.post()
//     }
// }
