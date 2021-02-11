// action type
const ADD_RATIO = 'ADD_RATIO';
const CLEAR_RATIOS = 'CLEAR_RATIOS';

// action creator
export const addRatio = (totalSquares, squaresMatched) => ({
  type: ADD_REGEX_CHOICE,
  totalSquares,
  squaresMatched,
});

export const clearRatio = () => ({
  type: CLEAR_REGEX_CHOICES,
});

// initial state
const initialState = [];

/*
Ratios stored in this format
{
  tetris: totalSquares
  regex: squaresMatched
}
*/

export default function regexChoices(state = initialState, action) {
  switch (action.type) {
    case ADD_RATIO: {
      const newState = [...state];
      newState.push({
        tetris: action.totalSquares,
        regex: action.squaresMatched,
      });
      return newState;
    }
    case CLEAR_RATIOS:
      return initialState;
    default:
      return state;
  }
}
