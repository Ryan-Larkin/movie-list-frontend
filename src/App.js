import React, { Component } from 'react';
import './App.css';
import MovieItem from './MovieItem';

import api from './api/api';

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
      let moviesState = [];

      Object.keys(moviesList).forEach(key => {
        moviesState.push( {id : key, title : moviesList[key]} );
      });

      this.setState({
        movies: moviesState
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

  addNewMovie = () => {
    let { newMovie: {value: newMovie} } = this.refs;

    if (newMovie) {
      api.addMovie(newMovie)
      .then(this.fetchMovies);
    }
    else {
      this.setState({
        error : 'Please enter a movie name.'
      })
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
            <input type="text" ref="newMovie" onKeyUp={this.handleTyping}/>
            <button onClick={this.addNewMovie}>Add Movie</button>
          </div>

          {this.state.error ? <p className="alert alert-danger">{this.state.error}</p> : null}

          <hr />

          <div className="movie-list">
            {
              movies.map((m) => (
                <MovieItem
                  key={m.id}
                  id={m.id}
                  title={m.title}
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
