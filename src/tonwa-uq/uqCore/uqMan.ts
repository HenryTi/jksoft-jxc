/* eslint-disable */
import { UqApi, UqData } from '../net';
import { Tuid, TuidDiv, TuidImport, TuidInner, TuidBox, TuidsCache } from './tuid';
import { Action } from './action';
import { Sheet } from './sheet';
import { Query } from './query';
import { Book } from './book';
import { History } from './history';
import { Map } from './map';
import { Pending } from './pending';
import { capitalCase, LocalCache, LocalMap, UqConfig } from '../tool';
import { UqEnum } from './enum';
import { Entity } from './entity';
import { ID, IX, IDX } from './ID';
import { Net } from '../net';

export type FieldType = 'id' | 'tinyint' | 'smallint' | 'int' | 'bigint' | 'dec' | 'float' | 'double' | 'char' | 'text'
    | 'datetime' | 'date' | 'time' | 'timestamp' | 'enum';

export function fieldDefaultValue(type: FieldType) {
    switch (type) {
        case 'tinyint':
        case 'smallint':
        case 'int':
        case 'bigint':
        case 'dec':
        case 'float':
        case 'double':
        case 'enum':
            return 0;
        case 'char':
        case 'text':
            return '';
        case 'datetime':
        case 'date':
            return '2000-1-1';
        case 'time':
            return '0:00';
    }
}

export interface Field {
    name: string;
    type: FieldType;
    tuid?: string;
    arr?: string;
    null?: boolean;
    size?: number;
    owner?: string;
    _tuid?: TuidBox;
}
export interface ArrFields {
    name: string;
    fields: Field[];
    id?: string;
    order?: string;
}
export interface FieldMap {
    [name: string]: Field;
}
export interface SchemaFrom {
    owner: string;
    uq: string;
}
export interface TuidModify {
    max: number;
    seconds: number;
}

interface ParamPage {
    start: number;
    size: number;
}

export interface ParamActIX<T> {
    IX: IX;
    ID?: ID;
    IXs?: { IX: IX, ix: number }[];				// 一次写入多个IX
    values: { ix: number | T, xi: number | T }[];
}

export interface ParamActIXSort {
    IX: IX;
    ix: number;
    id: number;					// id to be moved
    after: number;				// insert after id. if before first, then 0
}

export interface ParamActID {
    ID: ID;
    value: object;
    IX?: IX[];
    ix?: (number | object)[];
}

export interface ParamActDetail<M, D> {
    main: {
        ID: ID;
        value: M;
    };
    detail: {
        ID: ID;
        values: D[];
    };
}

export interface RetActDetail {
    main: number;
    detail: number[];
}

export interface ParamActDetail2<M, D, D2> extends ParamActDetail<M, D> {
    detail2: {
        ID: ID;
        values: D2[];
    };
}

export interface RetActDetail2 extends RetActDetail {
    detail2: number[];
}

export interface ParamActDetail3<M, D, D2, D3> extends ParamActDetail2<M, D, D2> {
    detail3: {
        ID: ID;
        values: D3[];
    };
}

export interface RetActDetail3 extends RetActDetail2 {
    detail3: number[];
}

export interface ParamQueryID {
    ID?: ID;
    IX?: (IX | string)[];
    IDX?: (ID | IDX)[];
    id?: number | number[];
    key?: { [key: string]: string | number };
    ix?: number;
    idx?: number | number[];
    keyx?: { [key: string]: string | number };
    page?: ParamPage;
    order?: 'desc' | 'asc';
}

export interface ParamIDNO {
    ID: ID;
    stamp?: undefined,
}

export interface ParamIDDetailGet {
    id: number;
    main: ID;
    detail: ID;
    detail2?: ID;
    detail3?: ID;
}

export interface ParamID {
    IDX: (ID | IDX) | (ID | IDX)[];
    id: number | number[];
    order?: 'asc' | 'desc',
    page?: ParamPage;
}

export interface ParamKeyID {
    ID: ID;
    IDX?: (ID | IDX)[];
    IX?: IX[];
    key: { [key: string]: string | number };
    ix?: number;
    page?: ParamPage;
}

export interface ParamIX {
    IX: IX;
    IX1?: IX;
    ix: number | number[];
    IDX?: (ID | IDX)[];
    page?: ParamPage;
    order?: 'asc' | 'desc';
}

export interface ParamIXValues {
    IX: IX;
    ix?: number;
    page?: ParamPage;
    order?: 'asc' | 'desc';
}

export interface ParamKeyIX {
    ID: ID;
    key: { [key: string]: string | number };
    IX: IX;
    IDX?: (ID | IDX)[];
    page?: ParamPage;
}

export interface ParamIDLog {
    IDX: (ID | IDX);
    field: string;
    id: number;
    log: 'each' | 'day' | 'week' | 'month' | 'year';
    timeZone?: number;
    far?: number;
    near?: number;
    page: ParamPage;
}

export interface ParamIDSum {
    IDX: IDX;
    field: string[];
    id: number | number[];
    far?: number;				// 以前
    near?: number;				// 最近
}

export interface ParamIDxID {
    ID: ID;
    IX: IX;
    ID2: ID;
    page?: ParamPage;
}

export interface IDXValue {
    value: number;
    time?: number | Date;
    setAdd: '=' | '+';
}

