import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import Reducers from "./redux/rootReducer"
import logger from 'redux-logger';
const store = createStore(Reducers, applyMiddleware(logger, thunk));
export default store 