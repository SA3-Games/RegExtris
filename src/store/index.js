import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import scores from "./scores";
import singlePlayer from "./singlePlayer";
import regexChoices from "./playerRegex";
import histogram from "./histogram";
import score from "./score";
import error from "./errorStore";

const reducer = combineReducers({
  scores,
  player: singlePlayer,
  error,
  regexChoices,
  score,
  histogram,
});

const middleware = composeWithDevTools(applyMiddleware(thunkMiddleware));

const store = createStore(reducer, middleware);

export default store;
