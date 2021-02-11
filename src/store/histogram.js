import axios from "axios";
import { modifyError } from "./errorStore";

// action types
const GET_HIST_DATA = "GET_HIST_DATA";
const TOGGLE_DATA = "TOGGLE_DATA";

// action creators
const getHistData = (histData) => ({
  type: GET_HIST_DATA,
  histData,
});

export const toggleSwitch = () => ({
  type: TOGGLE_DATA,
});

// thunks
export const fetchHistData = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/histogram");
      dispatch(getHistData(data));
    } catch (error) {
      modifyError(error);
    }
  };
};

// initial state
const initialState = { toggle: true };

export default function scores(state = initialState, action) {
  switch (action.type) {
    case GET_HIST_DATA:
      return { ...state, histData: action.histData };
    case TOGGLE_DATA:
      return { ...state, toggle: !state.toggle };
    default:
      return state;
  }
}
