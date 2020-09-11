//Functions used to fetch the API

const URL = "https://api.sep.osoc.be/";

interface DatabaseResponseResult {
    success: boolean;
    message: string;
    result: object;
}

export async function fetchGetDb(endpoint: string, uri: URLSearchParams, url: string = URL): Promise<DatabaseResponseResult> {
    let responseObject;
    let response;
    let data;

    try {
        response = await fetch(url + endpoint + '?' + uri, {
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

export async function fetchPostAbb(json: string): Promise<DatabaseResponseResult> {
    let responseObject;
    let response;
    let data;

    try {
        response = await fetch("https://tmp-elections-endpoint.lblod.info/sparql", {
        "headers": {
            "Accept": "application/sparql-results+json,*/*;q=0.9",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        "referrer": "https://tmp-elections-endpoint.lblod.info/sparql",
        "method": "POST",
        "mode": "cors",
        "body": json
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

export async function fetchPostDb(endpoint: string, json: string, url: string = URL): Promise<DatabaseResponseResult> {
    let responseObject;
    let response;
    let data;

    try {
        response = await fetch(url + endpoint, {
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