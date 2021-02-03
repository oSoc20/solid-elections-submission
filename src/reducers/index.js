import {combineReducers} from 'redux';

import userInfoReducer from './userInfo';

const combinedReducer = combineReducers({
    userInfo: userInfoReducer
});

export default combinedReducer;

