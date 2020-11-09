import React, { Component } from 'react'; //imports React component
//import logo from './logo.svg';
import './App.css';
//import { render } from 'react-dom';
//import { Route, Switch, Redirect } from 'react-router-dom';  //if we decide to make different pages apart from home page then enable this
import Header from './header';
import * as RainCheckBody from './rainCheckBody';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weather: {}  // JSON object with the 5 info needed: temp, rain chance, city, state, weather state (rain, sunny, cloudy, etc.)
    };
  }

  componentDidMount() {
    fetch(`https://raincheck.tk/api/getWeather/?zipcode=${userInputtedZipcode}`, {
      "method": "GET",
    })
    .then((res) => res.json())
    .then((data) => {
      this.setState({weather: data});
    }).catch((error) => {
      this.showError(error);
    });
  }

  // help from https://www.peterbe.com/plog/displaying-fetch-errors-in-react
  showError({ error }) {
    if (!error) {
      return null;
    }
    return (
      <div className="alert">
        <h1>Error</h1>
        {error instanceof window.Response ? (
          <p>
            <b>{error.status}</b> on <b>{error.url}</b>
            <br />
            <small>{error.statusText}</small>
          </p>
        ) : (
          <p>
            <code>{error.toString()}</code>
          </p>
        )}
      </div>
    );
  }

  render() {
    return (
      <div>
        <header>
          <Header />
        </header>
        <main>
            <RainCheckBody weather={this.state.weather} />
        </main>
        <footer>
          <div className="copyright">
            Connect With Us *email icon* <br/>
            Copyright &copy; 2020 RainCheck. <br/> All Rights Reserved.
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