export interface ParamIDinIX {
    ID: ID;
    id: number;
    IX: IX;
    page?: ParamPage;
}

export interface ParamIDTree {
    ID: ID;
    parent: number;
    key: string | number;
    level?: number;				// 无值，默认1一级
    page?: ParamPage;
}

function IDPath(path: string): string { return path; }
enum EnumResultType { data, sql };

export interface Uq {
    $: UqMan;
    // $name: string;
    // $setUnit(unit: number): void;
    Role: { [key: string]: string[] };
    idObj<T = any>(id: number): Promise<T>;
    idJoins(id: number): Promise<{ ID: ID; main: [string, any]; joins: [string, any[]][]; }>;
    idCache<T = any>(id: number): T;
    IDValue<T>(type: string, value: string): T;
    Biz(id: number, act: string): Promise<void>;
    BizSheetAct(id: number, detail: string, act: string): Promise<any[]>;
    Acts(param: any): Promise<any>;
    ActIX<T>(param: ParamActIX<T>): Promise<number[]>;
    ActIXSort(param: ParamActIXSort): Promise<void>;
    ActIDProp(ID: ID, id: number, name: string, value: any): Promise<void>;
    ActID(param: ParamActID): Promise<number>;
    QueryID<T>(param: ParamQueryID): Promise<T[]>;
    IDNO(param: ParamIDNO): Promise<string>;
    IDEntity(typeId: number): ID;
    IDFromName(IDName: string): ID;
    ID<T = any>(param: ParamID): Promise<T[]>;
    IXr<T>(param: ParamIX): Promise<T[]>; // IX id 反查IX list
    KeyID<T>(param: ParamKeyID): Promise<T[]>;
    IX<T = any>(param: ParamIX): Promise<T[]>;
    IXValues(param: ParamIXValues): Promise<{ type: string, value: string }[]>;
    KeyIX<T>(param: ParamKeyIX): Promise<T[]>;
    IDxID<T, T2>(param: ParamIDxID): Promise<[T[], T2[]]>; // ID list with IX 对应的子集
    IDinIX<T>(param: ParamIDinIX): Promise<T & { $in: boolean }[]>;

    IDTv(ids: number[]): Promise<any[]>;

    IDTree<T>(param: ParamIDTree): Promise<T[]>;
    IDLog<T>(param: ParamIDLog): Promise<T[]>;
    IDSum<T>(param: ParamIDSum): Promise<T[]>;
    IDDetailGet<M, D>(param: ParamIDDetailGet): Promise<[M[], D[]]>;
    IDDetailGet<M, D, D2>(param: ParamIDDetailGet): Promise<[M[], D[], D2[]]>;
    IDDetailGet<M, D, D2, D3>(param: ParamIDDetailGet): Promise<[M[], D[], D2[], D3[]]>;
    ActDetail<M, D>(param: ParamActDetail<M, D>): Promise<RetActDetail>;
    ActDetail<M, D, D2>(param: ParamActDetail2<M, D, D2>): Promise<RetActDetail2>;
    ActDetail<M, D, D2, D3>(param: ParamActDetail3<M, D, D2, D3>): Promise<RetActDetail3>;

    AdminGetList(): Promise<any[]>;
    AdminSetMe(): Promise<void>;
    AdminSet(user: number, role: number, assigned: string): Promise<void>;
    AdminIsMe(): Promise<boolean>;
}

export class UqMan {
    readonly entities: { [name: string]: Entity } = {};
    readonly entityTypes: { [id: number]: Entity } = {};
    private readonly enums: { [name: string]: UqEnum } = {};
    private readonly actions: { [name: string]: Action } = {};
    private readonly queries: { [name: string]: Query } = {};
    readonly ids: { [name: string]: ID } = {};
    private readonly idxs: { [name: string]: IDX } = {};
    private readonly ixs: { [name: string]: IX } = {};

    private readonly sheets: { [name: string]: Sheet } = {};
    private readonly books: { [name: string]: Book } = {};
    private readonly maps: { [name: string]: Map } = {};
    private readonly histories: { [name: string]: History } = {};
    private readonly pendings: { [name: string]: Pending } = {};
    private readonly tuidsCache: TuidsCache;
    private readonly localEntities: LocalCache;
    readonly localMap: LocalMap;
    readonly localModifyMax: LocalCache;
    readonly tuids: { [name: string]: Tuid } = {};
    readonly newVersion: boolean;
    readonly uqOwner: string;
    readonly uqName: string;
    readonly uqSchema: any;
    readonly name: string;
    readonly id: number;
    readonly net: Net;
    readonly uqApi: UqApi;
    readonly baseUrl = 'tv/';
    unit: number;
    proxy: any;
    $proxy: any;

    uqVersion: number;
    config: UqConfig;

    constructor(net: Net, uqData: UqData, uqSchema: any) {
        this.net = net;
        this.unit = 0;
        let { id, uqOwner, uqName, newVersion } = uqData;
        this.newVersion = newVersion;
        this.uqOwner = uqOwner;
        this.uqName = uqName;
        this.uqSchema = uqSchema;
        this.id = id;
        this.name = uqOwner + '/' + uqName;
        this.uqVersion = 0;
        this.localMap = net.createLocalMap(this.name);
        this.localModifyMax = this.localMap.child('$modifyMax');
        this.localEntities = this.localMap.child('$access');
        this.tuidsCache = new TuidsCache(this);
        this.uqApi = new UqApi(this); // this.net, baseUrl, this.name /* this.uqOwner, this.uqName */);
    }

