import { UqApp } from 'app/UqApp';
import { UqExt } from 'uqs/UqDefault';
import { Entity } from './Entity';
import { EntityAtom, EntityCombo, EntityDuo, EntityPick, EntityFork } from './EntityAtom';
import { EntityTree } from './EntityTree';
import { EntityBin, EntityPend, EntitySheet } from './EntitySheet';
import { EntityBook } from './EntityTitle';
import { EntityTie } from './EntityTie';
import { EntityRole } from './EntityPermit';
import { EntityOptions } from './EntityOptions';
import { from62, getAtomValue, setAtomValue } from 'tonwa-com';
import { EntityReport } from './EntityReport';
import { EntityQuery } from './EntityQuery';
import { EntityAssign } from './EntityAssign';
import { BizBud } from './BizBud';
import { AtomsBuilder } from './AtomsBuilder';
import { EntityConsole } from './EntityConsole';
import { EntityIOApp, EntityIOSite, EntityIn, EntityOut } from './EntityInOut';
import { atom } from 'jotai';
import { EntityPrint, EntityTemplet } from './EntityPrint';

enum EnumEntity {
    sheet,
    bin,
    pend,
    atom,
    spec,       // obselete
    fork,
    duo,
    combo,
    query,
    options,
    report,
    permit,
    title,      // obsolete
    book,
    assign,
    tree,
    tie,
    console,
    in,
    out,
    ioApp,
    ioSite,
    templet,
    print,
};

export interface BizGroup {
    name: string;
    caption: string;
    entities: [Entity[], string?, string?, string?][];
    hasEntity?: boolean;
    icon?: string;
    iconColor?: string;
}

export class Biz {
    readonly uqApp: UqApp;
    readonly uq: UqExt;
    readonly atoms: EntityAtom[] = [];
    readonly atomRoots: EntityAtom[] = [];
    readonly forks: EntityFork[] = [];
    readonly duos: EntityDuo[] = [];
    readonly combos: EntityCombo[] = [];

    readonly sheets: EntitySheet[] = []
    readonly bins: EntityBin[] = [];
    readonly pends: EntityPend[] = [];

    readonly queries: EntityQuery[] = [];
    readonly picks: EntityPick[] = [];
    readonly options: EntityOptions[] = [];

    readonly ties: EntityTie[] = [];
    readonly trees: EntityTree[] = [];
    readonly titles: EntityBook[] = [];
    readonly reports: EntityReport[] = [];
    readonly assigns: EntityAssign[] = [];
    readonly templets: EntityTemplet[] = [];
    readonly prints: EntityPrint[] = [];

    readonly roles: EntityRole[] = [];
    readonly ins: EntityIn[] = [];
    readonly outs: EntityOut[] = [];
    readonly ioApps: EntityIOApp[] = [];
    readonly ioSites: EntityIOSite[] = [];
    readonly ioSheets: EntitySheet[] = [];

    readonly groups: BizGroup[] = [];
    readonly errorLogs: string[];
    entityWithUser: Entity[];
    private readonly ids: { [id: number]: Entity | BizBud } = {};

    bizConsole: EntityConsole;
    hasEntity: boolean;
    entities: { [name: string | number]: Entity } = {};
    // atomBuilder: AtomsBuilder;
    userDefaults: { [bud: number]: string | number | (string | number)[]; };
    atomSchemasChanged = atom(false);

    constructor(uqApp: UqApp, bizSchema: any, errorLogs: any) {
        this.uqApp = uqApp;
        this.uq = uqApp.uq;
        this.errorLogs = errorLogs;

        this.buildEntities(bizSchema);
    }

    init() { }

    entityFrom62<T extends Entity>(base62: string): T {
        let entityId = from62(base62);
        let entity = this.ids[entityId];
        return entity as T;
    }

    entityFromId<T extends Entity>(id: number): T {
        if (id === undefined) return;
        let entity = this.ids[id];
        return entity as T;
    }

    budFromId(id: number) {
        let bizBud = this.ids[id];
        return bizBud as BizBud;
    }

