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
                const { _extends } = entityAtom;
                if (_extends !== undefined) continue;
                ret.push(entityAtom);
            }
        }
        return ret;
    }

    entityFrom62<T extends Entity>(base62: string): T {
        let entityId = from62(base62);
        for (let i in this.entities) {
            let entity = this.entities[i];
            if (entity.entityId === entityId) return entity as T;
        }
        return;
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
        const builders: { [type: string]: (name: string, type: string) => Entity } = {
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
    /*
        private buildBud = (name: string, type: string): Entity => {
            let bizEntity = new EntityBud(this, name, type);
            return this.entities[bizEntity.name] = bizEntity;
        }
    */
    private buildPick = (name: string, type: string): Entity => {
        let bizEntity = new EntityPick(this, name, type);
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

    private buildTitle = (name: string, type: string): Entity => {
        let bizEntity = new EntityTitle(this, name, type);
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
