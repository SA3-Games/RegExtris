// action type
const ADD_RATIO = 'ADD_RATIO';
const CLEAR_RATIOS = 'CLEAR_RATIOS';

// action creator
export const addRatio = (matched, unmatched) => ({
  type: ADD_RATIO,
  matched,
  unmatched,
});

export const clearRatio = () => ({
  type: CLEAR_RATIOS,
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
    case CLEAR_RATIOS:
      return initialState;
    default:
      return state;
  }
}
