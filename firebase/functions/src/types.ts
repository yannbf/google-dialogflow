export interface IRecipeIngredient {
  text: string,
  weight: number
}

export interface IRecipe {
  label: string;
  image: string;
  source: string;
  url: string;
  ingredients: Array<IRecipeIngredient>;
  calories: number;
}
export type IResponseError = string;
export type IRequestResponse = IRecipe | IResponseError;