    getID(name: string): ID { return this.ids[name.toLowerCase()]; };
    getIDX(name: string): IDX { return this.idxs[name.toLowerCase()]; };
    getIX(name: string): IX { return this.ixs[name.toLowerCase()]; };

    clearLocalEntites() {
        this.localMap.removeItem(this.name);
    }

    private roles: string[];
    async getRoles(): Promise<string[]> {
        if (this.roles !== undefined) return this.roles;
        this.roles = await this.uqApi.getRoles();
        return this.roles;
    }

    tuid(name: string): Tuid { return this.tuids[name.toLowerCase()] }
    tuidDiv(name: string, div: string): TuidDiv {
        let tuid = this.tuids[name.toLowerCase()]
        return tuid && tuid.div(div.toLowerCase());
    }
    action(name: string): Action { return this.actions[name.toLowerCase()] }
    sheet(name: string): Sheet { return this.sheets[name.toLowerCase()] }
    query(name: string): Query { return this.queries[name.toLowerCase()] }
    book(name: string): Book { return this.books[name.toLowerCase()] }
    map(name: string): Map { return this.maps[name.toLowerCase()] }
    history(name: string): History { return this.histories[name.toLowerCase()] }
    pending(name: string): Pending { return this.pendings[name.toLowerCase()] }

    sheetFromTypeId(typeId: number): Sheet {
        for (let i in this.sheets) {
            let sheet = this.sheets[i];
            if (sheet.typeId === typeId) return sheet;
        }
    }

    Role: { [key: string]: string[] };
    readonly tuidArr: Tuid[] = [];
    readonly actionArr: Action[] = [];
    readonly queryArr: Query[] = [];
    readonly idArr: ID[] = [];
    readonly idxArr: IDX[] = [];
    readonly ixArr: IX[] = [];
    readonly enumArr: UqEnum[] = [];
    readonly sheetArr: Sheet[] = [];
    readonly bookArr: Book[] = [];
    readonly mapArr: Map[] = [];
    readonly historyArr: History[] = [];
    readonly pendingArr: Pending[] = [];

    /*
    async loadEntities(): Promise<string> {
        try {
            let entities = this.localEntities.get();
            if (!entities) {
                entities = await this.uqApi.loadEntities();
            }
            if (!entities) return;
            this.buildEntities(entities);
            return undefined;
        }
        catch (err) {
            return err as any;
        }
    }
    */

    buildEntities(/*entities: any*/) {
        // this.localEntities.set(entities);
        // let { access, tuids, role, version, ids } = entities;
        // this.uqVersion = version;
        /*
        this.Role = this.buildRole(role?.names);
        this.buildTuids(tuids);
        this.buildIds(ids);
        this.buildAccess(access);
        */
        this.buildEntityFromUqSchema();
    }

    private buildEntityFromUqSchema() {
        for (let i in this.uqSchema) {
            let schema = this.uqSchema[i];
            let { name, type } = schema;
            if (name === undefined || type === undefined) continue;
            let entity = this.fromType(name, type);
            if (entity === undefined) continue;
            entity.buildSchema(schema);
        }
    }

    private buildRole(roleNames: { [key: string]: string[] }) {
        if (roleNames === undefined) return;
        let ret: { [key: string]: string[] } = {};
        for (let i in roleNames) {
            let items = roleNames[i];
            if (i !== '$') {
                items = items.map(v => `${i}.${v}`);
            }
            ret[i] = items;
        }
        return ret;
    }

    private buildTuids(tuids: any) {
        for (let i in tuids) {
            let schema = tuids[i];
            let { typeId, from } = schema;
            let tuid = this.newTuid(i, typeId, from);
            tuid.sys = true;
        }
        for (let i in tuids) {
            let schema = tuids[i];
            let tuid = this.getTuid(i);
            tuid.setSchema(schema);
        }
        for (let i in this.tuids) {
            let tuid = this.tuids[i];
            tuid.buildFieldsTuid();
        }
    }

    private buildIds(ids: any) {
        for (let i in ids) {
            let schema = ids[i];
            let { typeId } = schema;
            let ID = this.newID(i, typeId);
            ID.setSchema(schema);
        }
    }

    async loadEntitySchema(entityName: string): Promise<any> {
        return await this.uqApi.schema(entityName);
    }

    async loadAllSchemas(): Promise<void> {
        let ret = await this.uqApi.allSchemas();
        let entities: Entity[][] = [
            this.actionArr,
            this.enumArr,
            this.sheetArr,
            this.queryArr,
            this.bookArr,
            this.mapArr,
            this.historyArr,
            this.pendingArr,
            this.idArr,
            this.idxArr,
            this.ixArr,
        ];
        entities.forEach(arr => {
            arr.forEach(v => {
                let entity = ret[v.name.toLowerCase()];
                if (!entity) return;
                let schema = entity.call;
                if (!schema) return;
                v.buildSchema(schema);
            });
        });
    }

    getTuid(name: string): Tuid {
        return this.tuids[name];
    }

    private buildAccess(access: any) {
        for (let a in access) {
            let v = access[a];
            switch (typeof v) {
                case 'string': this.fromType(a, v); break;
                case 'object': this.fromObj(a, v); break;
            }
        }
    }

