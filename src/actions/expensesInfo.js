export const setExpensesInfo = (info) => {
    return {
        type: 'SET_INFO',
        key: 'expenses',
        payload: info
    }
}

export const requestExpensesLoad = () => {
    return {
        type: "CHANGE_LOADED",
        key: 'expenses'
    }
}