import React, { Component } from 'react';
import './App.css';
import MovieItem from './MovieItem';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import api from './api/api';

const MOVIE_API_KEY = 'd44d485616fe9ed89eb714a25e6b56d7';
const MOVIE_URL  = 'https://api.themoviedb.org/3/search/movie';

const ENTER = 13;

class App extends Component {
  constructor() {
    super();

    this.state = {
      movies: []
    }
  }

  componentDidMount() {
    this.fetchMovies();
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
        return {
          title    : movieData.results[0].title,
          poster   : movieData.results[0].poster_path,
          overview : movieData.results[0].overview
        }
      }
    });
  }

  addNewMovie = () => {
    let { newMovie: {value: newMovie} } = this.refs;

    const toastOptions = {
      autoClose :3000,
      closeButton: false,
      hideProgressBar: true,
      position : toast.POSITION.BOTTOM_CENTER
    };

    const ToastMsg = ({ displayStr }) => <div className="toast-text">{displayStr}</div>

    if (newMovie) {
      this.findMovie(newMovie)
      .then(movieInfo => {
        if (movieInfo) {
          api.addMovie(movieInfo)
          .then(res => {
            if (res.body.wasFound) {
              toast.error(<ToastMsg displayStr={`${res.body.title} is already added.`} />, toastOptions);
            }
            else {
              toast.success(<ToastMsg displayStr={`${movieInfo.title} was succesfully added.`} />, toastOptions);
              this.fetchMovies();
            }
          });

          this.refs.newMovie.value = "";


        }
        else {
          toast.error(<ToastMsg displayStr={`${newMovie} could not be found.`} />, toastOptions);
        }
      });
    }
    else {
      toast.error(<ToastMsg displayStr='Please enter a movie name.' />, toastOptions);
    }
  }

  render() {
    let { movies } = this.state;

    return (
      <div className="App">
        <div className="App-header">
          <h2>Movies</h2>
        </div>
        <div className="App-intro">

          <br />

          <div className="movie-input">
            <input type="text" ref="newMovie" onKeyUp={this.handleTyping} />
            <button onClick={this.addNewMovie}>Add Movie</button>
          </div>

          <ToastContainer />

          <hr />

          <div className="movie-list">
            {
              movies.map(m => (
                <MovieItem
                  key={m._id}
                  id={m._id}
                  title={m.title}
                  poster={m.poster}
                  overview={m.overview}
                  updateMovies={this.fetchMovies}
                />
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
