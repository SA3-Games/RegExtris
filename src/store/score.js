import axios from "axios";
import { modifyError } from "./errorStore";
import store from "./index";
import { fetchHistData } from "./histogram";

// action types
const GET_PLAYER_SCORES = "GET_PLAYER_SCORES";
const SAVE_SCORE = "SAVE_SCORE";

// action creators
const getPlayersScores = (scores) => ({
  type: GET_PLAYER_SCORES,
  scores,
});
const saveScore = (score) => ({
  type: SAVE_SCORE,
  score,
});

// thunks
export const fetchPlayersScores = (playerId) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/scores/${playerId}`);
      dispatch(getPlayersScores(data));
    } catch (error) {
      modifyError(error);
    }
  };
};

export const postScore = (score) => {
  return async (dispatch) => {
    try {
      const playerId = store.getState().player.id;
      // assumes score comes in as an object with keys tetrisScore and regExScore
      await axios.post(`/api/scores/${playerId}`, score);
      dispatch(saveScore(score));
      dispatch(fetchHistData());
    } catch (error) {
      modifyError(error);
    }
  };
};

// initial state
const initialState = [];

export default function scores(state = initialState, action) {
  switch (action.type) {
    case GET_PLAYER_SCORES:
      return action.scores;
    case SAVE_SCORE:
      return [...state, action.score];
    default:
      return state;
  }
}
