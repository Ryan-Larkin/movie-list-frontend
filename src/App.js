import React, { Component } from 'react';
import './App.css';
import MovieItem from './MovieItem';

import api from './api/api';

const MOVIE_API_KEY = 'd44d485616fe9ed89eb714a25e6b56d7';
const MOVIE_URL  = 'https://api.themoviedb.org/3/search/movie';

const ENTER = 13;

class App extends Component {
  constructor() {
    super();

    this.state = {
      movies: [],
      error: null
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
    if(this.state.error) {
      this.setState({
        error : null
      });
    }

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

    if (newMovie) {
      this.findMovie(newMovie)
      .then(movieInfo => {
        if (movieInfo) {
          api.addMovie(movieInfo)
          .then(this.fetchMovies);
        }
        else {
          this.setState({
            error : `"${newMovie}" could not be found.`
          });
        }
      });
    }
    else {
      this.setState({
        error : 'Please enter a movie name.'
      })
    }
  }

  render() {
    let { movies } = this.state;

    const errorMsgDisplay = {
      visibility: this.state.error ? 'visible' : 'hidden'
    }

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
            <p className="error-message" style={errorMsgDisplay}>{this.state.error}</p>
          </div>




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
