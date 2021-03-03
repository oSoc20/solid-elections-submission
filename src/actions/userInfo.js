export const setUserInfo = (info) => {
    return {
        type: 'SET_INFO',
        key: 'user',
        payload: info
    }
}

export const requestUserLoad = () => {
    return {
        type: 'CHANGE_LOADED',
        key: 'user'
    }
}