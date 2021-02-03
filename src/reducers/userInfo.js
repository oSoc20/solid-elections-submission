
const userInfoReducer = (state = null, action) => {
    switch(action.type) {
        case 'SET_INFO':
            return action.payload;
        default:
            return state
    }
}

export default userInfoReducer;