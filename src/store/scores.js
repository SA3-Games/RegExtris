import axios from "axios";
import { modifyError } from "./errorStore";

// action types
const GET_ALL_SCORES = "GET_ALL_SCORES";
const GET_HIST_DATA = "GET_HIST_DATA";

// action creators
const getAllScores = (scores) => ({
  type: GET_ALL_SCORES,
  scores,
});
const getHistData = (histData) => ({
  type: GET_HIST_DATA,
  histData,
});

// thunks
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

export const fetchHistData = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/scores/histogram");
      dispatch(getHistData(data));
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
    case GET_HIST_DATA:
      return { ...state, histData: action.histData };
    default:
      return state;
  }
}