    cacheTuids(defer: number) {
        this.tuidsCache.cacheTuids(defer);
    }

    private setEntity(name: string, entity: Entity) {
        this.entities[name] = entity;
        this.entities[name.toLowerCase()] = entity;
        this.entityTypes[entity.typeId] = entity;
    }

    newEnum(name: string, id: number): UqEnum {
        let enm = this.enums[name];
        if (enm !== undefined) return enm;
        enm = this.enums[name] = new UqEnum(this, name, id);
        this.setEntity(name, enm);
        this.enumArr.push(enm);
        return enm;
    }
    newAction(name: string, id: number): Action {
        let action = this.actions[name];
        if (action !== undefined) return action;
        action = this.actions[name] = new Action(this, name, id);
        this.setEntity(name, action);
        this.actionArr.push(action);
        return action;
    }
    private newTuid(name: string, id: number, from: SchemaFrom): Tuid {
        let tuid = this.tuids[name];
        if (tuid !== undefined) return tuid;
        if (from !== undefined)
            tuid = new TuidImport(this, name, id, from);
        else
            tuid = new TuidInner(this, name, id);
        this.tuids[name] = tuid;
        this.setEntity(name, tuid);
        this.tuidArr.push(tuid);
        return tuid;
    }
    newQuery(name: string, id: number): Query {
        let query = this.queries[name];
        if (query !== undefined) return query;
        query = this.queries[name] = new Query(this, name, id)
        this.setEntity(name, query);
        this.queryArr.push(query);
        return query;
    }
    private newBook(name: string, id: number): Book {
        let book = this.books[name];
        if (book !== undefined) return book;
        book = this.books[name] = new Book(this, name, id);
        this.setEntity(name, book);
        this.bookArr.push(book);
        return book;
    }
    private newMap(name: string, id: number): Map {
        let map = this.maps[name];
        if (map !== undefined) return map;
        map = this.maps[name] = new Map(this, name, id)
        this.setEntity(name, map);
        this.mapArr.push(map);
        return map;
    }
    private newHistory(name: string, id: number): History {
        let history = this.histories[name];
        if (history !== undefined) return;
        history = this.histories[name] = new History(this, name, id)
        this.setEntity(name, history);
        this.historyArr.push(history);
        return history;
    }
    private newPending(name: string, id: number): Pending {
        let pending = this.pendings[name];
        if (pending !== undefined) return;
        pending = this.pendings[name] = new Pending(this, name, id)
        this.setEntity(name, pending);
        this.pendingArr.push(pending);
        return pending;
    }
    private newSheet(name: string, id: number): Sheet {
        let sheet = this.sheets[name];
        if (sheet !== undefined) return sheet;
        sheet = this.sheets[name] = new Sheet(this, name, id);
        this.setEntity(name, sheet);
        this.sheetArr.push(sheet);
        return sheet;
    }
    private newID(name: string, id: number): ID {
        let lName = name.toLowerCase();
        let idEntity = this.ids[lName];
        if (idEntity !== undefined) return idEntity;
        idEntity = this.ids[lName] = new ID(this, name, id);
        this.setEntity(name, idEntity);
        this.idArr.push(idEntity);
        return idEntity;
    }
    private newIDX(name: string, id: number): IDX {
        let lName = name.toLowerCase();
        let idx = this.idxs[lName];
        if (idx !== undefined) return idx;
        idx = this.idxs[lName] = new IDX(this, name, id);
        this.setEntity(name, idx);
        this.idxArr.push(idx);
        return idx;
    }
    private newIX(name: string, id: number): IX {
        let lName = name.toLowerCase();
        let ix = this.ixs[lName];
        if (ix !== undefined) return ix;
        ix = this.ixs[lName] = new IX(this, name, id);
        this.setEntity(name, ix);
        this.ixArr.push(ix);
        return ix;
    }
    private fromType(name: string, type: string): Entity {
        let arr = type.split('|');
        type = arr[0];
        let id = Number(arr[1]);
        switch (type) {
            default:
                break;
            //case 'uq': this.id = id; break;
            case 'tuid':
                // Tuid should not be created here!;
                //let tuid = this.newTuid(name, id);
                //tuid.sys = false;
                break;
            case 'id': return this.newID(name, id);
            case 'idx': return this.newIDX(name, id);
            case 'ix': return this.newIX(name, id);
            case 'action': return this.newAction(name, id);
            case 'query': return this.newQuery(name, id);
            case 'book': return this.newBook(name, id);
            case 'map': return this.newMap(name, id);
            case 'history': return this.newHistory(name, id);
            case 'sheet': return this.newSheet(name, id);
            case 'pending': return this.newPending(name, id);
            case 'enum': return this.newEnum(name, id);
        }
    }
    private fromObj(name: string, obj: any) {
        switch (obj['$']) {
            case 'sheet': this.buildSheet(name, obj); break;
        }
    }
    private buildSheet(name: string, obj: any) {
        let sheet = this.sheets[name];
        if (sheet === undefined) sheet = this.newSheet(name, obj.id);
        sheet.build(obj);
    }
    buildFieldTuid(fields: Field[], mainFields?: Field[]) {
        if (fields === undefined) return;
        for (let f of fields) {
            let { tuid } = f;
            if (tuid === undefined) continue;
            let t = this.getTuid(tuid);
            if (t === undefined) continue;
            f._tuid = t.buildTuidBox();
        }
        for (let f of fields) {
            let { owner } = f;
            if (owner === undefined) continue;
            let ownerField = fields.find(v => v.name === owner);
            if (ownerField === undefined) {
                if (mainFields !== undefined) {
                    ownerField = mainFields.find(v => v.name === owner);
                }
                if (ownerField === undefined) {
                    debugger;
                    throw new Error(`owner field ${owner} is undefined`);
                }
            }
            let { arr, tuid } = f;
            let t = this.getTuid(ownerField._tuid.tuid.name);
            if (t === undefined) continue;
            let div = t.div(arr || tuid);
            f._tuid = div && div.buildTuidDivBox(ownerField);
        }
    }
    buildArrFieldsTuid(arrFields: ArrFields[], mainFields: Field[]) {
        if (arrFields === undefined) return;
        for (let af of arrFields) {
            let { fields } = af;
            if (fields === undefined) continue;
            this.buildFieldTuid(fields, mainFields);
        }
    }

