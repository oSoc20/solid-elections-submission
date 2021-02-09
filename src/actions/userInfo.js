export const setUserInfo = (info) => {
    return {
        type: 'SET_INFO',
        payload: info
    }
}

export const requestLoad = () => {
    return {
        type: 'CHANGE_LOADED'
    }
}