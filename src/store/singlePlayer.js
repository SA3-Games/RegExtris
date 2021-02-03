import axios from "axios";
import { modifyError } from "./errorStore";

/**
 * ACTION TYPES
 */
const GET_PLAYER = "GET_PLAYER";
const REMOVE_PLAYER = "REMOVE_PLAYER";

/**
 * INITIAL STATE
 */
const defaultPlayer = {};

/**
 * ACTION CREATORS
 */
const getPlayer = (player) => ({
  type: GET_PLAYER,
  player,
});
const removePlayer = () => ({
  type: REMOVE_PLAYER,
});

/**
 * THUNK CREATORS
 */
export const me = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/auth/me");
    dispatch(getPlayer(data || defaultPlayer));
  } catch (error) {
    dispatch(modifyError(error));
  }
};

export const auth = (alias, password, method) => async (dispatch) => {
  console.log("inside auth thunk: alias:", alias, "password: ", password);
  let res;
  try {
    res = await axios.post(`/auth/${method}`, { alias, password });
  } catch (authErr) {
    return dispatch(getPlayer({ error: authErr }));
  }

  try {
    dispatch(getPlayer(res.data));
    console.log("got player from store");
  } catch (dispatchOrHistoryErr) {
    dispatch(modifyError(dispatchOrHistoryErr));
  }
};

export const logout = () => async (dispatch) => {
  try {
    await axios.post("/auth/logout");
    dispatch(removePlayer());
    console.log("logout");
  } catch (error) {
    dispatch(modifyError(error));
  }
};

/**
 * REDUCER
 */
export default function (state = defaultPlayer, action) {
  switch (action.type) {
    case GET_PLAYER:
      return action.player;
    case REMOVE_PLAYER:
      return defaultPlayer;
    default:
      return state;
  }
}
