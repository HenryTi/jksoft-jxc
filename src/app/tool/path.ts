import { to62 } from "tonwa-com";

function idPart(part: number | string) {
    switch (typeof part) {
        default: debugger; throw new Error('wrong part in idPart(part)');
        case 'undefined': return '';
        case 'string': return '/:' + part;
        case 'number': return '/' + to62(part);
    }
}


export function path(route: string, phrase: number | string, id: number | string) {
    return `${route}${idPart(phrase)}${idPart(id)}`;
}
