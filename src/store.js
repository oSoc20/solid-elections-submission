import { createStore } from 'redux';
import dummyReducer from './reducers/dummyReducer';

export default function configureStore() {
    const store = createStore(dummyReducer);

    return store;
}