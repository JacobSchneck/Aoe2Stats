import React, {useEffect, useState} from 'react';

const URL_USER_DATA: string = 'https://aoe2.net/api/player/matches?game=aoe2de&steam_id=76561198134218675&count=1'

const STEAM_ID: string = '76561198134218675'
const NUM_GAMES: string = '1'

type Games = {
    civ: number,
    map: number,
    won: boolean,
}

type PlayerStats = {
    steamID: string,
    games: Games[],
};

export function UserData(url: string, steamID: string): Games[] | undefined {
    let data: Games[] | undefined = undefined;
    function _getData() {
        fetch(url)
            .then(response => response.json())
            .then(result => {
                data = _parseData(result);
                console.log(data);
            })
            .catch(error => {
                console.error('Error: ', error);
            });
    }
    
    function _parseData(result: any): Games[] {

        let civ: number;
        let map: number;
        let won: boolean;
        let games: Games[] = [];
        
        result.forEach( (game: any) => {
            // Parse data from api 
            map = game.map_type;
            for (let i = 0; i < game.player.length; i++) {
                if (game.player[i].profile_id == STEAM_ID) {
                    civ = game.player[i].civ;
                    won = game.player[i].won;
                    break;
                }
            }

            games.push({
                civ: civ,
                map: map,
                won: won,
            });
        });
        return games;
    }

    
    return data;
} 

