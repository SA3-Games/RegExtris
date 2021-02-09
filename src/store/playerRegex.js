// action type
const ADD_REGEX_CHOICE = "ADD_REGEX_CHOICES";

// action creator
export const addRegexChoice = (re, totalCharacters) => ({
  type: ADD_REGEX_CHOICE,
  re,
  totalCharacters,
});

// thunk

// initial state
const initialState = {};
/*
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
    default:
      return state;
  }
}
