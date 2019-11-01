import * as functions from 'firebase-functions';
import {
  dialogflow,
  SimpleResponse,
  Suggestions,
  Parameters
} from 'actions-on-google';

import { foodService } from './api';
import { IRecipe } from './types';
import { Intents, Contexts, Messages } from './consts';

const app = dialogflow({ debug: true });

let selectedRecipe: IRecipe;
let selectedParams: any;

// Action intents
app.intent(Intents.START_APP, async (conv) => {
  // conv.contexts.set(Contexts.ONE_MORE, 5);
  conv.contexts.set(Contexts.RECIPE_DETAIL, 5);
  return conv.ask(
    new SimpleResponse(Messages.INIT_MESSAGE),
    new SimpleResponse(Messages.ASK_INGREDIENTS)
  );
});

app.intent(Intents.GET_RECIPE, async (conv) => {
  // conv.contexts.set(Contexts.RECIPE_DETAIL, 5);
  log('GET RECIPE');
  conv.contexts.set(Contexts.ONE_MORE, 5);
  selectedParams = conv.parameters.ingredient;
  return getNewRecipe(conv);
});

app.intent('get_recipe-yes', async (conv) => {
  // conv.contexts.set(Contexts.RECIPE_DETAIL, 5);
  conv.contexts.set(Contexts.RECIPE_FOLLOWUP, 5);
  log('GET RECIPE YES CALLED');
  return conv.ask(
    new SimpleResponse(getIngredientList())
  );
});

app.intent(Intents.ONE_MORE_YES, async (conv) => {
  conv.contexts.set(Contexts.ONE_MORE, 3);
  return getNewRecipe(conv);
});

app.intent(Intents.ONE_MORE_NO, (conv) => {
  conv.close(Messages.APP_QUIT);
});

app.intent(Intents.QUIT_APP, (conv) => {
  conv.close(Messages.APP_QUIT);
});

app.intent(Intents.DEFAULT, (conv: any) => {
  if (typeof conv.data.fallbackCount !== 'number') {
    conv.data.fallbackCount = 0;
  }
  conv.data.fallbackCount++;

  // Provide two prompts before ending
  if (conv.data.fallbackCount === 1) {
    conv.contexts.set(Contexts.ONE_MORE, 2);
    log('fallBack');
    return conv.ask(
      new Suggestions(Messages.YES_PLEASE, Messages.NO_THANKS),
      new SimpleResponse(Messages.CHECK_INGREDIENTS)
    );
  } else if (conv.data.fallbackCount === 2) {
    return conv.ask(
      new Suggestions(Messages.YES_PLEASE, Messages.NO_THANKS),
      new SimpleResponse(Messages.INIT_MESSAGE + Messages.CHECK_INGREDIENTS)
    );
  }

  return conv.close(Messages.GOODBYE);
});

async function getNewRecipe(conv) {
  try {
    selectedRecipe = await foodService.getRecipe(selectedParams) as IRecipe;
    log('getNewRecipe');
    return getMessageFromRecipe(selectedRecipe, conv);
  } catch(err) {
    return conv.ask(
      new Suggestions(Messages.YES_PLEASE, Messages.NO_THANKS),
      new SimpleResponse(`${Messages.ERROR_TRY_AGAIN}`)
    );
  }
}

function getMessageFromRecipe(entity: IRecipe, conv) {
  const message = `I found the recipe ${entity.label}. ${getIngredientList()}. Would you like another recipe?`;
  return conv.ask(
    new Suggestions(Messages.YES_PLEASE, Messages.NO_THANKS),
    new SimpleResponse({
      text: message + Messages.CHECK_INGREDIENTS,
      speech: `<speak> ${message}. ${getEndingMessage()} </speak>`
    })
  );
}

// Util related methods
function getEndingMessage() {
  return `<audio src="https://actions.google.com/sounds/v1/cartoon/pop.ogg">${Messages.CHECK_INGREDIENTS}</audio>`;
  // return Messages.CHECK_INGREDIENTS;
}

function getEndingMessageText() {
  return Messages.CHECK_INGREDIENTS;
}

function log(message: string) {
  console.log('[MESSAGE] ' + message);
}

function getIngredientList() {
  if(selectedRecipe) {
    let ingredientList = '';
    selectedRecipe.ingredients.splice(0,3).forEach((recipe) => { {
      if(recipe !== undefined) {
        ingredientList += recipe.text + ',' }
      }
    });
    return `Here is the list of ingredients that you need: ${ingredientList}`;
  } else {
    return 'No recipe has been selected so far.';
  }
}

// HTTP Cloud Function for Firebase handler
exports.InspireMe = functions.https.onRequest(app);