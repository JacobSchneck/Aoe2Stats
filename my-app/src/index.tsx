// Jacob Schneck
// Project Thing

// Not good enough at react to type everything yet but someday
// @ts-nocheck

/********************************************** IMPORTS ****************************************************/
import React from 'react';
// import {createContex, useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {Bar} from 'react-chartjs-2';
import { PropTypes } from 'react'
import './index.css';


/********************************************** GLOBALS ****************************************************/
// const EXAMPLE_STEAM_ID = 76561198134218675
// const EXAMPLE_API_URL = 'https://aoe2.net/api/player/matches?game=aoe2de&steam_id=76561198134218675&count=1';
const DEBUG = true;
const CIVS = ['Aztecs', 'Berbers', 'Britons', 'Bulgarians', 'Burgundians', 'Burmese', 'Byzayntines', 'Celts',
            'Chinese', 'Cumans', 'Ethiopians', 'Franks', 'Goths', 'Huns', 'Incas',
            'Indians', 'Italians', 'Japanese', 'Khmer', 'Koreans', 'Lithuanians', 'Magyars',
            'Malay', 'Malians', 'Mayans', 'Mongols', 'Persians', 'Portuguese', 'Saracens', 'Sicilians',
            'Slavs', 'Spanish', 'Tatars', 'Teutons', 'Turks', 'Vietnamese', 'Vikings'];

/********************************************** API CALLS **************************************************/
class UserInfo extends React.Component {

