import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {Line, Bar} from 'react-chartjs-2';
import './index.css';

class Root extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="user-info"> 
          <UserInfo />
        </div>
        <div className="filters"> 
          <Filters />
        </div>
        <div className="Graph">
          <Graph/>
        </div>
      </div>
    )
  }
}

const rootElement = document.getElementById("root");
document.title = "AOE2 STATS"
ReactDOM.render(<Root />, rootElement);