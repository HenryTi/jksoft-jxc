import { BizBud, Entity, EntityAtom } from "app/Biz";
import { atom } from "jotai";
import { wait } from "tonwa-com";

export type PropValue = string | number | (number[]);
export type RefAtom = [EntityAtom, string, number, number]; // , no, rowIndex, propIndex
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
    refAtoms: RefAtom[]; // refEntity, no, row index, prop index
    ln: number;         // 起始文字行
    stateAtom = atom<State>();

    constructor(importAtom: ImportAtom) {
        this.importAtom = importAtom;
    }

    get hasError() {
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
    }

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
        const maxRows = 8;
        let serverError: any;
        for (let row of rows) {
            if (promises.length === maxRows) {
                await Promise.all(promises);
                step(rowGroup);
                rowGroup = [];
                promises = [];
            }
            const { no, ex, props } = row;
            rowGroup.push(row);
            promises.push((async () => {
                try {
                    let arrProps = props.filter(v => v !== undefined && v !== '').map((value, index) => ([cols[index + 2].bud.id, value]));
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
}

export class ImportAtom {
    readonly rootEntity: EntityAtom;
    readonly arrAtomData: AtomData[] = [];

    constructor(entity: EntityAtom) {
        this.rootEntity = entity;
    }

    get hasError() {
        for (let atomData of this.arrAtomData) {
            if (atomData.hasError === true) return true;
        }
        return false;
    }

    async loadAtomNos(atomData: AtomData) {
        if (atomData.hasError === true) return;
        let coll: { [id: number]: { [no: string]: RefAtom } } = {};
        let arr: RefAtom[] = [];
        let { refAtoms } = atomData;
        for (let refAtom of refAtoms) {
            let [entity, no] = refAtom;
            const { id } = entity;
            let noColl = coll[id];
            if (noColl === undefined) coll[id] = noColl = {};
            if (noColl[no] === undefined) {
                noColl[no] = refAtom;
                arr.push(refAtom);
            }
        }
        let results = await this.rootEntity.biz.uq.GetAtomNos.submit({
            arr: arr.map(([entity, no]) => ({
                entity: entity.rootClass.id, no
            }))
        });
        let { length } = results;
        for (let i = 0; i < length; i++) {
            let [, , rowIndex, propIndex] = arr[i];
            let row = atomData.rows[rowIndex];
            let ret = results[i];
            let retId = ret.id;
            if (retId === 0) {
                atomData.errorRows.push([rowIndex, [[propIndex, EnumError.invalidValue]]]);
            }
            else {
                row.props[propIndex] = retId;
            }
        }
    }
}
