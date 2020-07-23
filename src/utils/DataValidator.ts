export function isEmpty(data: Object): boolean {
    return data === undefined || data === null || data === "";
}

export function isNumber(data: string): boolean {
    return !isNaN(parseInt(data));
}

export function areEmpty(args: any[]): boolean {
    let error = false;

    for(let i = 0; i < args.length && !error; i++) {
        error = isEmpty(args[i]);
    }

    return error;
}

export function isOnlyText(data: string): boolean {
    let regex = RegExp(/^[a-zA-Z ]+$/);
    return regex.exec(data) !== null;
}