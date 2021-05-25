// @ts-nocheck

import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import { resourceLimits } from 'worker_threads';
// import {GetUserData} from './services.tsx';
import './index.css';


/********************************************** API CALLS **************************************************/
const urlUser = 'https://aoe2.net/api/player/matches?game=aoe2de&steam_id=76561198134218675&count=1'


// const URL_USER_DATA: string = 'https://aoe2.net/api/player/matches?game=aoe2de&steam_id=76561198134218675&count=1'

class UserInfo extends React.Component {
  constructor(props) {
    super(props)
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

  handleSteamIDChange(event) {
    console.log(event.target.value);
    this.setState({
      steamID: event.target.value,
    });

  }

  handleNumGamesChange(event) {
    console.log(event.target.value);
    this.setState({
      numGames: event.target.value,
    });
  }

  // Helper function for handle submit

  handleSubmit(event) {
    let apiUrl = 'https://aoe2.net/api/player/matches?game=aoe2de&steam_id=' + this.state.steamID + "&count=" + this.state.numGames;
    console.log(apiUrl)

    let data = undefined;

    fetch(apiUrl)
        .then(response => response.json())
        .then(result => {
            data = _parseData(result, this.state.steamID);
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
                if (game.players[i].steam_id == steamID) {
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

    this.setState({
      games: data,
    })
    console.log(this.state.games);

    event.preventDefault();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}> 
          <div>
            <label>
              Steam ID: 
              <input type="text" name="steam-id" value={this.state.steamID} onChange={this.handleSteamIDChange}/>
            </label>
          </div>
          <div>
            <label>
              Number of games: 
              <input type="text" name="game-count" value={this.state.numGames} onChange={this.handleNumGamesChange} />
            </label>
          </div>
            <input type="submit" value="Submit"/>
        </form>
      </div>
    )
  }
}

/********************************************** FILTERS **************************************************/

// const CIVS = ['Aztecs', 'Berbers', 'Britons', 'Bulgarians', 'Burmese', 'Byzayntines', 'Celts',
//         'Chinese', 'Cumans', 'Ethiopians', 'Franks', 'Goths',' Huns', 'Incas',
//         'Indians', 'Italians', 'Japanese', 'Khmer', 'Koreans', 'Lithuanians', 'Magyars',
//         'Malay', 'Malians', 'Mayans', 'Mongols', 'Persians', 'Portuguese', 'Saracens',
//         'Slavs', 'Spanish', 'Tatars', 'Teutons', 'Turks', 'Vietnamese', 'Vikings'];

// function hello() {
//   return (
//     <div>
//       <p> Hello World!</p>
//     </div>
//   );
// }

// class CivFilters extends React.Component {

//   render() {
//     return (
//       // <p> Civ Buttons go here</p>
//       <div>
//         <input type="checkbox" value="Male" name="gender"/>Male
//         <input type="checkbox" value="Male" name="gender"/>Female
//       </div>
//       );
//   }
// }

// class Filters extends React.Component {
//   constructor(props: any) {
//     super(props)
//   }

//   render() {
//     return (
//       <div className="filters">
//         <div className = "civ-filters">
//           <CivFilters/>
//         </div>
//       </div>
//     );
//   }
// }

const rootElement = document.getElementById("root");
ReactDOM.render(<UserInfo />, rootElement);
// ReactDOM.render(<GetUserData/>, rootElement);
// ReactDOM.render(<GithubCommit />, rootElement);