    buildEntities(bizSchema: any) {
        if (bizSchema === undefined) return;
        // this.atomBuilder = new AtomsBuilder(this);
        this.entityWithUser = [];
        const builders: { [type in EnumEntity]: (id: number, name: string, type: string) => Entity } = {
            [EnumEntity.sheet]: this.buildSheet,
            [EnumEntity.bin]: this.buildBin,
            [EnumEntity.pend]: this.buildPend,
            [EnumEntity.atom]: this.buildAtom,
            [EnumEntity.spec]: this.buildSpec,          // obsolete
            [EnumEntity.fork]: this.buildSpec,
            [EnumEntity.duo]: this.buildDuo,
            [EnumEntity.combo]: this.buildCombo,
            [EnumEntity.query]: this.buildQuery,
            [EnumEntity.options]: this.buildOptions,
            [EnumEntity.report]: this.buildReport,
            [EnumEntity.permit]: this.buildRole,
            [EnumEntity.title]: this.buildTitle,
            [EnumEntity.book]: this.buildTitle,
            [EnumEntity.assign]: this.buildAssign,
            [EnumEntity.tree]: this.buildTree,
            [EnumEntity.tie]: this.buildTie,
            [EnumEntity.console]: this.buildConsole,
            [EnumEntity.in]: this.buildIn,
            [EnumEntity.out]: this.buildOut,
            [EnumEntity.ioApp]: this.buildIOApp,
            [EnumEntity.ioSite]: this.buildIOSite,
            [EnumEntity.templet]: this.buildTemplet,
            [EnumEntity.print]: this.buildPrint,
        }
        for (let group of this.groups) {
            let { entities } = group;
            for (let entitiesRow of entities) {
                let [arr] = entitiesRow;
                arr.splice(0);
            }
        }
        this.groups.splice(0);
        let { biz } = bizSchema;
        let arr: { [entity in EnumEntity]?: [Entity, any][]; } = {};
        this.entities = {};
        for (let schema of biz) {
            if (schema === undefined) debugger;
            let { id, name, phrase, type, caption } = schema;
            // console.log(name);
            let enumType = EnumEntity[type] as unknown as EnumEntity;
            let builder = builders[enumType];
            if (builder === undefined) {
                if (name === '$user' || name === '$unit') continue;
                throw new Error(`unknown biz type='${type}' name='${name}' caption='${caption}'`);
            }
            let bizEntity = builder(id, name, type);
            this.ids[id] = bizEntity;
            this.entities[name] = bizEntity;
            this.entities[id] = bizEntity;
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
                // let d = Date.now();
                bizEntity.fromSchema(schema);
                // console.log('arr', Date.now() - d, bizEntity.name);
            }
        }

        let sheets: EntitySheet[] = [];
        for (let sheet of this.sheets) {
            if (sheet.io === true) {
                this.ioSheets.push(sheet);
            }
            else {
                sheets.push(sheet);
            }
        }
        this.sheets.splice(0);
        this.sheets.push(...sheets);

