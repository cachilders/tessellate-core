/* eslint-disable no-unused-vars, no-console*/
import React, { Component } from 'react';
import { GridGenerator, HexGrid, Layout, Hexagon, Text, Pattern } from 'react-hexgrid';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {width: props.width, height: props.height};
  }

  componentWillMount(){
    this.setState({width: window.innerWidth, height: window.innerHeight});
  }

  componentDidMount() {
    axios.get('api/tiles')
      .then(res => this.setState({ tiles: res.data }))
      .catch(console.error);
    window.addEventListener('resize', this.onResize.bind(this));
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize.bind(this));
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
              const color = tiles ? `${tiles[i]['name'].split(':').slice(1, 4).join('')}` : 'fff';
              return <Hexagon key={i} q={hex.q} r={hex.r} s={hex.s} cellStyle={{fill: color}} />;
            }) }
          </Layout>
        </HexGrid>
      </div>
    );
  }
}

export default App;
