// action type
const ADD_RATIO = 'ADD_RATIO';
const CLEAR_PLAYER_DATA = 'CLEAR_PLAYER_DATA';

// action creator
export const addRatio = (matched, unmatched) => ({
  type: ADD_RATIO,
  matched,
  unmatched,
});

// initial state
const initialState = { unmatched: [], matched: [] };

export default function tetrisRegexRatio(state = initialState, action) {
  switch (action.type) {
    case ADD_RATIO: {
      const newState = { ...state };
      newState.unmatched = [...state.unmatched, action.unmatched];
      newState.matched = [...state.matched, action.matched];
      return newState;
    }
    case CLEAR_PLAYER_DATA:
      return initialState;
    default:
      return state;
  }
}
