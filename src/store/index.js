import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import singlePlayer from "./singlePlayer";
import regexChoices from "./playerRegex";
import histogram from "./histogram";
import score from "./score";
import error from "./errorStore";
import tetrisRegexRatio from "./tetrisRegexRatio";

const reducer = combineReducers({
  player: singlePlayer,
  error,
  regexChoices,
  score,
  histogram,
  ratios: tetrisRegexRatio,
});

const middleware = composeWithDevTools(applyMiddleware(thunkMiddleware));

const store = createStore(reducer, middleware);

export default store;
