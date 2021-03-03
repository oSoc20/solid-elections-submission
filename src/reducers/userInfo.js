const defaultState = {
    loaded: true,
    info: null
}

const userInfoReducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'SET_INFO':
            if (action.key == "user") {
                return {
                    loaded: true,
                    info: action.payload
                };
            } else return state;
        case 'CHANGE_LOADED':
            if (action.key == "user") {
                return {
                    info: null,
                    loaded: false
                }
            } else return state;
        default:
            return state;
    }
}

export default userInfoReducer;