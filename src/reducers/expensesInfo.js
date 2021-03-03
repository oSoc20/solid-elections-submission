const defaultState = ({
    loaded: true,
    info: null
})

const expensesInfoReducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'SET_INFO':
            if (action.key == "expenses") {
                return {
                    loaded: true,
                    info: action.payload
                }
            } else return state;
        case 'CHANGE_LOADED':
            if (action.key == "expenses") {
                return {
                    loaded: false,
                    info: null
                }
            } else return state;
        default:
            return state;
    }
}

export default expensesInfoReducer;