        const typeSeq: EnumEntity[] = [
            EnumEntity.templet,
            EnumEntity.print,
            EnumEntity.title,
            EnumEntity.book,
            EnumEntity.assign,
            EnumEntity.options,
            EnumEntity.permit,
            EnumEntity.atom,
            EnumEntity.spec,
            EnumEntity.fork,
            EnumEntity.duo,
            EnumEntity.combo,
            EnumEntity.bin,
            EnumEntity.pend,
            EnumEntity.sheet,
            EnumEntity.query,
            EnumEntity.report,
            EnumEntity.tree,
            EnumEntity.tie,
            EnumEntity.in,
            EnumEntity.out,
        ];
        for (let i of typeSeq) {
            let entityArr = arr[i];
            if (entityArr === undefined) continue;
            for (let [bizEntity] of entityArr) {
                bizEntity.scan();
            }
        }
        this.buildAtomHierachy(arr[EnumEntity.atom]);
        /*
        let entityArrAtom = arr[EnumEntity.atom];
        if (entityArrAtom !== undefined) {
            for (let [bizEntity] of arr[EnumEntity.atom]) {
                (bizEntity as EntityAtom).scanTitlePrime();
            }
            this.atomBuilder.buildRootAtoms();
        }
        */
        this.groups.push(
            {
                name: 'sheet',
                caption: '业务流程',
                entities: [
                    [this.sheets, '业务单据', 'file'],
                    // [this.bins, '单据条', 'file-text-o'],
                    [this.pends, '待处理', 'clone'],
                ],
            },
            {
                name: 'query',
                caption: '捡取查询',
                entities: [
                    [this.queries, '捡取查询', 'hand-pointer-o'],
                ],
            },
            {
                name: 'info',
                caption: '基础数据',
                entities: [
                    [this.atoms],
                    [this.atomRoots, '基础编码', 'id-card-o'],
                    [this.forks, '细分编码', 'asterisk'],
                    [this.duos, '双合编码', 'code-fork'],
                    [this.combos, '合成编码', 'code-fork'],
                    [this.titles, '科目', 'flag-o'],
                    [this.assigns, '赋值', 'flag-o']
                ],
            },
            {
                name: 'relate',
                caption: '数据关系',
                entities: [
                    [this.picks, '捡取器', 'hand-pointer-o'],
                    [this.options, '可选项', 'check-square-o'],
                    [this.ties, '对照表', 'list'],
                    [this.trees, '层级结构', 'indent'],
                ],
            },
            {
                name: 'report',
                caption: '查询汇总',
                entities: [
                    [this.reports, '报表', 'file'],
                ],
            },
            {
                name: 'permit',
                caption: '权限',
                entities:
                    [
                        [this.roles, '许可', 'user-o'],
                    ]
            },
            {
                name: 'interface',
                caption: '接口',
                entities:
                    [
                        [this.ins, '接收', 'user-o'],
                        [this.outs, '发送', 'user-o'],
                        [this.ioSites, '外连机构', 'user-o'],
                        [this.ioApps, '外连应用', 'user-o'],
                        [this.ioSheets, '接口单据', 'file'],
                        [this.prints, '打印模板', 'file'],
                        [this.templets, '模板块', 'file'],
                    ],
            },
        );
        if (this.bizConsole !== undefined) {
            this.groups.push({
                name: 'console',
                caption: '控制台',
                entities: [[[this.bizConsole], '控制台', 'user']],
            });
        }
        let allHasEntity = false;
        for (let group of this.groups) {
            let { entities } = group;
            let hasEntity = false;
            for (let entitiesRow of entities) {
                let [arr] = entitiesRow;
                arr.sort((a, b) => {
                    const { id: aId } = a;
                    const { id: bId } = b;
                    if (aId < bId) return -1;
                    return aId === bId ? 0 : 1;
                });
                if (arr.length > 0) {
                    hasEntity = true;
                    allHasEntity = true;
                }
            }
            group.hasEntity = hasEntity;
        }
        this.hasEntity = allHasEntity;
        // this.atomBuilder = undefined;
        setAtomValue(this.atomSchemasChanged, !getAtomValue(this.atomSchemasChanged));
    }

    addBudIds(bizBud: BizBud) {
        this.ids[bizBud.id] = bizBud;
    }

    delEntity(entity: Entity) {
        // this.entities[entity.name];
        // this.ids[entity.id];
        for (let group of this.groups) {
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
        let bizEntity = new EntityFork(this, id, name, type);
        this.forks.push(bizEntity);
        return bizEntity;
    }
    private buildCombo = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityCombo(this, id, name, type);
        this.combos.push(bizEntity);
        return bizEntity;
    }
    private buildQuery = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityQuery(this, id, name, type);
        this.queries.push(bizEntity);
        return bizEntity;
    }
    private buildOptions = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityOptions(this, id, name, type);
        this.options.push(bizEntity);
        return bizEntity;
    }
    private buildRole = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityRole(this, id, name, type);
        this.roles.push(bizEntity);
        return bizEntity;
    }

    private buildTitle = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityBook(this, id, name, type);
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

    private buildTemplet = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityTemplet(this, id, name, type);
        this.templets.push(bizEntity);
        return bizEntity;
    }

    private buildPrint = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityPrint(this, id, name, type);
        this.prints.push(bizEntity);
        return bizEntity;
    }

    private buildTie = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityTie(this, id, name, type);
        this.ties.push(bizEntity);
        return bizEntity;
    }

    private buildDuo = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityDuo(this, id, name, type);
        this.duos.push(bizEntity);
        return bizEntity;
    }

    private buildConsole = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityConsole(this, id, name, type);
        this.bizConsole = bizEntity;
        return bizEntity;
    }

    private buildIn = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityIn(this, id, name, type);
        this.ins.push(bizEntity);
        return bizEntity;
    }

    private buildOut = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityOut(this, id, name, type);
        this.outs.push(bizEntity);
        return bizEntity;
    }

    private buildIOApp = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityIOApp(this, id, name, type);
        this.ioApps.push(bizEntity);
        return bizEntity;
    }

    private buildIOSite = (id: number, name: string, type: string): Entity => {
        let bizEntity = new EntityIOSite(this, id, name, type);
        this.ioSites.push(bizEntity);
        return bizEntity;
    }

    private buildAtomHierachy(entityAtomArr: [Entity, any][]) {
        if (entityAtomArr === undefined) return;
        // let rootAtoms: EntityAtom[] = [];
        // let rootHierachy: EntityAtom[] = [];
        for (let atom of this.atoms) {
            let { superClass: _extends } = atom;
            if (_extends !== undefined) continue;
            this.atomRoots.push(atom);
            atom.hierarchy();
        }
        /*
        // let entityArrAtom = arr[EnumEntity.atom];
        for (let [bizEntity] of entityAtomArr) {
            (bizEntity as EntityAtom).scanTitlePrime();
        }
        this.atomBuilder.buildRootAtoms();
        */
    }

    async loadUserDefaults() {
        if (this.userDefaults === undefined) {
            let { buds } = await this.uq.GetUserBuds.query({ userId: undefined });
            this.userDefaults = {};
            for (let { bud, value } of buds) {
                this.userDefaults[bud] = JSON.parse(value);
            }
        }
    }
}
