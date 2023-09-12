import { UqApp } from 'app/UqApp';
import { UqExt, uqSchema } from 'uqs/UqDefault';
import { Entity } from './Entity';
import { EntityAtom, EntitySpec } from './EntityAtom';
import { EntityTree } from './EntityTree';
import { EntitySetting } from './EntitySetting';
import { EntityDetail, EntityMain, EntityPend, EntitySheet } from './EntitySheet';
import { EntitySubject } from './EntitySubject';
import { EntityTie } from './EntityTie';
import { EntityPermit, EntityRole } from './EntityPermit';
import { EntityOptions } from './EntityOptions';

export class Biz {
    readonly uqApp: UqApp;
    readonly uq: UqExt;
    readonly entities: { [name: string]: Entity } = {};
    readonly roles: EntityRole[] = [];
    readonly permits: EntityPermit[] = [];

    constructor(uqApp: UqApp, bizSchema: any) {
        this.uqApp = uqApp;
        this.uq = uqApp.uq;
        this.buildEntities(bizSchema);
    }

    init() { }

    rootAtoms(): EntityAtom[] {
        let ret: EntityAtom[] = [];
        for (let i in this.entities) {
            const entity = this.entities[i];
            if (entity.type === 'atom') {
                const entityAtom = entity as EntityAtom;
                const { base } = entityAtom;
                if (base !== undefined) continue;
                ret.push(entityAtom);
            }
        }
        return ret;
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

    private buildEntities(bizSchema: any) {
        const builders: { [type: string]: (name: string, type: string) => Entity } = {
            sheet: this.buildSheet,
            main: this.buildMain,
            detail: this.buildDetail,
            pend: this.buildPend,
            atom: this.buildAtom,
            spec: this.buildSpec,
            options: this.buildOptions,
            permit: this.buildPermit,
            role: this.buildRole,
            moniker: this.buildMoniker,
            tree: this.buildTree,
            tie: this.buildTie,
        }
        // let { $biz } = uqSchema;
        let $biz = bizSchema;
        let arr: [Entity, any][] = [];
        for (let i in $biz) {
            let schema = ($biz as any)[i];
            let { name, type, caption } = schema;
            let builder = builders[type];
            if (builder === undefined) {
                if (name === '$user' || name === '$unit') continue;
                throw new Error(`unknown biz type='${type}' name='${name}' caption='${caption}'`);
            }
            let bizEntity = builder(name, type);
            arr.push([bizEntity, schema]);
        }
        for (let [bizEntity, schema] of arr) {
            bizEntity.fromSchema(schema);
        }
        for (let [bizEntity] of arr) {
            bizEntity.scan();
        }
    }

    private buildSheet = (name: string, type: string): Entity => {
        let bizEntity = new EntitySheet(this, name, type);
        return this.entities[bizEntity.name] = bizEntity;
    }

    private buildMain = (name: string, type: string): Entity => {
        let bizEntity = new EntityMain(this, name, type);
        return this.entities[bizEntity.name] = bizEntity;
    }

    private buildDetail = (name: string, type: string): Entity => {
        let bizEntity = new EntityDetail(this, name, type);
        return this.entities[bizEntity.name] = bizEntity;
    }

    private buildPend = (name: string, type: string): Entity => {
        let bizEntity = new EntityPend(this, name, type);
        return this.entities[bizEntity.name] = bizEntity;
    }

    private buildAtom = (name: string, type: string): Entity => {
        let bizEntity = new EntityAtom(this, name, type);
        this.entities[bizEntity.phrase] = bizEntity;
        return this.entities[bizEntity.name] = bizEntity;
    }

    private buildSpec = (name: string, type: string): Entity => {
        let bizEntity = new EntitySpec(this, name, type);
        return this.entities[bizEntity.name] = bizEntity;
    }

    private buildOptions = (name: string, type: string): Entity => {
        let bizEntity = new EntityOptions(this, name, type);
        return this.entities[bizEntity.name] = bizEntity;
    }

    private buildPermit = (name: string, type: string): Entity => {
        let bizEntity = new EntityPermit(this, name, type);
        this.permits.push(bizEntity);
        return this.entities[bizEntity.name] = bizEntity;
    }

    private buildRole = (name: string, type: string): Entity => {
        let bizEntity = new EntityRole(this, name, type);
        this.roles.push(bizEntity);
        return this.entities[bizEntity.name] = bizEntity;
    }

    private buildMoniker = (name: string, type: string): Entity => {
        let bizEntity = new EntitySubject(this, name, type);
        return this.entities[bizEntity.name] = bizEntity;
    }

    private buildTree = (name: string, type: string): Entity => {
        let bizEntity = new EntityTree(this, name, type);
        return this.entities[bizEntity.name] = bizEntity;
    }

    private buildTie = (name: string, type: string): Entity => {
        let bizEntity = new EntityTie(this, name, type);
        return this.entities[bizEntity.name] = bizEntity;
    }
}
