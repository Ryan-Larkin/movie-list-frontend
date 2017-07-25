import React, { Component } from 'react';
import MovieItem from './MovieItem';
import SearchList from './modals/SearchList';

import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import api from './api/api';

const MOVIE_API_KEY = 'd44d485616fe9ed89eb714a25e6b56d7';
const MOVIE_URL  = 'https://api.themoviedb.org/3/search/movie';

const ENTER = 13;

const toastOptions = {
  autoClose :3000,
  closeButton: false,
  hideProgressBar: true,
  position : toast.POSITION.BOTTOM_CENTER
};

const ToastMsg = ({ displayStr }) => <div className="toast-text">{displayStr}</div>

class App extends Component {
  constructor() {
    super();

    this.state = {
      movies          : [],   // movies in the DB to display
      foundMovies     : [],   // movies found when searching a title
      showSearchModal : null, // for letting the user pick which movie from search results
      randomizedIndex : null  // used for showing a random movie
    }
  }

  componentDidMount() {
    this.fetchMovies();
  }

  toastAlert = (message, toastType) => {
    switch(toastType) {
      case 'success':
        toast.success(<ToastMsg displayStr={message} />, toastOptions);
        break;
      case 'error':
        toast.error(<ToastMsg displayStr={message} />, toastOptions);
        break;
      default:
        break;
    }
  }

  fetchMovies = () => {
    api.getMovies()
    .then(res => {
      let moviesList = res.body;
      let moviesNewState = [];

      moviesList.forEach(movie => {
        moviesNewState.push(movie);
      });

      this.setState({
        movies: moviesNewState
      });
    })
    .catch(console.error);
  }

  handleTyping = (e) => {
    if (e.keyCode === ENTER) {
      this.addNewMovie();
      this.refs.newMovie.value = "";
    }
  }

  findMovie = (movieTitle) => {
    let url = `${MOVIE_URL}?query=${movieTitle}&api_key=${MOVIE_API_KEY}&language=en-US&page=1`;

    return fetch(url)
    .then(response => response.json())
    .then(movieData => {
      if(movieData.results && movieData.results.length > 0) {
        return movieData.results.map(m => {
          return {
            apiID    : m.id,
            title    : m.title,
            poster   : m.poster_path,
            overview : m.overview
          }
        });
      }
      else {
        this.toastAlert(`${movieTitle} could not be found.`, 'error');
      }
    });
  }

  // TODO: refactor code so that this function here isn't necessary
  // can just do it all in findMovie once I find out how to call it with an argument
  // down below in the render function

  addNewMovie = () => {
    let { newMovie: {value: newMovie} } = this.refs;

    if (newMovie) {
      this.findMovie(newMovie)
      .then(movieArray => {
        if (movieArray && movieArray.length > 0) {
          this.setState({
            foundMovies     : movieArray,
            showSearchModal : true
          });
        }
      });
    }
    else {
      this.toastAlert('Please enter a movie.', 'error');
    }
  }

  getRandomMovie = () => {
    if(this.state.movies && this.state.movies.length > 0) {
      this.setState({
        randomizedIndex : Math.floor(Math.random() * this.state.movies.length)
      });
    }
    else {
      this.toastAlert('There are no movies in your list.', 'error');
    }
  }

  showAll = () => {
    // for some reason, if I use just (this.state.randomizedIndex), it doesn't always work
    if(this.state.randomizedIndex != null) {
      this.setState({
        randomizedIndex : null
      });
    }
  }

  showSearchModal = () => this.setState({ showSearchModal : true });

  closeSearchModal = () => this.setState({showSearchModal : false})

  render() {
    let { movies, foundMovies } = this.state;

    return (
      <div className="App">
        <div className="App-header">
          <h1>Movies</h1>

          <div className="header-controls">
            <div className="randomizing-btns">
              <button onClick={this.getRandomMovie}>Get Random Movie</button>
              <button onClick={this.showAll}>Show All Movies</button>
            </div>

            <div className="movie-input">
              <input className="add-movie-input" type="text" ref="newMovie" onKeyUp={this.handleTyping} />
              <button className="add-movie-button" onClick={this.addNewMovie}>
                <i className="fa fa-search" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="App-intro">

          <ToastContainer />

          <br />

          <div className="movie-list">
            {
              ( this.state.randomizedIndex != null )
              ? <MovieItem
                  key={movies[this.state.randomizedIndex]._id}
                  id={movies[this.state.randomizedIndex]._id}
                  title={movies[this.state.randomizedIndex].title}
                  poster={movies[this.state.randomizedIndex].poster}
                  overview={movies[this.state.randomizedIndex].overview}
                  updateMovies={this.fetchMovies}
                  toastAlert={this.toastAlert}
                />
              : movies.map(m => (
                <MovieItem
                  key={m._id}
                  id={m._id}
                  title={m.title}
                  poster={m.poster}
                  overview={m.overview}
                  updateMovies={this.fetchMovies}
                  toastAlert={this.toastAlert}
                />
              ))
            }
          </div>
          {
            this.state.showSearchModal
            ? <div className="backdrop">
                {
                  <SearchList
                    searchList={foundMovies}
                    updateMovies={this.fetchMovies}
                    closeSearchModal={this.closeSearchModal}
                    toastAlert={this.toastAlert}
                  />
                }
              </div>
            : null
          }


        </div>
      </div>
    );
  }
}

export default App;

/*
addNewMovie function, requires replacement with code found below as well

// addNewMovie = () => {
//   let { newMovie: {value: newMovie} } = this.refs;
//
//   if (newMovie) {
//     this.findMovie(newMovie)
//     .then(movieArray => {
//       if (movieArray && movieArray.length > 0) {
//         this.setState({
//           foundMovies     : movieArray,
//           showSearchModal : true
//         });
//       }
//     });
//   }
// }
*/

/*
find movie code

// return fetch(url)
// .then(response => response.json())
// .then(movieData => {
//   if(movieData.results && movieData.results.length > 0) {
//     return {
//       title    : movieData.results[0].title,
//       poster   : movieData.results[0].poster_path,
//       overview : movieData.results[0].overview
//     }
//   }
// });

*/


/*
add new movie code

// if (newMovie) {
//   this.findMovie(newMovie)
//   .then(movieInfo => {
//     if (movieInfo) {
//       api.addMovie(movieInfo)
//       .then(res => {
//         if (res.body.wasFound) {
//           toast.error(<ToastMsg displayStr={`${res.body.title} is already added.`} />, toastOptions);
//         }
//         else {
//           toast.success(<ToastMsg displayStr={`${movieInfo.title} was succesfully added.`} />, toastOptions);
//           this.fetchMovies();
//         }
//       });
//
//       this.refs.newMovie.value = "";
//
//
//     }
//     else {
//       toast.error(<ToastMsg displayStr={`${newMovie} could not be found.`} />, toastOptions);
//     }
//   });
// }
// else {
//   toast.error(<ToastMsg displayStr='Please enter a movie name.' />, toastOptions);
// }
*/
