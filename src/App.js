/* eslint-disable no-unused-vars, no-console*/
import React, { Component } from 'react';
import { GridGenerator, HexGrid, Layout, Hexagon, Text, Pattern } from 'react-hexgrid';
import axios from 'axios';
import './App.css';
import { setInterval } from 'timers';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {width: props.width, height: props.height};
  }

  componentWillMount(){
    this.setState({width: window.innerWidth, height: window.innerHeight});
  }

  componentDidMount() {
    this.fetchTiles();
    setInterval(this.fetchTiles.bind(this), 20);
    window.addEventListener('resize', this.onResize.bind(this));
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  fetchTiles() {
    axios.get('api/tiles')
      .then(res => this.setState({ tiles: res.data }))
      .catch(console.error);
  }

  onResize(){
    this.setState({width: window.innerWidth, height: window.innerHeight});
  }

  render() {
    const width = this.state.width + 1;
    const height = this.state.height + 1;
    const tiles = this.state.tiles;
    const grid = GridGenerator.orientedRectangle(32, 32);

    return (
      <div className="App">
        <HexGrid width={width} height={height} viewBox={'0 0 ' + width + ' ' + height}>
          <Layout size={{ x: (width/47), y: (height/54) }}>
            { grid.map((hex, i) => {
              const key = tiles ? tiles[i]['id'] : '';
              const color = tiles ? `${tiles[i]['name']
                .split(':')
                .reduce((acc, v, i, c) => {
                  if (i % 2 > 0) return acc;
                  acc.push(Math.floor((parseInt(c[i], 16) + parseInt(c[i+1], 16))/2).toString(16).padStart(2, '0'));
                  return acc;
                }, [])
                .join('')}` : 'fff';
              const tooltip = tiles ? tiles[i]['message'] : '';
              return <Hexagon key={key} q={hex.q} r={hex.r} s={hex.s} cellStyle={{fill: color}}><title>{tooltip}</title></Hexagon>;
            }) }
          </Layout>
        </HexGrid>
      </div>
    );
  }
}

export default App;
