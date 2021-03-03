import {combineReducers} from 'redux';

import webIDReducer from './webID';
import userInfoReducer from './userInfo';
import expensesInfoReducer from './expensesInfo';

const combinedReducer = combineReducers({
    webID: webIDReducer,
    userInfo: userInfoReducer,
    expensesInfo: expensesInfoReducer
});

export default combinedReducer;

