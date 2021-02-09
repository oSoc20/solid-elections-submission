const defaultState = {
    loaded: true,
    info: null
}

const userInfoReducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'SET_INFO':
            return {
                loaded: true,
                info: action.payload
            };
        case 'CHANGE_LOADED':
            return {
                info: null,
                loaded: false
            }
        default:
            return state;
    }
}

export default userInfoReducer;