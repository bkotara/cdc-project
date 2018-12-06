import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Chart from './components/chart'
import MeasureSelect from './components/select_form'

const API_URL = window.location.hostname.startsWith("localhost") ? "http://localhost:3001/" : "/";

function fetch_endpoint(path) {
  return fetch(API_URL + path).then(response => {
    if(response.ok) {
      return response.json()
    } else {
      return Promise.reject(Error("Failed to hit endpoint"));
    }
  });
}

function fetch_data_for_measure(measure_id, locations=[]) {
  var query = locations.join(',');
  return fetch_endpoint("data/" + measure_id + (query === "" ? "" : ("?locations=" + query))).catch(err => Promise.reject('Failed to fetch data for measure: ' + measure_id));
}

class App extends Component {
  constructor(props) {
    super(props);
    this.handler = this.handler.bind(this);
    this.update_measure_data = this.update_measure_data.bind(this);
    this.options = [];
    this.locations = {};
    this.state = {
        x: {data: [], title: ""},
        y: {data: [], title: ""},
        measures: [0,1],
    };
  }

  componentDidMount() {
    Promise.all(["measures", "locations"].map(path => fetch_endpoint(path))).then(responses => {
      var locations = responses[1];
      delete locations["US"];
      this.locations = locations;
      this.options = Object.keys(responses[0]).map(label => { return {value: responses[0][label], label: label}});
    }).then(this.update_measure_data).catch(console.error);
  }

  update_measure_data() {
    return Promise.all(this.state.measures.map(measure_id => fetch_data_for_measure(measure_id, Object.values(this.locations)))).then(measure_data => {
      this.setState({
        x: { data: measure_data[0].data, title: "% " + this.options[this.state.measures[0]].label },
        y: { data: measure_data[1].data, title: "% " + this.options[this.state.measures[1]].label }
      });
    });
  }

  handler(index) {
    return (val) => {
      var measures = this.state.measures;
      measures[index] = val;
      this.setState({
        measures: measures
      });
      this.update_measure_data();
    }
  }

  render() {
    const {x, y} = this.state;    

    return (
      <div className="App">
        <div className="selectors">
          <div className="xselect">
            <h5>X-Axis</h5>
            <MeasureSelect selectedOption={this.state.measures[0]} options={this.options} handler={this.handler(0)} />
          </div>
          <div className="yselect">
            <h5>Y-Axis</h5>
            <MeasureSelect selectedOption={this.state.measures[1]} options={this.options} handler={this.handler(1)} />
          </div>
        </div>
        <Chart x={x} y={y} labels={Object.keys(this.locations)}/>
      </div>
    );
  }
}

export default App;
