import { Biz, BizBud, BudID, BudOptions, EntityAtom, EnumBudType } from "app/Biz";
import { atom } from "jotai";
import { setAtomValue } from "tonwa-com";
import { Parser, Sep } from "./Parser";
import { getDays } from "app/tool";
import { BizPhraseType } from "uqs/UqDefault";

export type PropValue = string | number | (number[]);
export type ErrorCol = [number, EnumError];
export type ErrorRow = [number, ErrorCol[]];
export enum EnumError {
    none = 0,
    nonexists = 1,
    invalidValue = 2,
}
export interface AtomRow {
    no: string;
    ex: string;
    props: PropValue[];
    ln: number;
}
export interface Col {
    header: string;
    bud: BizBud;
}
export interface State {
    row: AtomRow;
    error?: any;
}
export class AtomData {
    // readonly importAtom: ImportAtom;
    private readonly biz: Biz;
    private readonly parser: Parser;
    entityRoot: EntityAtom;
    entityLeaf: EntityAtom;
    entityName: string;
    entityAtom: EntityAtom;
    cols: Col[];
    readonly rows: AtomRow[];
    readonly errorRows: ErrorRow[];      // 行号，字段号
    errorAtoms: { [col: number]: number[] };
    ln: number;         // 起始文字行
    loopEnd: boolean;
    readonly stateAtom = atom<State>();
    readonly idsLoadedAtom = atom<boolean>(false);

    constructor(biz: Biz, csv: string) {
        this.biz = biz;
        this.parser = new Parser(this, csv);
        this.rows = [];
        this.errorRows = [];
        this.loopEnd = false;
    }

    parseHead() {
        this.parser.parseHead();
    }

    setEntity(entityName: string) {
        entityName = entityName.toLowerCase();
        this.entityName = entityName;
        let entity = this.biz.entities[entityName];
        if (entity === undefined) return;
        if (entity.bizPhraseType !== BizPhraseType.atom) return;
        this.entityAtom = entity as EntityAtom;
        if (this.entityAtom.subClasses.length > 0) return;
        this.entityLeaf = this.entityAtom;
        this.entityRoot = this.entityLeaf.rootClass;
    }

    setCols(cols: string[]) {
        this.cols = cols.map(v => ({
            header: v,
            bud: this.entityLeaf.budFromName(v.toLowerCase()),
        }));
    }

    addRow(cells: string[]) {
        ++this.ln;
        if (cells.length < 2) return;
        let no = cells[0];
        let ex = cells[1];
        let props: PropValue[] = [];
        let errs: ErrorCol[] = [];
        const { length } = cells;
        for (let i = 2; i < length; i++) {
            let col = this.cols[i];
            if (col === undefined) break;
            const { bud } = col;
            const word = cells[i];
            if (word.length === 0) {
                props.push(undefined);
            }
            else if (this.entityLeaf !== undefined) {
                if (bud !== undefined) {
                    let v = this.budValue(bud, word);
                    if (v === null) {
                        errs.push([i, EnumError.invalidValue]);
                    }
                    props.push(v);
                }
                else {
                    errs.push([i, EnumError.nonexists]);
                }
            }
        }
        this.rows.push({ no, ex, props, ln: this.ln });
        if (errs.length > 0) {
            this.errorRows.push([this.ln, errs]);
        }
    }

    private budValue(bud: BizBud, v: string): PropValue {
        switch (bud.budDataType.type) {
            default: return this.budNumberValue(v);
            case EnumBudType.dec: return this.budNumberValue(v);
            case EnumBudType.char:
            case EnumBudType.str: return v;
            case EnumBudType.radio: return this.budRadioValue(bud, v);
            case EnumBudType.check: return this.budCheckValue(bud, v);
            case EnumBudType.date: return this.budDateValue(v);
            case EnumBudType.datetime: return this.budDateTimeValue(v);
            case EnumBudType.ID:
            case EnumBudType.atom: return v;
        }
    }

    private budNumberValue(v: string) {
        let dec = Number(v);
        if (Number.isNaN(dec) === true) return;
        return dec;
    }

    private budDateValue(v: string) {
        let date = getDays(v);
        return date;
    }

    private budDateTimeValue(v: string) {
        let date = getDays(v);
        return date;
    }

    private budRadioValue(bud: BizBud, v: string) {
        const { budDataType } = bud;
        const { options } = budDataType as BudOptions;
        let optionItem = options.items.find(item => item.name === v);
        if (optionItem === undefined) return;
        return optionItem.id;
    }

    private budCheckValue(bud: BizBud, v: string) {
        const { budDataType } = bud;
        const { options } = budDataType as BudOptions;
        let parts = v.split('+');
        let ret: number[] = [];
        for (let p of parts) {
            p = p.trim();
            let optionItem = options.items.find(item => item.name === p);
            if (optionItem === undefined) return;
            ret.push(optionItem.id);
        }
        return ret;
    }

