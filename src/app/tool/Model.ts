import { atom } from "jotai";
import { setAtomValue } from "tonwa-com";
import { Atom, Bin } from "uqs/UqDefault";

export interface Spec {
    id?: number;
    $phrase: string;
}

export interface SpecBatchValid extends Spec {
    no: string;
    效期: Date;
}

export interface SpecShoe extends Spec {
    size: string;
    color: string;
}

export interface Uom {
    id: number;
    no: string;
    ex: string;
    atomUom: number;
}

export interface AtomPhrase extends Atom {
    phrase: string;
}

export interface AtomSpec {
    id?: number;
    atom?: AtomPhrase;
    uom?: Uom;
    // atomUom?: number;
    spec?: Spec;           // keys
}

export interface AtomUom {
    atom: number;
    uom: number;
}

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
