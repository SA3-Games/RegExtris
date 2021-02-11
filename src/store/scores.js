import axios from "axios";
import { modifyError } from "./errorStore";

// action types
const GET_ALL_SCORES = "GET_ALL_SCORES";

// action creators
const getAllScores = (scores) => ({
  type: GET_ALL_SCORES,
  scores,
});

// thunks

//fetches all the scores
export const fetchAllScores = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/scores");
      dispatch(getAllScores(data));
    } catch (error) {
      modifyError(error);
    }
  };
};

// initial state
const initialState = [];

export default function scores(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_SCORES:
      return action.scores;
    default:
      return state;
  }
}
