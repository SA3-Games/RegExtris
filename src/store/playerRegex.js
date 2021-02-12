// action type
const ADD_REGEX_CHOICE = 'ADD_REGEX_CHOICES';
const CLEAR_PLAYER_DATA = 'CLEAR_PLAYER_DATA';

// action creator
export const addRegexChoice = (re, totalCharacters) => ({
  type: ADD_REGEX_CHOICE,
  re,
  totalCharacters,
});

export const clearPlayerData = () => ({
  type: CLEAR_PLAYER_DATA,
});

// initial state
const initialState = {};

/*
Regex choices stores in this format
{
  re: totalCharacters
}
*/

export default function regexChoices(state = initialState, action) {
  switch (action.type) {
    case ADD_REGEX_CHOICE: {
      const newState = { ...state };
      if (newState[action.re]) {
        const newRe = { ...newState[action.re] };
        newRe.totalCharacters += action.totalCharacters;
        newState[action.re] = newRe;
      } else {
        newState[action.re] = {
          totalCharacters: action.totalCharacters,
        };
      }
      return newState;
    }
    case CLEAR_PLAYER_DATA:
      return initialState;
    default:
      return state;
  }
}
