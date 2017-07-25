import superagent from 'superagent';
import { API_HOST } from '../config';

class Api {
  getMovies = () => (
    superagent
    .get(`${API_HOST}/movies`)
    .catch(err => console.error(err))
  )

  addMovie = ({apiID, title, poster, overview}) => (
    superagent
    .post(`${API_HOST}/movies`)
    .send({apiID : apiID, title: title, poster: poster, overview: overview})
    .catch(err => console.error(err))
  )

  deleteMovie = (movieId) => (
    superagent
    .delete(`${API_HOST}/movies/${movieId}`)
    .catch(err => console.error(err))
  )
}

export default new Api();
