// Function.prototype["promisify"] = _promisify;

export interface IPromisifyOptions {
    timeout?: number;
    arguments?: IArguments;
}

let DefaultPromisifyOptions: IPromisifyOptions = {
    timeout: null,
    arguments: null
}

export default function Promisify<T>(method: (...args: any[]) => T, options: IPromisifyOptions = null) : Promise<T> {
    options = Object["assign"]({}, DefaultPromisifyOptions, options || {});

    let process = (resolve, reject) => {
        try {
            let final = method.apply(method, options.arguments || []);
            resolve(final);
        }
        catch (e) {
            reject(e);
        }
    };

    let promiseMethod = (resolve, reject) => {
        setTimeout(() => { process(resolve, reject); }, options.timeout || 0)
    };

    let promise = new Promise<any>(promiseMethod);
    return promise;
}

function _promisify() {
    return Promisify(this, {
        arguments: arguments
    });
}