    pullModify(modifyMax: number) {
        this.tuidsCache.pullModify(modifyMax);
    }

    getUqKey() {
        let uqKey: string = this.uqName.split(/[-._]/).join('').toLowerCase();
        return uqKey;
    }

    getUqKeyWithConfig() {
        if (!this.config) return;
        let uqKey: string = this.uqName.split(/[-._]/).join('').toLowerCase();
        let { dev, alias } = this.config;
        uqKey = capitalCase(dev.alias || dev.name) + capitalCase(alias ?? uqKey);
        return uqKey;
    }

    hasEntity(name: string): boolean {
        return this.entities[name] !== undefined
            || this.entities[name.toLowerCase()] !== undefined;
    }

    private async apiPost(api: string, resultType: EnumResultType, apiParam: any): Promise<any> {
        if (resultType === EnumResultType.sql) api = 'sql-' + api;
        let ret = await this.uqApi.post(IDPath(api), apiParam);
        return ret;
    }

    private async apiActs(param: any, resultType: EnumResultType): Promise<any> {
        // 这边的obj属性序列，也许会不一样
        let arr: string[] = [];
        let apiParam: any = {};
        for (let i in param) {
            arr.push(i);
            apiParam[i] = (param[i] as any[]).map(v => this.buildValue(v));
        }
        apiParam['$'] = arr;
        let ret = await this.apiPost('acts', resultType, apiParam);
        return ret;
    }

    private buildValue(v: any) {
        if (!v) return v;
        let obj: any = {};
        for (let j in v) {
            let val = v[j];
            if (j === 'ID') {
                switch (typeof val) {
                    case 'object': val = val.name; break;
                }
            }
            else if (j === 'time') {
                if (val) {
                    if (Object.prototype.toString.call(val) === '[object Date]') {
                        val = (val as Date).getTime();
                    }
                }
            }
            else if (typeof val === 'object') {
                let id = val['id'];
                if (id === undefined) {
                    val = this.buildValue(val);
                }
                else {
                    val = id;
                }
            }
            obj[j] = val;
        }
        return obj;
    }

    protected Biz = async (id: number, act: string): Promise<void> => {
        await this.uqApi.bizSheet(id, act);
    }
    protected BizSheetAct = async (id: number, detail: string, act: string): Promise<any[]> => {
        let ret = await this.uqApi.bizSheetAct(id, detail, act);
        return ret;
    }
    protected Acts = async (param: any): Promise<any> => {
        //let apiParam = this.ActsApiParam(param);
        let ret = await this.apiActs(param, EnumResultType.data); // await this.apiPost('acts', apiParam);
        let retArr = (ret[0].ret as string).split('\n');
        let arr: string[] = [];
        for (let i in param) arr.push(i);
        let retActs: { [key: string]: number[] } = {};
        for (let i = 0; i < arr.length; i++) {
            retActs[arr[i]] = ids(retArr[i].split('\t'));
        }
        return retActs;
    }

    protected AdminGetList = async (): Promise<any[]> => {
        return await this.uqApi.getAdmins();
    }

    protected AdminSetMe = async (): Promise<void> => {
        return await this.uqApi.setMeAdmin();
    }

    protected AdminSet = async (user: number, role: number, assigned: string): Promise<void> => {
        return await this.uqApi.setAdmin(user, role, assigned);
    }

    protected AdminIsMe = async (): Promise<boolean> => {
        return await this.uqApi.isAdmin();
    }

    protected IDValue = (type: string, value: string): object => {
        if (!type) return;
        let ID = this.ids[type.toLowerCase()];
        if (ID === undefined) return;
        return ID.valueFromString(value)
    };

    protected $Acts = async (param: any): Promise<any> => {
        return await this.apiActs(param, EnumResultType.sql);
    }

    private async apiActIX(param: any, resultType: EnumResultType): Promise<any> {
        let { IX, ID, values, IXs } = param;
        let apiParam: any = {
            IX: entityName(IX),
            ID: entityName(ID),
            IXs: IXs?.map((v: any) => ({ IX: entityName(v.IX), ix: v.ix })),
            values: values?.map((v: any) => this.buildValue(v)),
        };
        let ret = await this.apiPost('act-ix', resultType, apiParam);
        return ret;
    }

    protected ActIX = async (param: ParamActIX<any>): Promise<number[]> => {
        let result = await this.apiActIX(param, EnumResultType.data);
        let str: string = result[0].ret as string;
        let arr = str.trim().split('\t');
        let ret = arr.map(v => Number(v));
        return ret;
    }

