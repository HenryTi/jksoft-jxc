import { atom } from "jotai";
import { Modal } from "tonwa-app";
import { setAtomValue } from "tonwa-com";
import { EntityReport } from "app/Biz";
import { Console, Store } from "../../../tool";
import { ParamGetReport } from "uqs/UqDefault";

interface SpecRow {
    id: number;
    phrase: number;
    base: number;
    value: number[];
    props: object;
}

interface ReportRow {
    id: number;
    phrase: number;
    no: string;
    ex: string;
    value: number[];
    sums: number[];
    specs: SpecRow[];
}

export class ReportStore extends Store<EntityReport> {
    readonly console: ReportConsole;
    constructor(entityReport: EntityReport, console: ReportConsole) {
        super(entityReport);
        this.console = console;
    }
}

export class ReportConsole extends Console {
    readonly entityReport: EntityReport;
    atomBizScript = atom(undefined as string);

    constructor(modal: Modal, entityReport: EntityReport) {
        super(entityReport.uq, modal);
        this.entityReport = entityReport;
    }

    createReportStore() {
        return new ReportStore(this.entityReport, this);
    }

    async loadBizScript() {
        let { id } = this.entityReport;
        let { ret } = await this.uq.GetEntityCode.query({ id });
        let data = ret[0];
        const { code, schema } = data;
        setAtomValue(this.atomBizScript, code);
    }

    readonly loadReport = async (param: { from: Date; to: Date }, pageStart: any, pageSize: number) => {
        const { from, to } = param;
        const { id, from: reportFrom, title } = this.entityReport;
        let atomId: number = undefined; // 器械
        // let atomId = 4294984880; // 药品
        const queryParam: ParamGetReport = {
            reportPhrase: id,
            atomPhrase: 4294984460, //reportFrom.id,
            atomId,
            dateStart: from,
            dateEnd: to,
            params: { a: 1 }
        };
        let { $page, specs } = await this.uq.GetReport.page(queryParam, pageStart, pageSize);
        let ret: ReportRow[] = [];
        let coll: { [id: number]: ReportRow } = {};
        for (let row of $page) {
            let rr: ReportRow = { ...row, specs: [], sums: undefined };
            const { id } = rr;
            coll[id] = rr;
            ret.push(rr);
        }
        for (let spec of specs) {
            let { base } = spec;
            let rr = coll[base];
            if (rr === undefined) continue;
            rr.specs.push(spec);
        }
        for (let rr of ret) {
            const { value, specs } = rr;
            const sums: number[] = [];
            if (specs.length === 0) {
                sums.push(...rr.value);
            }
            else {
                for (let spec of specs) {
                    const { value } = spec;
                    if (value === undefined) continue;
                    const { length: len } = value;
                    for (let i = 0; i < len; i++) {
                        let sum = sums[i];
                        if (sum === undefined) sum = 0;
                        sum += value[i];
                        sums[i] = sum;
                    }
                }
            }
            rr.sums = sums;
        }
        return ret;
    }
}
