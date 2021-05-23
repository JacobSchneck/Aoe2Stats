// @ts-nocheck
import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';


/********************************************** API CALLS **************************************************/
const urlUser: string = 'https://aoe2.net/api/player/matches?game=aoe2de&steam_id=76561198134218675&count=1'

function GetUserData() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);


  useEffect( () => {
    fetch('https://aoe2.net/api/player/matches?game=aoe2de&steam_id=76561198134218675&count=1')
      .then(res => res.json())
      .then( (result) => {
        setIsLoaded(true);
        setData(result);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      });
    }, [])

    

  if (error) {
    return  <div> Error: {error.message} </div>;
  } else if (!isLoaded) {
    console.log("Loading");
    return <div> loading... </div>;
  } else {
    console.log("Loaded");
    if (data.length > 0) {
      console.log(data[0].players);
    }
    return <div> Loaded </div>
  }
}

function GithubCommit() {
  const [page, setPage] = useState(1);
  const [commitHistory, setCommitHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMoreCommit = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    fetch(
      `https://api.github.com/search/commits?q=repo:facebook/react+css&page=${page}`,
      {
        method: "GET",
        headers: new Headers({
          Accept: "application/vnd.github.cloak-preview"
        })
      }
    )
      .then(res => res.json())
      .then(response => {
        setCommitHistory(response.items);
        setIsLoading(false);
      })
      .catch(error => console.log(error));
    }, [page]);


  return (
    <div>
      <h1> API calls with React Hooks </h1>
      {isLoading && <p>Wait I'm Loading comments for you</p>}

      {commitHistory.length !== 0 && (
        <button onClick={loadMoreCommit}>Load More Commits</button>
      )}

      {commitHistory.map((c, index) => (
        <div key={index}>
          {c.commit && (
            <>
              <div>
                <h2 style={{ textDecoration: "Underline" }}>
                  {c.commit.committer.name}
                </h2>
                <p>{c.commit.message}</p>
              </div>
              <hr />
            </>
          )}
        </div>
      ))}
    </div>
  );
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
ReactDOM.render(<GetUserData />, rootElement);
// ReactDOM.render(<GithubCommit />, rootElement);