    protected $ActIX = async (param: ParamActIX<any>): Promise<string> => {
        let ret = await this.apiActIX(param, EnumResultType.sql);
        return ret;
    }

    private async apiActIxSort(param: ParamActIXSort, resultType: EnumResultType): Promise<any> {
        let { IX, ix, id, after } = param;
        let apiParam: any = {
            IX: entityName(IX),
            ix,
            id,
            after,
        };
        return await this.apiPost('act-ix-sort', resultType, apiParam);
    }

    protected ActIXSort = async (param: ParamActIXSort): Promise<void> => {
        return await this.apiActIxSort(param, EnumResultType.data);
    }

    protected $ActIXSort = async (param: ParamActIXSort): Promise<string> => {
        return await this.apiActIxSort(param, EnumResultType.sql);
    }

    protected ActIDProp = async (ID: ID, id: number, name: string, value: any) => {
        await this.uqApi.post('act-id-prop', { ID: ID.name, id, name, value });
    }

    protected ActID = async (param: ParamActID): Promise<number> => {
        let ret = await this.apiActID(param, EnumResultType.data);
        let r = (ret[0].ret as string).split('\t').map(v => Number(v))[0];
        if (isNaN(r) === true) return undefined;
        return r;
    }

    protected $ActID = async (param: ParamActID): Promise<string> => {
        let ret = await this.apiActID(param, EnumResultType.sql);
        return ret;
    }

    private async apiActID(param: ParamActID, resultType: EnumResultType): Promise<any> {
        let { ID, value, IX, ix } = param;
        let apiParam: any = {
            ID: entityName(ID),
            value: this.buildValue(value),
            IX: IX?.map(v => entityName(v)),
            ix: ix?.map(v => this.buildValue(v)),
        };
        return await this.apiPost('act-id', resultType, apiParam);
    }

    private async apiActDetail(param: ParamActDetail<any, any>, resultType: EnumResultType): Promise<any> {
        let { main, detail, detail2, detail3 } = param as unknown as ParamActDetail3<any, any, any, any>;
        let postParam: any = {
            main: {
                name: entityName(main.ID),
                value: toScalars(main.value),
            },
            detail: {
                name: entityName(detail.ID),
                values: detail.values?.map(v => toScalars(v)),
            },
        }
        if (detail2) {
            postParam.detail2 = {
                name: entityName(detail2.ID),
                values: detail2.values?.map(v => toScalars(v)),
            }
        }
        if (detail3) {
            postParam.detail3 = {
                name: entityName(detail3.ID),
                values: detail3.values?.map(v => toScalars(v)),
            }
        }
        let ret = await this.apiPost('act-detail', resultType, postParam);
    }

    protected ActDetail = async (param: ParamActDetail<any, any>) => {
        let ret = await this.apiActDetail(param, EnumResultType.data);
        let val: string = ret[0].ret;
        let arr = val.split('\n');
        let items = arr.map(v => v.split('\t'));
        ret = {
            main: ids(items[0])[0],
            detail: ids(items[1]),
            detail2: ids(items[2]),
            detail3: ids(items[3]),
        };
        return ret;
    }

    protected $ActDetail = async (param: ParamActDetail<any, any>) => {
        return await this.apiActDetail(param, EnumResultType.sql);
    }

    private async apiQueryID(param: ParamQueryID, resultType: EnumResultType): Promise<any[]> {
        let { ID, IX, IDX } = param;
        if (!IDX) {
            IDX = [ID];
        }
        let ret = await this.apiPost('query-id', resultType, {
            ...param,
            ID: entityName(ID),
            IX: IX?.map(v => entityName(v)),
            IDX: this.IDXToString(IDX),
        });
        return ret;
    }

    protected QueryID = async (param: ParamQueryID) => {
        return await this.apiQueryID(param, EnumResultType.data);
    }

    protected $QueryID = async (param: ParamQueryID) => {
        return await this.apiQueryID(param, EnumResultType.sql);
    }

    private async apiIDTv(ids: number[], resultType: EnumResultType): Promise<any[]> {
        let ret = await this.apiPost('id-tv', resultType, ids);
        return ret;
    }

    async syncUser(user: number) {
        return await this.uqApi.syncUser(user);
    }

    IDTv = async (ids: number[]): Promise<any[]> => {
        let ret = await this.apiIDTv(ids, EnumResultType.data);
        let retValues: any[] = [];
        for (let row of ret) {
            let { $type, $tv } = row;
            if (!$tv) continue;
            let ID = this.ids[$type];
            if (!ID) continue;
            let { schema } = ID;
            if (!schema) {
                await ID.loadSchema();
                schema = ID.schema;
            }
            let { nameNoVice } = schema;
            if (!nameNoVice) continue;
            let values = ($tv as string).split('\n');
            let len = nameNoVice.length;
            for (let i = 0; i < len; i++) {
                let p = nameNoVice[i];
                row[p] = values[i];
            }
            delete row.$tv;
            retValues.push(row);
        }
        return retValues;
    }

    protected $IDTv = async (ids: number[]): Promise<any> => {
        return await this.apiIDTv(ids, EnumResultType.sql);
    }

