import React from 'react';
import api from './api/api';

import './SearchItem.css';

const MOVIE_POSTER_92 = 'https://image.tmdb.org/t/p/w92/';

export default class SearchItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  addThisMovie = () => {
    this.props.closeSearchModal();

    let { apiID, title, poster, overview } = this.props

    api.addMovie({ apiID: apiID, title: title, poster: poster, overview: overview })
    .then(res => {
      if(res.body.wasFound) {
        this.props.toastAlert(`${title} is already in your list.`, 'error');
      }
      else {
        this.props.updateMovies();
        this.props.toastAlert(`${title} successfully added.`, 'success');
      }
    });
  }

  render() {
    return (
      <div className="search-item" onClick={this.addThisMovie}>
        {
          this.props.poster
          ? <img className="poster-img" src={`${MOVIE_POSTER_92}${this.props.poster}`} alt={this.props.title} />
          : <img className="poster-img" alt={this.props.title} />
        }
      </div>
    )
  }
}
