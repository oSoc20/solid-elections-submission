//Functions used to fetch the API

const URL = "https://api.sep.osoc.be/";

interface DatabaseResponseResult {
    success: boolean;
    message: string;
    result: object;
}

export async function fetchGetDb(endpoint: string, uri: URLSearchParams): Promise<DatabaseResponseResult> {
    let responseObject;
    let response;
    let data;

    try {
        response = await fetch(URL + endpoint + '?' + uri, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            mode: 'cors',
            cache: 'default'
        });

        if (response.status == 200 || response.status == 400) {
            data = await response.json();
            return responseObject = {
                success: true,
                message: "",
                result: data
            }
        }

        return responseObject = {
            success: false,
            message: response.statusText,
            result: {}
        }
    } catch (e) {
        return responseObject = {
            success: false,
            message: "Can't access to the database! : " + e.message,
            result: {}
        }
    }
}

export async function fetchPostDb(endpoint: string, json: string): Promise<DatabaseResponseResult> {
    let responseObject;
    let response;
    let data;

    try {
        response = await fetch(URL + endpoint, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            mode: 'cors',
            cache: 'default',
            body: json
        });

        if (response.status == 200 || response.status == 400) {
            data = await response.json();
            return responseObject = {
                success: true,
                message: "",
                result: data
            }
        }

        return responseObject = {
            success: false,
            message: response.statusText,
            result: {}
        }
    } catch (e) {
        return responseObject = {
            success: false,
            message: "Can't access to the database! : " + e.message,
            result: {}
        }
    }
}