    private async apiIDNO(param: ParamIDNO, resultType: EnumResultType): Promise<{ no: string }[]> {
        let { ID, stamp } = param;
        let ret = await this.apiPost('id-no', resultType, { ID: entityName(ID), stamp });
        return ret;
    }

    protected IDNO = async (param: ParamIDNO): Promise<string> => {
        let ret = await this.apiIDNO(param, EnumResultType.data);
        return (ret[0] as any)?.no;
    }

    protected IDEntity = (typeId: number): ID => {
        return this.entityTypes[typeId] as ID;
    };

    protected IDFromName = (IDName: string): ID => {
        return this.ids[IDName];
    }

    protected $IDNO = async (param: ParamIDNO): Promise<string> => {
        return await this.apiIDNO(param, EnumResultType.sql) as any as string;
    }

    private async apiIDDetailGet(param: ParamIDDetailGet, resultType: EnumResultType): Promise<any> {
        let { id, main, detail, detail2, detail3 } = param;
        let ret = await this.apiPost('id-detail-get', resultType, {
            id,
            main: entityName(main),
            detail: entityName(detail),
            detail2: entityName(detail2),
            detail3: entityName(detail3),
        });
        return ret;
    }

    IDDetailGet = async (param: ParamIDDetailGet): Promise<any> => {
        return await this.apiIDDetailGet(param, EnumResultType.data);
    }

    protected $IDDetailGet = async (param: ParamIDDetailGet): Promise<any> => {
        return await this.apiIDDetailGet(param, EnumResultType.sql);
    }

    private IDXToString(p: ID | IDX | ((ID | IDX)[])): string | string[] {
        if (Array.isArray(p) === true) return (p as (ID | IDX)[]).map(v => entityName(v));
        return entityName(p as ID | IDX);
    }
    private async apiID(param: ParamID, resultType: EnumResultType): Promise<any> {
        let { IDX } = param;
        let nParam = {
            ...param,
            IDX: this.IDXToString(IDX),
        }
        let ret = await this.apiPost('id', resultType, nParam);
        return ret;
    }

    private cache: { [id: number]: object } = {};
    private cachePromise: { [id: number]: Promise<any> } = {};
    protected idCache = (id: number) => {
        let ret = this.cache[id];
        return ret;
    }
    // 返回可能是数组
    protected idObj = async (id: number) => {
        let obj = this.cache[id];
        if (obj === undefined) {
            let promise = this.cachePromise[id];
            if (promise === undefined) {
                promise = this.apiID(({ id, IDX: undefined }), EnumResultType.data);
                this.cachePromise[id] = promise;
            }
            let ret = await promise;
            if (ret !== undefined) {
                obj = ret[0];
                this.cache[id] = (obj === undefined) ? null : obj;
                let len = ret.length;
                for (let i = 1; i < len; i++) {
                    let objEx = ret[i];
                    let { id: idEx } = objEx === undefined ? null : objEx;
                    this.cache[idEx] = objEx;
                }
            }
            else {
                this.cache[id] = null;
            }
            delete this.cachePromise[id];
        }
        return obj;
    }

    protected idJoins = async (id: number) => {
        let ret = await this.apiPost('id-joins', EnumResultType.data, { id });
        let arr = (ret as any[]).shift();
        let resultMain = arr?.[0];
        if (resultMain === undefined) {
            throw new Error('id-joins return no value');
        }
        let { ID: IDName } = resultMain;
        let ID = this.IDFromName(IDName);
        let resultJoins = ret;
        let [uppackedMain, uppackedJoins] = ID.unpackJoins(resultMain, resultJoins);
        return { ID, main: uppackedMain, joins: uppackedJoins };
    }

    protected ID = async (param: ParamID): Promise<any[]> => {
        return await this.apiID(param, EnumResultType.data);
    }
    protected $ID = async (param: ParamID): Promise<string> => {
        return await this.apiID(param, EnumResultType.sql);
    }

    private async apiKeyID(param: ParamKeyID, resultType: EnumResultType): Promise<any> {
        let { ID, IDX } = param;
        let ret = await this.apiPost('key-id', resultType, {
            ...param,
            ID: entityName(ID),
            IDX: IDX?.map(v => entityName(v)),
        });
        return ret;
    }
    protected KeyID = async (param: ParamKeyID): Promise<any[]> => {
        return await this.apiKeyID(param, EnumResultType.data);
    }
    protected $KeyID = async (param: ParamKeyID): Promise<string> => {
        return await this.apiKeyID(param, EnumResultType.sql);
    }

    private async apiIX(param: ParamIX, resultType: EnumResultType): Promise<any> {
        let { IX, IX1, IDX } = param;
        //this.checkParam(null, IDX, IX, id, null, page);
        let ret = await this.apiPost('ix', resultType, {
            ...param,
            IX: entityName(IX),
            IX1: entityName(IX1),
            IDX: IDX?.map(v => entityName(v)),
        });
        return ret;
    }
    protected IX = async (param: ParamIX): Promise<any[]> => {
        return await this.apiIX(param, EnumResultType.data);
    }
    protected $IX = async (param: ParamIX): Promise<string> => {
        return await this.apiIX(param, EnumResultType.sql);
    }

    private async apiIXValues(param: ParamIXValues, resultType: EnumResultType): Promise<any> {
        let { IX } = param;
        let ret = await this.apiPost('ix-values', resultType, {
            ...param,
            IX: entityName(IX),
        });
        return ret;
    }
    protected IXValues = async (param: ParamIXValues): Promise<any[]> => {
        return await this.apiIXValues(param, EnumResultType.data);
    }

