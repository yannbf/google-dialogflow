import axios from 'axios';

import { mock } from './mock';
import { IRequestResponse } from './types';
import { BASE_ENDPOINT, API_ID, API_KEY } from './consts';


class FoodService {
  getRecipe(queryParams: Array<string>): Promise<IRequestResponse> {
    return Promise.resolve(mock.hits[Math.ceil(Math.random() * 9)].recipe);
  }

  getRecipeMock(queryParams: Array<string>): Promise<IRequestResponse> {
    const query = this._buildParamsQuery(queryParams);
    const url = `${BASE_ENDPOINT}?q=${encodeURI(query)}&app_id=${API_ID}&app_key=${API_KEY}`;

    return new Promise((resolve, reject) => {
      axios.get(url)
        .then(response => resolve(response.data.hits[0].recipe))
        .catch(err => reject(`an error has occurred: ${err} ${url}`));
    });
  }

  private _buildParamsQuery(params: Array<string>) {
    if(params.length > 1) {
      return params.reduce((prev, next) => `${prev} and ${next}`);
    }

    return params[0];
  }
}

export const foodService = new FoodService();