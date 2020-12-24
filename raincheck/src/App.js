import React, { Component } from 'react'; //imports React component
import logo from './logo.svg';
import './App.css';
import Header from './header';
import RainCheckBody from './rainCheckBody';
import { getPost } from './talkServer';

//function App() {
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: 'initial',
      zipcode: '98683',
      weather: {}  // JSON object with the 5 info needed: temp, rain chance, city, state, weather state (rain, sunny, cloudy, etc.)
    };
  }

  async loadData() {
    const response = await fetch(`https://raincheck.tk/api/getWeather/?zipcode=${98115}`, {
      "method": "GET"
    });
    if (response.status >= 300) {
      const error = response.text();
      return;
    }
    var data = await response.json();
    return data;
  }

  componentDidMount() {
    this.setState({ loading: 'true' });
    this.loadData()
      .then((result) => {
        this.setState({
            weather: result,
            loading: 'false'
        });
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

  // handleSubmit(event) {    //submit for zip weather lookup
  //     event.preventDefault();
  //     console.log("this went into the handleSubmit prop")
  //     // this.setState.weather = getPost(this.state.zipcode)
  //     getPost(this.state.zipcode).then((res) => {
  //         this.setState({weather: res});
  //     })
  //     return (
  //       <RainCheckBody weather={this.state.weather}/>
  //     );
  // }

  handleWeatherChange = (weatherData) => {
    this.setState({ weather: weatherData })
  }

  render() {
    if (this.state.loading === 'initial') {
      return <h2></h2>
    }
    if (this.state.loading === 'true') {
      return <h2></h2>
    }

    return (
      <div className="page">
        <header>
          <Header handleWeatherChange1={this.handleWeatherChange} />
        </header>
        <main>
          <RainCheckBody weather={this.state.weather} />
        </main>
        <footer className="footer">
            Connect With Us *email icon* <br/>
            Copyright &copy; 2020 RainCheck. <br/> All Rights Reserved.
        </footer>
      </div>
    );
  }
}

export default App;