    private async apiIXr(param: ParamIX, resultType: EnumResultType): Promise<any> {
        let { IX, IX1, IDX } = param;
        //this.checkParam(null, IDX, IX, id, null, page);
        let ret = await this.apiPost('ixr', resultType, {
            ...param,
            IX: entityName(IX),
            IX1: entityName(IX1),
            IDX: IDX?.map(v => entityName(v)),
        });
        return ret;
    }
    protected IXr = async (param: ParamIX): Promise<any[]> => {
        return await this.apiIXr(param, EnumResultType.data);
    }
    protected $IXr = async (param: ParamIX): Promise<any[]> => {
        return await this.apiIXr(param, EnumResultType.sql);
    }

    private async apiKeyIX(param: ParamKeyIX, resultType: EnumResultType): Promise<any> {
        let { ID, IX, IDX } = param;
        //this.checkParam(ID, IDX, IX, null, key, page);
        let ret = await this.apiPost('key-ix', resultType, {
            ...param,
            ID: entityName(ID),
            IX: entityName(IX),
            IDX: IDX?.map(v => entityName(v)),
        });
        return ret;
    }
    protected KeyIX = async (param: ParamKeyIX): Promise<any[]> => {
        return await this.apiKeyIX(param, EnumResultType.data);
    }
    protected $KeyIX = async (param: ParamKeyIX): Promise<any[]> => {
        return await this.apiKeyIX(param, EnumResultType.sql);
    }

    private async apiIDLog(param: ParamIDLog, resultType: EnumResultType): Promise<any> {
        let { IDX } = param;
        //this.checkParam(null, IDX, null, id, null, page);
        let ret = await this.apiPost('id-log', resultType, {
            ...param,
            IDX: entityName(IDX),
        });
        return ret;
    }
    protected IDLog = async (param: ParamIDLog): Promise<any[]> => {
        return await this.apiIDLog(param, EnumResultType.data);
    }
    protected $IDLog = async (param: ParamIDLog): Promise<string> => {
        return await this.apiIDLog(param, EnumResultType.sql);
    }

    private async apiIDSum(param: ParamIDSum, resultType: EnumResultType): Promise<any> {
        let { IDX } = param;
        //this.checkParam(null, IDX, null, id, null, page);
        let ret = await this.apiPost('id-sum', resultType, {
            ...param,
            IDX: entityName(IDX),
        });
        return ret;
    }
    protected IDSum = async (param: ParamIDSum): Promise<any[]> => {
        return await this.apiIDSum(param, EnumResultType.data);
    }
    protected $IDSum = async (param: ParamIDSum): Promise<string> => {
        return await this.apiIDSum(param, EnumResultType.sql);
    }

    private async apiIDinIX(param: ParamIDinIX, resultType: EnumResultType): Promise<any> {
        let { ID, IX } = param;
        //this.checkParam(null, IDX, null, id, null, page);
        let ret = await this.apiPost('id-in-ix', resultType, {
            ...param,
            ID: entityName(ID),
            IX: entityName(IX),
        });
        return ret;
    }
    protected IDinIX = async (param: ParamIDinIX): Promise<any | { $in: boolean }[]> => {
        return await this.apiIDinIX(param, EnumResultType.data);
    }
    protected $IDinIX = async (param: ParamIDinIX): Promise<string> => {
        return await this.apiIDinIX(param, EnumResultType.sql);
    }

    private async apiIDxID(param: ParamIDxID, resultType: EnumResultType): Promise<any> {
        let { ID, IX, ID2 } = param;
        //this.checkParam(null, IDX, null, id, null, page);
        let ret = await this.apiPost('id-x-id', resultType, {
            ...param,
            ID: entityName(ID),
            IX: entityName(IX),
            ID2: entityName(ID2),
        });
        return ret;
    }
    protected IDxID = async (param: ParamIDxID): Promise<any[]> => {
        return await this.apiIDxID(param, EnumResultType.data);
    }
    protected $IDxID = async (param: ParamIDxID): Promise<string> => {
        return await this.apiIDxID(param, EnumResultType.sql);
    }

    private async apiIDTree(param: ParamIDTree, resultType: EnumResultType): Promise<any> {
        let { ID } = param;
        let ret = await this.apiPost('id-tree', resultType, {
            ...param,
            ID: entityName(ID),
        });
        return ret;
    }
    protected IDTree = async (param: ParamIDTree): Promise<any[]> => {
        return await this.apiIDTree(param, EnumResultType.data);
    }
    protected $IDTree = async (param: ParamIDTree): Promise<string> => {
        return await this.apiIDTree(param, EnumResultType.sql);
    }
}

function ids(item: string[]): number[] {
    if (!item) return;
    let len = item.length;
    if (len <= 1) return;
    let ret: number[] = [];
    for (let i = 0; i < len - 1; i++) ret.push(Number(item[i]));
    return ret;
}

function entityName(entity: Entity | string): string {
    if (!entity) return;
    if (typeof entity === 'string') return entity;
    return entity.name;
}

function toScalars(value: any): any {
    if (!value) return value;
    let ret: any = {};
    for (let i in value) {
        let v = value[i];
        if (typeof v === 'object') v = v['id'];
        ret[i] = v;
    }
    return ret;
}
