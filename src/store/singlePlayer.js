import axios from 'axios';
import { setError, clearError } from './errorStore';
import { fetchPlayersScores } from './score';

/**
 * ACTION TYPES
 */
const GET_PLAYER = 'GET_PLAYER';
const REMOVE_PLAYER = 'REMOVE_PLAYER';

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

/**
 * THUNK CREATORS
 */
export const me = () => async (dispatch) => {
  try {
    const { data } = await axios.get('/auth/me');
    dispatch(getPlayer(data || { id: null }));
    if (data.id) dispatch(fetchPlayersScores(data.id));
  } catch (error) {
    dispatch(modifyError(error));
  }
};

export const auth = (alias, password, method) => async (dispatch) => {
  dispatch(clearError());
  try {
    const { data } = await axios.post(`/auth/${method}`, { alias, password });
    dispatch(getPlayer(data));
  } catch (authErr) {
    dispatch(setError(authErr.response.status, authErr.response.data));
  }
};

export const logout = () => async (dispatch) => {
  try {
    await axios.post('/auth/logout');
    dispatch(removePlayer());
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