  //----------------- Constructiors -----------------------//
  constructor(props) {
    super(props);
    this.state = {
      steamID: '',
      numGames: '',
      games: [],
    };
  
    // bind 'this' pointer to functions
    this.handleSteamIDChange = this.handleSteamIDChange.bind(this);
    this.handleNumGamesChange = this.handleNumGamesChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //----------------- Event Handling ----------------------//

  handleSteamIDChange(event) {
    if (DEBUG) {
      console.log(event.target.value);
    }
    this.setState({
      steamID: event.target.value,
    });
  }

  handleNumGamesChange(event) {
    if (DEBUG) {
      console.log(event.target.value);
    }
    this.setState({
      numGames: event.target.value,
    });
  }

  handleSubmit(event) {
    let apiUrl = 'https://aoe2.net/api/player/matches?game=aoe2de&steam_id=' + this.state.steamID + "&count=" + this.state.numGames;

    if (DEBUG) {
      console.log(apiUrl)
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(result => {
            this.setState({
              games: _parseData(result, this.state.steamID),
            });
        })
        .catch(error => {
          alert('Error: Check that steam id and number of games are correct.');
          console.error('Error: ', error);
        });

    function _parseData(result, steamID) {
        let civ = -1;
        let map = -1;
        let won = false;
        let games = [];
        result.forEach( (game: any) => {
            // Parse data from api 
            map = game.map_type;
            for (let i = 0; i < game.players.length; i++) {
                if (game.players[i].steam_id === steamID) {
                    civ = game.players[i].civ;
                    won = game.players[i].won;

                    break;
                }
            }
            // push data into games
            games.push({
                civ: civ,
                map: map,
                won: won,
            });
        });
        return games;
    }
    
    if (DEBUG) {
      console.log(this.state.games);
    }

    event.preventDefault();
  }

  //----------------- Render ------------------------------//

  render() {
    return (
      <>
        <form onSubmit={this.handleSubmit}> 
          <div>
            <input type="text" className="steam-id" value={this.state.steamID} onChange={this.handleSteamIDChange} placeholder="Steam ID"/>
          </div>
          <div>
            <input type="text" className="game-count" value={this.state.numGames} onChange={this.handleNumGamesChange} placeholder="Number of Games"/>
          </div>
          <div>
            <input type="submit" className="user-info-submission" value="Submit"/>
          </div>
        </form>
      <Graph games={this.state.games} civsInFilter={this.props.civsInFilter}/>
      </>
    )
  }
}

/********************************************** FILTERS **************************************************/
class CivFilters extends React.Component {
  //----------------- Render -----------------------//
  RenderCivButtons() {
    return CIVS.map((civ, index) => {
      if (this.props.isCivIn[index]) {
        return (
          <div>
            <button className="civ-button-on" onClick={(event) => this.props.addCivToFilter(event, index)}> {civ} </button>
          </div>
        );
      } else {
          // console.log(this.props.isCivIn[index]);
          return (
            <div>
              <button className="civ-button-off" onClick={(event) => this.props.addCivToFilter(event, index)}> {civ} </button>
            </div>
          );
      }
    });
  }

  render() {
    if (DEBUG) {
      console.log(this.props.civsInFilter);
    }

    return (
      <form className="civ-container">
        CIVALIZATIONS
        <div>
          {this.RenderCivButtons()}
        </div>
      </form>
    );
  }
}

class Filters extends React.Component {
  //----------------- Render ------------------------------//
  render() {
    return (
        <CivFilters addCivToFilter={(event, index) => this.props.addCivToFilter(event, index)} isCivIn={this.props.isCivIn}/>
    );
  }
}

/********************************************** GRAPHING *************************************************/
class Graph extends React.Component {
  constructor() {
    super();
    this.handleGraphButton = this.handleGraphButton.bind(this);

  }


  //----------------- Event Handling ----------------------//
  handleGraphButton(event) {
    if (DEBUG) {
      console.log("Games: ", this.props.games);
      console.log("Civs to Filter: ", this.props.civsInFilter);
    }

    // Apply Filter Criteria to games
    const gamesToGraph = this.props.games.filter(g => !this.props.civsInFilter.includes(g.civ));

    // Good moment for Typescript graphData takes form of 
    /* 
      {
        civName: string,
        gamesWon: number,
        totalGames: number,
      }
    */
    let graphData = [];
    gamesToGraph.forEach(g => {
      let civName = CIVS[g.civ];

      if (!graphData.some(e => e.civName === civName)) {
        if (g.won) {
          graphData.push({
            civName: civName,
            gamesWon: 1,
            totalGames: 1, 
          });
        } else {
          graphData.push({
            civName: civName,
            gamesWon: 0,
            totalGames: 1, 
          });
        }
      } else {
        let index = graphData.findIndex(e => e.civName === civName);
        if (g.won) {
          graphData[index].gamesWon += 1;
          graphData[index].totalGames += 1;
        } else {
          graphData[index].totalGames += 1;
        }
      }
    });

    if (DEBUG) {
      console.log("Games to Graph: ", gamesToGraph);
      console.log(graphData);
      let totalGames = 0;
      graphData.forEach(g => {
        totalGames += g.totalGames;
      });
      console.log(totalGames);
    }

    event.preventDefault();
  }

  //----------------- Render ------------------------------//
  renderGraphButton() {
    return (
      <button className="graph-button" onClick={(event) => this.handleGraphButton(event)}>
        GRAPH ME!
      </button>
    )
    
  }

  render() {
    return(
      <>
        {this.renderGraphButton()}
      </>
    );
  }
}

/********************************************** ROOT *****************************************************/
class App extends React.Component {
  //----------------- Constructors ------------------------//
  constructor(props) {
    super(props);
    this.state = {
      civsInFilter: [],
      isCivIn: Array(CIVS.length).fill(false),
      mapFilters: [],
    }
  }

  //----------------- Event Handling ----------------------//
  handleCivButton(event, index) {
    let tempCivs = this.state.civsInFilter.slice();
    let tempCheck = this.state.isCivIn.slice();
    tempCheck[index] = !tempCheck[index];

    if (this.state.isCivIn[index]) {
      tempCivs = tempCivs.filter((value) => {
        return value !== index;
      });
    } else {
      tempCivs.push(index);
    }
    
    this.setState({
      civsInFilter: tempCivs,
      isCivIn: tempCheck,
    });
    event.preventDefault();

    if (DEBUG) {
      console.log(this.state.civsInFilter);
    }
  }
  //----------------- Render ------------------------------//
  render() {
    return (
      <div>
        <div className="user-info"> 
          <UserInfo civsInFilter={this.state.civsInFilter}/>
        </div>
        <div className="filters"> 
          <Filters addCivToFilter={(event, index) => this.handleCivButton(event, index)} isCivIn={this.state.isCivIn}/>
        </div>
        {/* <div className="Graph">
          <Graph/>
        </div> */}
      </div>
    )
  }
}

const rootElement = document.getElementById("root");
// ReactDOM.render(<CivFilters />, rootElement);
document.title = "AOE2 STATS"
ReactDOM.render(<App />, rootElement);
// ReactDOM.render(<UserInfo/>, rootElement);


