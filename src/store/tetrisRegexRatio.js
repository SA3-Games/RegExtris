// action type
const ADD_RATIO = 'ADD_RATIO';
const CLEAR_RATIOS = 'CLEAR_RATIOS';

// action creator
export const addRatio = (totalSquares, squaresMatched) => ({
  type: ADD_RATIO,
  totalSquares,
  squaresMatched,
});

export const clearRatio = () => ({
  type: CLEAR_RATIOS,
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

export default function tetrisRegexRatio(state = initialState, action) {
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
