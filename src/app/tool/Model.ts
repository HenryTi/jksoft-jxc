import { atom } from "jotai";
import { setAtomValue } from "tonwa-com";
import { Atom, AtomMetric, Detail, MetricItem } from "uqs/UqDefault";

export interface Spec {
    id?: number;
}

export interface SpecBatchValid extends Spec {
    no: string;
    效期: Date;
}

export interface SpecShoe extends Spec {
    size: string;
    color: string;
}

export interface AtomMetricSpec {
    atom?: AtomPhrase;
    metricItem?: MetricItem;
    atomMetric?: number;
    spec?: Spec;           // keys
}

export interface DetailAtomSpec extends Detail {
    atomMetricSpec?: AtomMetricSpec;
}

export interface OriginDetail extends DetailAtomSpec {
    pend: number;
    pendValue: number;
    sheet: string;          // sheet phrase
    no: string;             // sheet no
}

export interface SheetRow {
    origin: OriginDetail;
    details: DetailAtomSpec[];
}

export class EditingRow {
    origin: OriginDetail;
    readonly atomDetails = atom<DetailAtomSpec[]>([]);         // 新产生的明细内容。不分解明细的话，就只有一行
    error?: string;

    constructor(origin: OriginDetail, details: DetailAtomSpec[]) {
        this.origin = origin;
        setAtomValue(this.atomDetails, details ?? []);
    }
}

export interface AtomPhrase extends Atom {
    phrase: string;
}

export interface DetailWithOrigin {
    detail: DetailAtomSpec;
    origin: OriginDetail;
}
