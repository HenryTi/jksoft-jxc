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
import { from62 } from 'tonwa-com';

export class Biz {
    readonly uqApp: UqApp;
    readonly uq: UqExt;
    readonly roles: EntityRole[] = [];
    readonly permits: EntityPermit[] = [];
    entities: { [name: string]: Entity } = {};
    entityIds: { [id: number]: Entity } = {};

    constructor(uqApp: UqApp, bizSchema: any) {
        this.uqApp = uqApp;
        this.uq = uqApp.uq;
        this.buildEntities(bizSchema);
    }

    init() { }

    rootAtoms(): EntityAtom[] {
        let ret: EntityAtom[] = [];
        for (let i in this.entityIds) {
            const entity = this.entityIds[i];
            if (entity.type === 'atom') {
                const entityAtom = entity as EntityAtom;
                const { _extends } = entityAtom;
                if (_extends !== undefined) continue;
                ret.push(entityAtom);
            }
        }
        return ret;
    }

    entityFrom62<T extends Entity>(base62: string): T {
        let entityId = from62(base62);
        let entity = this.entityIds[entityId];
        /*
        for (let i in this.entities) {
            let entity = this.entities[i];
            if (entity.id === entityId) return entity as T;
        }
        */
        return entity as T;
    }

    sheetEntities(): EntitySheet[] {
        let ret: EntitySheet[] = [];
        for (let i in this.entities) {
            const entity = this.entities[i];
            if (entity.type === 'sheet') {
                const entitySheet = entity as EntitySheet;
                ret.push(entitySheet);
            }
        }
        return ret;
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
        this.entities = {};
        let $biz = bizSchema;
        let arr: [Entity, any][] = [];
        for (let i in $biz) {
            let schema = ($biz as any)[i];
            let { id, name, type, caption } = schema;
            let builder = builders[type];
            if (builder === undefined) {
                if (name === '$user' || name === '$unit') continue;
                throw new Error(`unknown biz type='${type}' name='${name}' caption='${caption}'`);
            }
            let bizEntity = builder(id, name, type);
            this.entityIds[id] = bizEntity;
            this.entities[name] = bizEntity;
            arr.push([bizEntity, schema]);
        }
        for (let [bizEntity, schema] of arr) {
            bizEntity.fromSchema(schema);
        }
        for (let [bizEntity] of arr) {
            bizEntity.scan();
        }
    }

    private buildSheet = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntitySheet(this, id, name, type);
        return bizEntity;
    }

    private buildMain = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityMain(this, id, name, type);
        return bizEntity;
    }

    private buildDetail = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityDetail(this, id, name, type);
        return bizEntity;
    }

    private buildPend = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityPend(this, id, name, type);
        return bizEntity;
    }

    private buildAtom = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityAtom(this, id, name, type);
        this.entities[bizEntity.phrase] = bizEntity;
        return bizEntity;
    }
    private buildSpec = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntitySpec(this, id, name, type);
        return bizEntity;
    }
    private buildPick = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityPick(this, id, name, type);
        return bizEntity;
    }

    private buildOptions = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityOptions(this, id, name, type);
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
        return bizEntity;
    }

    private buildTree = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityTree(this, id, name, type);
        return bizEntity;
    }

    private buildTie = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityTie(this, id, name, type);
        return bizEntity;
    }
}
