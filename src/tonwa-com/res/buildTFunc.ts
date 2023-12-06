import { env } from "../tools"

export function buildTFunc<T = string>(res: { [lang: string]: any }) {
    let langRes = res[env.lang];
    return function (str: T): string {
        return langRes[str];
    }
}
