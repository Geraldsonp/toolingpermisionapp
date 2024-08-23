
export type XHRMethod = "GET" | "POST" | "PUT" | "DELETE";
import Settings from './AppSettings';

window["SendXHR"] = SendXHR;
export function SendXHR<T = any>({ url, method = "GET", data = null, contentType = "application/json", responseType = "json", headers = {} }: { url: string, method?: XHRMethod, data?: any, contentType?: string, responseType?: XMLHttpRequestResponseType, headers?: any }) : Promise<T> {
    // console.log(url);
    let promise = new Promise<T>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.responseType = responseType;
        xhr.open(method, url, true);

        xhr.onload = () => {
            resolve(xhr.response);
        };
        xhr.onerror = () => {
            reject(xhr.response);
        };

        xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhr.setRequestHeader("phrase", "This is our enviva app");

        if (headers) {
            for (let key in headers)
                xhr.setRequestHeader(key, headers[key]);
        }
        xhr.setRequestHeader("CurrentUser", Settings.CurrentUser.Email);
        xhr.setRequestHeader("Content-Type", contentType);

        xhr.send(data);
    });

    return promise;
}

export async function PUT<T = any>(url: string, data: any) : Promise<T> {
    const row = await SendXHR<T>({
        method: "PUT",
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json",
        responseType: "json"
    });

    return row;
}

export async function POST<T_out = any, T_in = any>(url: string, item: T_in) : Promise<T_out> {
    // console.log(item);

    const row = await SendXHR<T_out>({
        method: "POST",
        url: url,
        data: JSON.stringify(item),
        contentType: "application/json",
        responseType: "json"
    });

    return row;
}

export interface EntityId {
    id:string;
}

export async function GET<T = any>(url: string, entity?: EntityId) : Promise<T> {
    if (entity == undefined) {
        const data = await SendXHR<T>({
            method: "GET",
            url: url,
            contentType: "application/json",
            responseType: "json"
        });
    
        return data;
    }
    else {
        const data = await SendXHR<T>({
            method: "POST",
            url: url,
            data: JSON.stringify({ id: entity.id }),
            contentType: "application/json",
            responseType: "json"
        });

        return data;
    }
}

export async function DELETE<T = number>(url: string, { id }: EntityId) : Promise<T> {
    const num = await SendXHR<T>({
        method: "DELETE",
        url: url,
        data: JSON.stringify({ id: id }),
        contentType: "application/json",
        responseType: "json"
    });

    return num;
}