const webIDReducer = (state = null, action) => {
    switch(action.type) {
        case 'SET_WEB_ID':
            return action.payload;
        default:
            return state;
    }
}

export default webIDReducer;