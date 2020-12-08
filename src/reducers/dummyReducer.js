const dummyReducer = (state = false, action) => {
    switch(action.type) {
        case 'SWITCH_STATE':
            return !state;
    }
}

export default dummyReducer;