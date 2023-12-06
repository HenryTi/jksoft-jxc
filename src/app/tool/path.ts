import { to62 } from "tonwa-com";

function idPart(part: number | string) {
    switch (typeof part) {
        default: debugger; throw new Error('wrong part in idPart(part)');
        case 'undefined': return '';
        case 'string': return '/:' + part;
        case 'number': return '/' + to62(part);
    }
}

export function path(route: string, id1: number | string, id2: number | string) {
    return `${route}${idPart(id1)}${idPart(id2)}`;
}

export function pathTo(path0: string, p1: number, p2: number) {
    return path(`../${path0}`, p1, p2);
}
