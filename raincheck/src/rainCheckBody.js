import React, { Component } from 'react';  //import React component

export default class Rain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weather: {
                weatherName: this.props.weather.name,
                city: this.props.weather.city,
                state: this.props.weather.state,
                rainChance: this.props.weather.pop,
                temp: this.props.weather.temp
            }
        };
    }

    reRender() {
        this.setState({
            weather: {
                weatherName: this.props.weather.name,
                city: this.props.weather.city,
                state: this.props.weather.state,
                rainChance: this.props.weather.pop,
                temp: this.props.weather.temp
            }
        });
    }

    render() {
        if (this.props.weather.city !== this.state.weather.city) {
            this.reRender();
        }
        return (
            <div>
                {/* <h1> Weather Forecast: {this.state.weather.weatherName} </h1> */}
                <div class="widget">
                    <div class="left-panel panel">
                        <div class="city">
                            {this.state.weather.city}, {this.state.weather.state}
                        </div>
                        <div class="date">
                            Chance of Rain: {this.state.weather.rainChance}%
                        </div>                        
                        <div class="temp">
                        Temperature: {this.state.weather.temp}&deg;
                        </div>
                    </div>
                    <div class="right-panel panel">
                        <img src="https://s5.postimg.cc/yzcm7htyb/image.png" alt="" width="160" />
                    </div>
                </div>            
            </div>
        );
    }
}
