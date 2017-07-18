import React, { Component } from 'react';
import './App.css';
import MovieItem from './MovieItem';

import api from './api/api';

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
    if (e.keyCode === ENTER) {
      this.addNewMovie();
      this.refs.newMovie.value = "";
    }
  }

  addNewMovie = () => {
    let { newMovie: {value: newMovie} } = this.refs;

    api.addMovie(newMovie)
    .then(this.fetchMovies);
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
