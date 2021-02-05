import axios from "axios";
import { modifyError } from "./errorStore";

/**
 * ACTION TYPES
 */
const GET_PLAYER = "GET_PLAYER";
const REMOVE_PLAYER = "REMOVE_PLAYER";
const CREATE_ERROR = "CREATE_ERROR";

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
export const removePlayer = () => ({
  type: REMOVE_PLAYER,
});
const createError = (error) => ({
  type: CREATE_ERROR,
  error,
});

/**
 * THUNK CREATORS
 */
export const me = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/auth/me");
    dispatch(getPlayer(data || { id: null }));
  } catch (error) {
    dispatch(modifyError(error));
  }
};

export const auth = (alias, password, method) => async (dispatch) => {
  console.log("inside auth thunk: alias:", alias, "password: ", password);
  let res;
  try {
    res = await axios.post(`/auth/${method}`, { alias, password });
    dispatch(getPlayer(res.data));
  } catch (authErr) {
    return dispatch(modifyError(authErr, authErr.response.data.error));
  }
};

export const logout = () => async (dispatch) => {
  try {
    await axios.post("/auth/logout");
    dispatch(removePlayer());
    console.log("logout thunk activated");
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
      console.log("REMOVING PLAYER");
      return defaultPlayer;
    case CREATE_ERROR:
      return action.error;
    default:
      return state;
  }
}
