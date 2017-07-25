import React from 'react';
import api from '../api/api';
import onClickOutside from 'react-onclickoutside';

import './MovieDescription.css';

const MOVIE_POSTER_300 = 'https://image.tmdb.org/t/p/w300/';

export default onClickOutside(class MovieDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClickOutside = () => {
    this.props.closeModal();
  }

  deleteThisMovie = () => {
    this.props.closeModal();

    this.props.toastAlert(`${this.props.title} successfully removed.`, 'success');

    api.deleteMovie(this.props.id)
    .then(this.props.updateMovies);
  }

  render() {
    return (
      <div className="movie-description-modal">
        <div className="movie-description-title">{this.props.title}</div>

        <hr />

        <div className="movie-description-info">
          <div className="movie-description-modal-left">
            {
              this.props.poster
              ? <img className="description-img" src={`${MOVIE_POSTER_300}${this.props.poster}`} alt={this.props.title} />
              : <img className="description-img" alt={this.props.title} />
            }
          </div>

          <div className="movie-description-modal-right">
            <h3>OVERVIEW</h3>
            <div className="overview-text scrollbar style-3">
              <p>{this.props.overview}</p>
            </div>

            <button className="watched-btn" onClick={this.deleteThisMovie}>Watched</button>
          </div>
        </div>
      </div>
    );
  }
});
