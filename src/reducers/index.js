import {combineReducers} from 'redux';

import userInfoReducer from './userInfo';
import webIDReducer from './webID';

const combinedReducer = combineReducers({
    userInfo: userInfoReducer,
    webID: webIDReducer
});

export default combinedReducer;

