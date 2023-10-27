import { UqApp } from 'app/UqApp';
import { UqExt } from 'uqs/UqDefault';
import { Entity } from './Entity';
import { EntityAtom, EntityPick, EntitySpec } from './EntityAtom';
import { EntityTree } from './EntityTree';
import { EntityBin, EntityPend, EntitySheet } from './EntitySheet';
import { EntityTitle } from './EntityTitle';
import { EntityTie } from './EntityTie';
import { EntityPermit, EntityRole } from './EntityPermit';
import { EntityOptions } from './EntityOptions';
import { from62, getAtomValue, setAtomValue } from 'tonwa-com';
import { atom } from 'jotai';
import { EntityReport } from './EntityReport';
import { EntityQuery } from './EntityQuery';
import { EntityAssign } from './EntityAssign';

enum EnumEntity {
    sheet,
    bin,
    pend,
    atom,
    spec,
    query,
    pick,
    options,
    report,
    permit,
    role,
    title,
    assign,
    tree,
    tie,
};

interface Group {
    caption: string;
    entities: [Entity[], string?, string?, string?][];
    icon?: string;
    iconColor?: string;
}
// [{group: name Entity[], string?, string?, string?][]

export class Biz {
    readonly uqApp: UqApp;
    readonly uq: UqExt;
    readonly atoms: EntityAtom[] = [];
    readonly atomRoots: EntityAtom[] = [];
    readonly specs: EntitySpec[] = [];

    readonly sheets: EntitySheet[] = []
    readonly bins: EntityBin[] = [];
    readonly pends: EntityPend[] = [];

    readonly queries: EntityQuery[] = [];
    readonly picks: EntityPick[] = [];
    readonly options: EntityOptions[] = [];

    readonly ties: EntityTie[] = [];
    readonly trees: EntityTree[] = [];
    readonly titles: EntityTitle[] = [];
    readonly reports: EntityReport[] = [];
    readonly assigns: EntityAssign[] = [];

    readonly roles: EntityRole[] = [];
    readonly permits: EntityPermit[] = [];

    readonly all: Group[] = [];
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
        if (bizSchema === undefined) return;
        const builders: { [type in EnumEntity]: (id: number, name: string, type: string) => Entity } = {
            [EnumEntity.sheet]: this.buildSheet,
            [EnumEntity.bin]: this.buildBin,
            [EnumEntity.pend]: this.buildPend,
            [EnumEntity.atom]: this.buildAtom,
            [EnumEntity.spec]: this.buildSpec,
            [EnumEntity.query]: this.buildQuery,
            [EnumEntity.pick]: this.buildPick,
            [EnumEntity.options]: this.buildOptions,
            [EnumEntity.report]: this.buildReport,
            [EnumEntity.permit]: this.buildPermit,
            [EnumEntity.role]: this.buildRole,
            [EnumEntity.title]: this.buildTitle,
            [EnumEntity.assign]: this.buildAssign,
            [EnumEntity.tree]: this.buildTree,
            [EnumEntity.tie]: this.buildTie,
        }
        for (let group of this.all) {
            let { entities } = group;
            for (let entitiesRow of entities) {
                let [arr] = entitiesRow;
                arr.splice(0);
            }
        }
        this.all.splice(0);
        let $biz = bizSchema;
        let arr: { [entity in EnumEntity]?: [Entity, any][]; } = {};
        this.entities = {};
        this.entityIds = {};
        for (let i in $biz) {
            let schema = ($biz as any)[i];
            let { id, name, phrase, type, caption } = schema;
            let enumType = EnumEntity[type] as unknown as EnumEntity;
            let builder = builders[enumType];
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
            let entityArr = arr[enumType];
            if (entityArr === undefined) {
                entityArr = [];
                arr[enumType] = entityArr;
            }
            entityArr.push([bizEntity, schema]);
        }
        for (let i in arr) {
            for (let [bizEntity, schema] of arr[i as unknown as EnumEntity]) {
                bizEntity.fromSchema(schema);
            }
        }
        const typeSeq: EnumEntity[] = [
            EnumEntity.title,
            EnumEntity.assign,
            EnumEntity.options,
            EnumEntity.permit,
            EnumEntity.role,
            EnumEntity.atom,
            EnumEntity.spec,
            EnumEntity.sheet,
            EnumEntity.bin,
            EnumEntity.pend,
            EnumEntity.pick,
            EnumEntity.query,
            EnumEntity.report,
            EnumEntity.tree,
            EnumEntity.tie,
        ];
        for (let i of typeSeq) {
            let entityArr = arr[i];
            if (entityArr === undefined) continue;
            for (let [bizEntity] of entityArr) {
                bizEntity.scan();
            }
        }
        this.buildRootAtoms();
        this.all.push(
            {
                caption: '基础数据',
                entities: [
                    [this.atoms],
                    [this.atomRoots, '基础编码', 'id-card-o'],
                    [this.specs, '细分编码', 'asterisk'],
                    [this.titles, '科目', 'flag-o'],
                    [this.assigns, '赋值', 'flag-o']
                ],
            },
            {
                caption: '业务流程',
                entities: [
                    [this.sheets, '业务单据', 'file'],
                    [this.bins, '单据条', 'file-text-o'],
                    [this.pends, '待处理', 'clone'],
                ],
            },
            {
                caption: '数据关系',
                entities: [
                    [this.queries, '捡取查询', 'hand-pointer-o'],
                    [this.picks, '捡取器', 'hand-pointer-o'],
                    [this.options, '可选项', 'check-square-o'],
                    [this.ties, '对照表', 'list'],
                    [this.trees, '层级结构', 'indent'],
                ],
            },
            {
                caption: '查询汇总',
                entities: [
                    [this.reports, '报表', 'file'],
                ],
            },
            {
                caption: '权限',
                entities:
                    [
                        [this.roles, '角色', 'user-o'],
                        [this.permits, '许可', 'user'],
                    ]
            }
        );
        for (let group of this.all) {
            let { entities } = group;
            for (let entitiesRow of entities) {
                let [arr] = entitiesRow;
                arr.sort((a, b) => {
                    const { id: aId } = a;
                    const { id: bId } = b;
                    if (aId < bId) return -1;
                    return aId === bId ? 0 : 1;
                });
            }
        }
        this.refresh();
    }

    refresh() {
        setAtomValue(this._refresh, !getAtomValue(this._refresh));
    }

    delEntity(entity: Entity) {
        this.entities[entity.name];
        this.entityIds[entity.id];
        for (let group of this.all) {
            const { entities } = group;
            for (let row of entities) {
                const [entities] = row;
                for (let i = 0; i < entities.length; i++) {
                    if (entities[i] === entity) {
                        entities.splice(i, 1);
                        break;
                    }
                }
            }
        }
        this.refresh();
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

    private buildBin = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityBin(this, id, name, type);
        this.bins.push(bizEntity);
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
    private buildQuery = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityQuery(this, id, name, type);
        this.queries.push(bizEntity);
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

    private buildAssign = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityAssign(this, id, name, type);
        this.assigns.push(bizEntity);
        return bizEntity;
    }

    private buildReport = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityReport(this, id, name, type);
        this.reports.push(bizEntity);
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
