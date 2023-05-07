import { atom } from "jotai";
import { setAtomValue } from "tonwa-com";
import { Detail } from "uqs/UqDefault";

export interface OriginDetail extends Detail {
    pend: number;
    pendValue: number;
    sheet: string;          // sheet phrase
    no: string;             // sheet no
}

export interface SheetRow {
    origin: OriginDetail;
    details: Detail[];
}

export class EditingRow {
    origin: OriginDetail;
    readonly atomDetails = atom<Detail[]>([]);         // 新产生的明细内容。不分解明细的话，就只有一行
    error?: string;

    constructor(origin: OriginDetail, details: Detail[]) {
        this.origin = origin;
        setAtomValue(this.atomDetails, details ?? []);
    }
}
