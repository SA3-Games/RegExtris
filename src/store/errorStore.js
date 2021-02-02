const SET_ERROR = "SET_ERROR";
const CLEAR_ERROR = "CLEAR_ERROR";

export const setError = (error) => {
  return {
    type: SET_ERROR,
    payload: {
      error: true,
      message: error.message,
      status: error.status,
    },
  };
};

export const clearError = () => {
  return {
    type: CLEAR_ERROR,
  };
};

export const modifyError = (error, customMessage) => {
  return (dispatch) => {
    const err = new Error();
    switch (error.message) {
      case "Network Error":
        err.status = "500";
        err.message =
          "Something went wrong on our end. Please try again later.";
        break;
      // case '404':
      //   err.message = customMessage || error.message
      //   break
      // case '403':
      //   err.message = customMessage || error.message
      //   break
      default:
        err.message = error.message;
    }
    dispatch(setError(err));
  };
};

const initialState = { error: false, message: "", status: "" };

export default function errorReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ERROR:
      return action.payload;
    case CLEAR_ERROR:
      return initialState;
    default:
      return state;
  }
}
