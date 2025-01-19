import { BizBud, BudID, Entity, EntityAtom, EnumBudType } from "app/Biz";
import { atom } from "jotai";
import { setAtomValue } from "tonwa-com";

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
    atomIndex: number;
    ln: number;
    error: any;
}
export class AtomData {
    readonly importAtom: ImportAtom;
    entityLeaf: EntityAtom;
    entityName: string;
    entityAny: Entity;
    cols: Col[];
    rows: AtomRow[];
    errorRows: ErrorRow[];      // 行号，字段号
    errorAtoms: { [col: number]: number[] };
    ln: number;         // 起始文字行
    readonly stateAtom = atom<State>();
    readonly idsLoadedAtom = atom<boolean>(false);

    constructor(importAtom: ImportAtom) {
        this.importAtom = importAtom;
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
        if (this.hasAtomCols === true) {
            let idsLoaded = get(this.idsLoadedAtom);
            if (idsLoaded === true) {
                if (this.errorAtoms !== undefined) return true;
            }
            else {
                return true;
            }
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

    async upload(importAtom: ImportAtom, step: (rowGroup: AtomRow[], error?: any) => void) {
        const { entityLeaf, rows, cols } = this;
        const phrase = entityLeaf.id;
        const { rootEntity } = importAtom;
        const rootPhrase = rootEntity.id;
        const { uq } = entityLeaf.biz;
        let promises: Promise<any>[] = [];
        let rowGroup: AtomRow[] = [];
        const maxRows = 30;
        let serverError: any;
        for (let row of rows) {
            if (promises.length === maxRows) {
                await Promise.all(promises);
                step(rowGroup);
                rowGroup = [];
                promises = [];
            }
            rowGroup.push(row);
            promises.push((async () => {
                const { no, ex, props } = row;
                let arrProps = props
                    .map((value, index) => ([cols[index + 2].bud.id, value]))
                    .filter(v => {
                        const [, value] = v;
                        return value !== undefined && value !== '';
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
            })());
            if (serverError !== undefined) {
                step(rowGroup, serverError);
                break;
            }
        }
        if (promises.length > 0) await Promise.all(promises);
    }

    async getAtomIds() {
        for (let i = 2; i < this.cols.length; i++) {
            const col = this.cols[i];
            const { budDataType } = col.bud;
            if (budDataType.type !== EnumBudType.atom) continue;
            const { entityID } = budDataType as BudID;
            await this.getAtomColIds(entityID, i - 2);
        }
    }

    private async getAtomColIds(atom: EntityAtom, propIndex: number) {
        const { rootEntity } = this.importAtom;
        const noColl: { [no: string]: number[] } = {}; // no: rowIndex array;
        const arrNo: string[] = [];
        for (let i = 0; i < this.rows.length; i++) {
            let row = this.rows[i];
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
                    this.rows[rowIndex].props[propIndex] = id;
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

export class ImportAtom {
    readonly rootEntity: EntityAtom;
    readonly arrAtomData: AtomData[] = [];

    constructor(entity: EntityAtom) {
        this.rootEntity = entity;
    }

    hasErrorAtom = atom((get) => {
        for (let atomData of this.arrAtomData) {
            if (get(atomData.hasErrorAtom) === true) return true;
        }
        return false;
    })
}
