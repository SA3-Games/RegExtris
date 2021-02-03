import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import scores from './scores';
import singlePlayer from './singlePlayer';
import regexChoices from './playerRegex';
import error from './errorStore';

const reducer = combineReducers({
  scores,
  player: singlePlayer,
  error,
  regexChoices,
});

const middleware = composeWithDevTools(applyMiddleware(thunkMiddleware));

const store = createStore(reducer, middleware);

export default store;
