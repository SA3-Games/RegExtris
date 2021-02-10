import axios from "axios";
import { modifyError } from "./errorStore";

// action types
const GET_HIST_DATA = "GET_HIST_DATA";

// action creators
const getHistData = (histData) => ({
  type: GET_HIST_DATA,
  histData,
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
const initialState = {};

export default function scores(state = initialState, action) {
  switch (action.type) {
    case GET_HIST_DATA:
      return action.histData;
    default:
      return state;
  }
}
