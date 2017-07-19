import React from 'react';
import MovieDescription from './modals/MovieDescription';

import './MovieItem.css';

const MOVIE_POSTER_154 = 'https://image.tmdb.org/t/p/w154/';

class MovieItem extends React.Component {
  constructor() {
    super();

    this.state = {
      showMovieModal: false
    }
  }

  showModal = () => {
    this.setState({showMovieModal : true});
  }

  closeModal = () => this.setState({showMovieModal : false});

  render() {

    return (
      <div className="movie-item" onClick={this.showModal}>
        {this.props.poster
          ? <img className="poster-img" src={`${MOVIE_POSTER_154}${this.props.poster}`} alt="No poster found" />
          : null
        }

        {
          this.state.showMovieModal
          ? <div className="backdrop">
              <MovieDescription
                id={this.props.id}
                title={this.props.title}
                poster={this.props.poster}
                overview={this.props.overview}
                updateMovies={this.props.updateMovies}
                closeModal={this.closeModal}
              />
            </div>
          : null
        }
      </div>
    );
  }
}

export default MovieItem;
