export const API_ID = 'dca6f477';
export const API_KEY = 'adb861cc6813900e1353cb8b4ead0a6c';
export const BASE_ENDPOINT = `https://api.edamam.com/search`;

//Setup contexts and messages
export const Contexts = {
  ONE_MORE: 'one_more',
  RECIPE_DETAIL: 'get_recipe',
  RECIPE_FOLLOWUP: 'get_recipe-followup',
};

export const Intents = {
  START_APP: 'start_app',
  GET_RECIPE: 'get_recipe',
  ONE_MORE_YES: 'one_more_yes',
  ONE_MORE_NO: 'one_more_no',
  QUIT_APP: 'quit_app',
  DEFAULT: 'Default Fallback Intent'
};

export const Messages = {
  INIT_MESSAGE: `Welcome! With great recipes, I will help you become a chef!`,
  ASK_INGREDIENTS: `How can I help?`,
  ANOTHER_ONE: `Great! Here is another one.`,
  CHECK_INGREDIENTS: `Would you like to check the ingredients?`,
  MORE_RECIPES: `Would you like to check more recipes?`,
  YES_PLEASE: `Yes Please`,
  NO_THANKS: `No thanks`,
  ANOTHER_RECIPE: `Another recipe`,
  APP_QUIT: `Hope I was helpful! Have a good day and come back for more.`,
  GOODBYE: `This isn't working. Have a good day. Bye!`,
  ERROR_TRY_AGAIN: `An error has happened, would you like to try again?`,
};