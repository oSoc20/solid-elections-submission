export function isEmpty(data: Object): Boolean {
    return data == undefined || data == null || data == '';
}

export function isNumber(data: string): Boolean {
    return !isNaN(parseInt(data));
}