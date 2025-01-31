import { atom } from "jotai";
import { setAtomValue } from "tonwa-com";

/*
export interface Spec {
    id?: number;
    $phrase: string;
}
*/
/*
export interface AtomPhrase extends AtomData {
    // phrase: string;
}
*/

export interface OriginDetail extends Bin {
    pend: number;
    pendValue: number;
    sheet: string;          // sheet phrase
    no: string;             // sheet no
}

export interface SheetRow {
    origin: OriginDetail;
    details: Bin[];
}

export class EditingRow {
    origin: OriginDetail;
    readonly atomDetails = atom<Bin[]>([]);         // 新产生的明细内容。不分解明细的话，就只有一行
    error?: string;

    constructor(origin: OriginDetail, details: Bin[]) {
        this.origin = origin;
        setAtomValue(this.atomDetails, details ?? []);
    }
}

export interface DetailWithOrigin {
    detail: Bin;
    origin: OriginDetail;
}

export interface Bin {
    id: number;
    origin: number;
    i: number;
    x: number;
    value: number;
    amount: number;
    price: number;
}
