// Jacob Schneck
// Project Thing

// Not good enough at react to type everything yet but someday
// @ts-nocheck

/********************************************** IMPORTS ****************************************************/
import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';


/********************************************** GLOBALS ****************************************************/
const DEBUG = true;
const EXAMPLE_API_URL = 'https://aoe2.net/api/player/matches?game=aoe2de&steam_id=76561198134218675&count=1';
const CIVS = ['Aztecs', 'Berbers', 'Britons', 'Bulgarians', 'Burmese', 'Byzayntines', 'Celts',
            'Chinese', 'Cumans', 'Ethiopians', 'Franks', 'Goths', 'Huns', 'Incas',
            'Indians', 'Italians', 'Japanese', 'Khmer', 'Koreans', 'Lithuanians', 'Magyars',
            'Malay', 'Malians', 'Mayans', 'Mongols', 'Persians', 'Portuguese', 'Saracens',
            'Slavs', 'Spanish', 'Tatars', 'Teutons', 'Turks', 'Vietnamese', 'Vikings'];

/********************************************** API CALLS **************************************************/
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

  handleSubmit(event) {
    let apiUrl = 'https://aoe2.net/api/player/matches?game=aoe2de&steam_id=' + this.state.steamID + "&count=" + this.state.numGames;
    console.log(apiUrl)

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
    
    // debug 
    console.log(this.state.games);

    event.preventDefault();
  }

  render() {
    return (
        <form onSubmit={this.handleSubmit}> 
          <div>
              <input type="text" className="steam-id" value={this.state.steamID} onChange={this.handleSteamIDChange} placeholder="Steam ID"/>
          </div>
          <div>
              <input type="text" className="game-count" value={this.state.numGames} onChange={this.handleNumGamesChange} placeholder="Number of Games"/>
          </div>
            <input type="submit" className="user-info-submission" value="Submit"/>
        </form>
    )
  }
}

/********************************************** FILTERS **************************************************/
class CivFilters extends React.Component {
  constructor(props) {
    super(props);
  }

  RenderCivButtons() {
    return CIVS.map((civ, index) => {
      return (
        <div>
          <button className="civ-button"> {civ} </button>
        </div>
      ) 
    });
  }

  render() {
    return (
      <form className="civ-container">
        <b4>
          CIVALIZATIONS
        </b4>
        <div>
          {this.RenderCivButtons()}
        </div>
      </form>
    );
  }
}


class Filters extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
        <CivFilters/>
    );
  }
}
/********************************************** ROOT *****************************************************/
class Root extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
      <div className="user-info"> 
        <UserInfo />
      </div>
      <div className="filters"> 
        <Filters />
      </div>
      </>
    )
  }
}

const rootElement = document.getElementById("root");
// ReactDOM.render(<CivFilters />, rootElement);
ReactDOM.render(<Root />, rootElement);
// ReactDOM.render(<UserInfo/>, rootElement);


