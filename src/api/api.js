import superagent from 'superagent';
import { API_HOST } from '../config';

class Api {
  getMovies = () => (
    superagent
    .get(`${API_HOST}/movies`)
    .catch(err => console.error(err))
  )

  addMovie = ({title: movieTitle, poster: moviePoster, overview: movieOverview}) => (
    superagent
    .post(`${API_HOST}/movies`)
    .send({title: movieTitle, poster: moviePoster, overview: movieOverview})
    .catch(err => console.error(err))
  )

  deleteMovie = (movieId) => (
    superagent
    .delete(`${API_HOST}/movies/${movieId}`)
    .catch(err => console.error(err))
  )
}

export default new Api();
