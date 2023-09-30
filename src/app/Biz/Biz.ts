import { UqApp } from 'app/UqApp';
import { UqExt } from 'uqs/UqDefault';
import { Entity } from './Entity';
import { EntityAtom, EntityPick, EntitySpec } from './EntityAtom';
import { EntityTree } from './EntityTree';
import { EntityDetail, EntityMain, EntityPend, EntitySheet } from './EntitySheet';
import { EntityTitle } from './EntityTitle';
import { EntityTie } from './EntityTie';
import { EntityPermit, EntityRole } from './EntityPermit';
import { EntityOptions } from './EntityOptions';
import { from62, getAtomValue, setAtomValue } from 'tonwa-com';
import { atom } from 'jotai';

export class Biz {
    readonly uqApp: UqApp;
    readonly uq: UqExt;
    readonly atoms: EntityAtom[] = [];
    readonly atomRoots: EntityAtom[] = [];
    readonly specs: EntitySpec[] = [];

    readonly sheets: EntitySheet[] = []
    readonly mains: EntityMain[] = [];
    readonly details: EntityDetail[] = [];
    readonly pends: EntityPend[] = [];

    readonly picks: EntityPick[] = [];
    readonly options: EntityOptions[] = [];

    readonly ties: EntityTie[] = [];
    readonly trees: EntityTree[] = [];
    readonly titles: EntityTitle[] = [];

    readonly roles: EntityRole[] = [];
    readonly permits: EntityPermit[] = [];

    readonly all: [Entity[], string?, string?, string?][] = [];
    readonly _refresh = atom(false);

    entities: { [name: string]: Entity } = {};
    entityIds: { [id: number]: Entity } = {};

    constructor(uqApp: UqApp, bizSchema: any) {
        this.uqApp = uqApp;
        this.uq = uqApp.uq;
        this.buildEntities(bizSchema);
        // setAtomValue(this._all, this.all);
    }

    init() { }

    entityFrom62<T extends Entity>(base62: string): T {
        let entityId = from62(base62);
        let entity = this.entityIds[entityId];
        return entity as T;
    }

    buildEntities(bizSchema: any) {
        const builders: { [type: string]: (id: number, name: string, type: string) => Entity } = {
            sheet: this.buildSheet,
            main: this.buildMain,
            detail: this.buildDetail,
            pend: this.buildPend,
            atom: this.buildAtom,
            spec: this.buildSpec,
            pick: this.buildPick,
            options: this.buildOptions,
            permit: this.buildPermit,
            role: this.buildRole,
            title: this.buildTitle,
            tree: this.buildTree,
            tie: this.buildTie,
        }
        for (let a of this.all) a[0].splice(0);
        this.all.splice(0);
        let $biz = bizSchema;
        let arr: [Entity, any][] = [];
        this.entities = {};
        this.entityIds = {};
        for (let i in $biz) {
            let schema = ($biz as any)[i];
            let { id, name, phrase, type, caption } = schema;
            let builder = builders[type];
            if (builder === undefined) {
                if (name === '$user' || name === '$unit') continue;
                throw new Error(`unknown biz type='${type}' name='${name}' caption='${caption}'`);
            }
            let bizEntity = builder(id, name, type);
            this.entityIds[id] = bizEntity;
            this.entities[name] = bizEntity;
            if (name !== phrase) {
                this.entities[phrase] = bizEntity;
            }
            arr.push([bizEntity, schema]);
        }
        for (let [bizEntity, schema] of arr) {
            bizEntity.fromSchema(schema);
        }
        for (let [bizEntity] of arr) {
            bizEntity.scan();
        }
        this.buildRootAtoms();
        this.all.push(
            [this.atoms],
            [this.atomRoots, '基础编码', 'id-card-o'],
            [this.specs, '细分编码', 'asterisk'],
            [this.sheets, '业务单据', 'file'],
            [this.mains, '单据主表', 'file-o'],
            [this.details, '单据明细', 'file-text-o'],
            [this.pends, '待处理', 'clone'],
            [this.picks, '捡取器', 'hand-pointer-o'],
            [this.options, '可选项', 'check-square-o'],
            [this.ties, '对照表', 'list'],
            [this.trees, '层级结构', 'indent'],
            [this.titles, '科目', 'flag-o'],
            [this.roles, '角色', 'user-o'],
            [this.permits, '许可', 'user'],
        );
        setAtomValue(this._refresh, !getAtomValue(this._refresh));
    }

    private buildRootAtoms() {
        for (let i in this.entityIds) {
            const entity = this.entityIds[i];
            if (entity.type === 'atom') {
                const entityAtom = entity as EntityAtom;
                const { _extends } = entityAtom;
                if (_extends !== undefined) continue;
                this.atomRoots.push(entityAtom);
            }
        }
    }

    private buildSheet = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntitySheet(this, id, name, type);
        this.sheets.push(bizEntity);
        return bizEntity;
    }

    private buildMain = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityMain(this, id, name, type);
        this.mains.push(bizEntity);
        return bizEntity;
    }

    private buildDetail = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityDetail(this, id, name, type);
        this.details.push(bizEntity);
        return bizEntity;
    }

    private buildPend = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityPend(this, id, name, type);
        this.pends.push(bizEntity);
        return bizEntity;
    }

    private buildAtom = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityAtom(this, id, name, type);
        this.atoms.push(bizEntity);
        return bizEntity;
    }
    private buildSpec = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntitySpec(this, id, name, type);
        this.specs.push(bizEntity);
        return bizEntity;
    }
    private buildPick = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityPick(this, id, name, type);
        this.picks.push(bizEntity);
        return bizEntity;
    }

    private buildOptions = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityOptions(this, id, name, type);
        this.options.push(bizEntity);
        return bizEntity;
    }

    private buildPermit = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityPermit(this, id, name, type);
        this.permits.push(bizEntity);
        return bizEntity;
    }

    private buildRole = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityRole(this, id, name, type);
        this.roles.push(bizEntity);
        return bizEntity;
    }

    private buildTitle = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityTitle(this, id, name, type);
        this.titles.push(bizEntity);
        return bizEntity;
    }

    private buildTree = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityTree(this, id, name, type);
        this.trees.push(bizEntity);
        return bizEntity;
    }

    private buildTie = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityTie(this, id, name, type);
        this.ties.push(bizEntity);
        return bizEntity;
    }
}
