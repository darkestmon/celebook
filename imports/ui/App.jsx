import React, {Component} from 'react';
import CelebrityList from './CelebrityList.jsx';

export default class App extends Component {
  render () {
    return (
      <div>
        <h1>Celebrities</h1>
        <CelebrityList/>
      </div>
    )
  }
}