    get hasAtomCols() {
        for (let i = 2; i < this.cols.length; i++) {
            const col = this.cols[i];
            const { budDataType } = col.bud;
            if (budDataType.type === EnumBudType.atom) return true;
        }
        return false;
    }

    hasErrorAtom = atom((get) => {
        if (this.entityLeaf === undefined) return true;
        if (this.errorRows.length > 0) return true;
        if (this.cols.length < 2) return true;
        const [noCol, exCol] = this.cols;
        if (noCol.header.toLowerCase() !== 'no') return true;
        if (exCol.header.toLowerCase() !== 'ex') return true;
        for (let i = 2; i < this.cols.length; i++) {
            if (this.cols[i].bud === undefined) return true;
        }
        return false;
    });

    get errorCols() {
        let cols: Col[] = [];
        for (let i = 2; i < this.cols.length; i++) {
            let col = this.cols[i];
            if (col.bud === undefined) {
                cols.push(col);
            }
        }
        return cols;
    }

    async start() {
        const maxRows = 30;
        let date = Date.now();
        this.ln = 0;
        for (; ;) {
            if (this.loopEnd === true) break;
            let sep = this.parser.parseRow();
            if (sep === Sep.eof) break;
            if (this.rows.length >= maxRows) {
                let ret = await this.upload();
                this.rows.splice(0);
                if (ret === false) break;
            }
        }
        if (this.rows.length > 0) {
            await this.upload();
        }
        setAtomValue(this.stateAtom, { row: undefined });
        this.ln = -1;
        return Date.now() - date;
    }

    private async upload() {
        // this.parseHead();
        // this.parser.parse();
        const { entityLeaf, rows, cols } = this;
        const phrase = entityLeaf.id;
        const rootEntity = entityLeaf.rootClass;
        const rootPhrase = rootEntity.id;
        const { uq } = entityLeaf.biz;
        let serverError: any;
        const { stateAtom } = this;
        async function uploadOneRow(row: AtomRow) {
            const { no, ex, props } = row;
            let arrProps = props
                .map((value, index) => ([cols[index + 2].bud.id, value]))
                .filter(v => {
                    const [, value] = v;
                    return value !== undefined && value !== '';
                });
            setAtomValue(stateAtom, {
                row,
            });
            try {
                let ret = await uq.SaveAtomAndProps.submit({
                    rootPhrase,
                    phrase,
                    no,
                    ex,
                    props: arrProps
                });
            }
            catch (e) {
                serverError = e;
            }
        }

        await this.getAtomIds(this.rows);

        if (this.errorAtoms !== undefined) {
            setAtomValue(stateAtom, {
                row: undefined,
            });
            return false;
        }
        let promises: Promise<any>[] = this.rows.map(row => uploadOneRow(row));
        await Promise.all(promises);
        return true;
    }

    async getAtomIds(rowGroup: AtomRow[]) {
        for (let i = 2; i < this.cols.length; i++) {
            const col = this.cols[i];
            const { budDataType } = col.bud;
            if (budDataType.type !== EnumBudType.atom) continue;
            const { entityID } = budDataType as BudID;
            await this.getAtomColIds(rowGroup, entityID, i - 2);
        }
    }

    private async getAtomColIds(rowGroup: AtomRow[], atom: EntityAtom, propIndex: number) {
        const rootEntity = this.entityLeaf.rootClass;
        const noColl: { [no: string]: number[] } = {}; // no: rowIndex array;
        const arrNo: string[] = [];
        for (let i = 0; i < rowGroup.length; i++) {
            let row = rowGroup[i];
            let no = row.props[propIndex] as string;
            if (no === undefined) continue;
            let arrRowIndex = noColl[no];
            if (arrRowIndex === undefined) {
                noColl[no] = arrRowIndex = [];
                arrNo.push(no);
            }
            arrRowIndex.push(i);
        }

        let results = await rootEntity.biz.uq.GetAtomIds.submitReturns({
            entity: atom.id,
            arrNo,
        });
        const { ret } = results;
        const errorAtomRows: number[] = [];
        for (let { no, id } of ret) {
            let rows = noColl[no];
            for (let rowIndex of rows) {
                if (!id) {
                    errorAtomRows.push(rowIndex);
                }
                else {
                    rowGroup[rowIndex].props[propIndex] = id;
                }
            }
        }
        if (errorAtomRows.length > 0) {
            if (this.errorAtoms === undefined) {
                this.errorAtoms = {};
            }
            this.errorAtoms[propIndex + 2] = errorAtomRows;
        }
        setAtomValue(this.idsLoadedAtom, true);
    }
}
