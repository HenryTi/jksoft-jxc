import { UqApp } from 'app/UqApp';
import { UqExt, uqSchema } from 'uqs/UqDefault';
import { Entity } from './Entity';
import { EntityItem } from './EntityItem';
import { EntitySetting } from './EntitySetting';
import { EntitySheet } from './EntitySheet';
import { EntitySubject } from './EntitySubject';

export class Biz {
    readonly uq: UqExt;
    readonly sheets: { [name: string]: EntitySheet } = {}
    readonly items: { [name: string]: EntityItem } = {}
    readonly settings: { [name: string]: EntitySetting } = {}
    readonly permits: { [name: string]: EntityPermit } = {}
    readonly roles: { [name: string]: EntityRole } = {}
    readonly subjects: { [name: string]: EntitySubject } = {}

    constructor(uqApp: UqApp) {
        this.uq = uqApp.uq;
        this.buildEntities();
    }

    private buildEntities() {
        const builders: { [type: string]: (name: string, type: string) => Entity } = {
            sheet: this.buildSheet,
            item: this.buildItem,
            setting: this.buildSetting,
            permit: this.buildPermit,
            role: this.buildRole,
            subject: this.buildSubject,
        }
        let { $biz } = uqSchema;
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
    }

    private buildSheet = (name: string, type: string): Entity => {
        let bizEntity = new EntitySheet(this, name, type);
        return this.sheets[bizEntity.name] = bizEntity;
    }

    private buildItem = (name: string, type: string): Entity => {
        let bizEntity = new EntityItem(this, name, type);
        return this.items[bizEntity.name] = bizEntity;
    }

    private buildSetting = (name: string, type: string): Entity => {
        let bizEntity = new EntitySetting(this, name, type);
        return this.settings[bizEntity.name] = bizEntity;

    }

    private buildPermit = (name: string, type: string): Entity => {
        let bizEntity = new EntityPermit(this, name, type);
        return this.permits[bizEntity.name] = bizEntity;

    }

    private buildRole = (name: string, type: string): Entity => {
        let bizEntity = new EntityRole(this, name, type);
        return this.roles[bizEntity.name] = bizEntity;
    }

    private buildSubject = (name: string, type: string): Entity => {
        let bizEntity = new EntitySubject(this, name, type);
        return this.subjects[bizEntity.name] = bizEntity;
    }
}

export class EntityPermit extends Entity {

}

export class EntityRole extends Entity {

}
