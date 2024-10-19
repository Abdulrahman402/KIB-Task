import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class TmdbService {
  baseUrl = process.env.TMDB_BASE_URL;
  token = `Bearer ${process.env.TMDB_TOKEN}`;

  genreMap: { [key: number]: string } = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western',
  };

  async fetchMovies(page: number = 1, pageSize: number = 20) {
    const movies = await this.sendApiRequest(
      `${this.baseUrl}?page=${page}`,
      'GET',
    );

    const tmdbMovies = movies.data.results.slice(0, pageSize);

    return tmdbMovies;
  }

  async sendApiRequest(
    url: string,
    method: string = 'GET | POST | PUT | DELETE',
  ): Promise<AxiosResponse<any>> {
    const result = await axios({
      method,
      url,
      headers: { Authorization: this.token },
    });

    return result;
  }
}
