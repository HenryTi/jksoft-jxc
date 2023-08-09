export interface UomType {
    name: string;
    caption: string;
    value: number;
}

export interface Uom {
    id: number;
    no: string;
    ex: string;
    discription: string;
    type: number;
}

export interface UomI {
    uom: Uom;
    id: number;
    no: string;
    ex: string;
    discription: string;
    ratio: number;
}

export interface UomX {
    id: number;
    no: string;
    ex: string;
    ratio: number;
}
