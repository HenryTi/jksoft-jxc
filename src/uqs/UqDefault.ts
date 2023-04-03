//=== UqApp builder created on Sun Apr 02 2023 21:25:17 GMT-0400 (Eastern Daylight Time) ===//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IDXValue, Uq, UqID, UqQuery, UqAction, UqIX } from "tonwa-uq";
// eslint-disable-next-line @typescript-eslint/no-unused-vars


//===============================;
//======= UQ jksoft/jksoft-mini-jxc-trial ========;
//===============================';

export interface ID {
    id?: number;
}

export interface IDX {
    id: number;
}

export interface IX {
    ix: number;
    xi: number;
}

export enum EnumID {
	$phrase = '$phrase',
	Subject = 'subject',
	History = 'history',
	UserUnit = 'userunit',
	UnitPhrase = 'unitphrase',
	BindItem = 'binditem',
	BindSheet = 'bindsheet',
	Item = 'item',
	Sheet = 'sheet',
	Detail = 'detail',
	User = 'user',
	Unit = 'unit',
	MeasureUnitName = 'measureunitname',
	MeasureUnit = 'measureunit',
	UnitItem = 'unititem',
}

export interface $phrase extends ID {
	name: string;
}

export interface $phraseInActs extends ID {
	ID?: UqID<any>;
	name: string;
}

export interface Param$role_My {
}
export interface Return$role_MyAdmins {
	id: number;
	unit: number;
	admin: number;
	entity: string;
	assigned: string;
}
export interface Return$role_MyRoles {
	unit: number;
	role: string;
}
export interface Return$role_MyUnitProps {
	unit: number;
	props: string;
}
export interface Result$role_My {
	admins: Return$role_MyAdmins[];
	roles: Return$role_MyRoles[];
	unitProps: Return$role_MyUnitProps[];
}

export interface Param$role_Unit_Users {
	unit: number;
}
export interface Return$role_Unit_UsersUsers {
	id: number;
	user: number;
	admin: number;
	assigned: string;
	name: string;
	nick: string;
	icon: string;
	addBy: number;
}
export interface Return$role_Unit_UsersRoles {
	user: number;
	role: string;
}
export interface Result$role_Unit_Users {
	users: Return$role_Unit_UsersUsers[];
	roles: Return$role_Unit_UsersRoles[];
}

export interface Param$role_Unit_Add_Admin {
	unit: number;
	user: number;
	admin: number;
	assigned: string;
}
export interface Result$role_Unit_Add_Admin {
}

export interface Param$role_Unit_Del_Admin {
	unit: number;
	user: number;
	admin: number;
}
export interface Result$role_Unit_Del_Admin {
}

export interface Param$role_Unit_Add_User {
	unit: number;
	user: number;
	assigned: string;
}
export interface Result$role_Unit_Add_User {
}

export interface Param$role_Unit_User_Role {
	unit: number;
	user: number;
	action: string;
	role: string;
}
export interface Result$role_Unit_User_Role {
}

export interface Param$role_Unit_Quit_Owner {
	unit: number;
}
export interface Result$role_Unit_Quit_Owner {
}

export interface Param$poked {
}
export interface Return$pokedRet {
	poke: number;
}
export interface Result$poked {
	ret: Return$pokedRet[];
}

export interface Param$setMyTimezone {
	_timezone: number;
}
export interface Result$setMyTimezone {
}

export interface Param$getUnitTime {
}
export interface Return$getUnitTimeRet {
	timezone: number;
	unitTimeZone: number;
	unitBizMonth: number;
	unitBizDate: number;
}
export interface Result$getUnitTime {
	ret: Return$getUnitTimeRet[];
}

export interface ParamBookSheet {
	id: number;
}
export interface ResultBookSheet {
}

export interface ParamBookSheetStoreIn {
	id: number;
}
export interface ResultBookSheetStoreIn {
}

export interface ParamBookSheetStoreOut {
	id: number;
}
export interface ResultBookSheetStoreOut {
}

export interface ParamMyUnits {
}
export interface ReturnMyUnitsRet {
	id: number;
}
export interface ResultMyUnits {
	ret: ReturnMyUnitsRet[];
}

export interface ParamSaveItem {
	item: string;
	no: string;
	ex: string;
}
export interface ReturnSaveItemRet {
	id: number;
}
export interface ResultSaveItem {
	ret: ReturnSaveItemRet[];
}

export interface ParamSaveSetting {
	phrase: string;
	id: number;
	int: number;
	dec: number;
	str: string;
}
export interface ResultSaveSetting {
}

export interface ParamSaveProp {
	phrase: string;
	id: number;
	int: number;
	dec: number;
	str: string;
}
export interface ResultSaveProp {
}

export interface ParamSaveSheet {
	sheet: string;
	no: string;
	item: number;
	value: number;
	v1: number;
	v2: number;
	v3: number;
}
export interface ReturnSaveSheetRet {
	id: number;
}
export interface ResultSaveSheet {
	ret: ReturnSaveSheetRet[];
}

export interface ParamSaveDetail {
	base: number;
	id: number;
	item: number;
	value: number;
	v1: number;
	v2: number;
	v3: number;
}
export interface ReturnSaveDetailRet {
	id: number;
}
export interface ResultSaveDetail {
	ret: ReturnSaveDetailRet[];
}

export interface ParamRemoveDraft {
	id: number;
}
export interface ResultRemoveDraft {
}

export interface ParamGetMyDrafts {
}
export interface ReturnGetMyDrafts$page {
	id: number;
	base: number;
	no: string;
	item: number;
	origin: number;
	operator: number;
	value: number;
	v1: number;
	v2: number;
	v3: number;
	phrase: string;
}
export interface ResultGetMyDrafts {
	$page: ReturnGetMyDrafts$page[];
}

export interface ParamSearchItem {
	item: string;
	key: string;
}
export interface ReturnSearchItem$page {
	id: number;
	no: string;
	ex: string;
}
export interface ResultSearchItem {
	$page: ReturnSearchItem$page[];
}

export interface ParamSearchItemSettings {
	item: string;
	key: string;
	names: string;
}
export interface ReturnSearchItemSettings$page {
	id: number;
	no: string;
	ex: string;
}
export interface ReturnSearchItemSettingsProps {
	id: number;
	prop: number;
	propName: string;
	value: string;
}
export interface ResultSearchItemSettings {
	$page: ReturnSearchItemSettings$page[];
	props: ReturnSearchItemSettingsProps[];
}

export enum SubjectType {
	Storage = 201
}

export interface Subject extends ID {
	item: number;
	type: number;
}

export interface SubjectInActs extends ID {
	ID?: UqID<any>;
	item: number | ID;
	type: number | ID;
}

export interface History extends ID {
	subject: number;
	value: number;
	ref: number;
}

export interface HistoryInActs extends ID {
	ID?: UqID<any>;
	subject: number | ID;
	value: number;
	ref: number | ID;
}

export interface IxProp extends IX {
}

export interface UserUnit extends ID {
	user: number;
	unit: number;
}

export interface UserUnitInActs extends ID {
	ID?: UqID<any>;
	user: number | ID;
	unit: number | ID;
}

export interface UnitPhrase extends ID {
	unit: number;
	phrase: number;
}

export interface UnitPhraseInActs extends ID {
	ID?: UqID<any>;
	unit: number | ID;
	phrase: number | ID;
}

export interface BindItem extends ID {
	base: number;
	item: number;
}

export interface BindItemInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
	item: number | ID;
}

export interface BindSheet extends ID {
	base: number;
	sheet: number;
}

export interface BindSheetInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
	sheet: number | ID;
}

export interface ParamGetDetails {
	id: number;
}
export interface ReturnGetDetailsRet {
	id: number;
	base: number;
	item: number;
	origin: number;
	value: number;
	v1: number;
	v2: number;
	v3: number;
}
export interface ResultGetDetails {
	ret: ReturnGetDetailsRet[];
}

export interface ParamGetDetailOrigin {
	id: number;
}
export interface ReturnGetDetailOriginRet {
	id: number;
	base: number;
	item: number;
	origin: number;
	value: number;
	v1: number;
	v2: number;
	v3: number;
	originSheet: number;
	originItem: number;
	originValue: number;
	originV1: number;
	originV2: number;
	originV3: number;
	done: number;
}
export interface ResultGetDetailOrigin {
	ret: ReturnGetDetailOriginRet[];
}

export interface ParamSearchProductForSale {
	key: string;
}
export interface ReturnSearchProductForSale$page {
	id: number;
	no: string;
	ex: string;
	v1: number;
}
export interface ResultSearchProductForSale {
	$page: ReturnSearchProductForSale$page[];
}

export interface ParamSearchSheetReady {
	sheet: string;
	state: string;
	key: string;
}
export interface ReturnSearchSheetReady$page {
	id: number;
	base: number;
	no: string;
	item: number;
	origin: number;
	operator: number;
	value: number;
	v1: number;
	v2: number;
	v3: number;
}
export interface ResultSearchSheetReady {
	$page: ReturnSearchSheetReady$page[];
}

export const ItemType = {
	Product: "product",
	Contact: "contact"
}

export interface Item extends ID {
	base: number;
	no: string;
	ex: string;
}

export interface ItemInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
	no: string;
	ex: string;
}

export const SheetType = {
	Purchase: "purchase",
	Sale: "sale",
	StoreIn: "storein",
	StoreOut: "storeout"
}

export interface Sheet extends ID {
	base: number;
	no: string;
	item: number;
	origin: number;
	operator: number;
	value: number;
	v1: number;
	v2: number;
	v3: number;
}

export interface SheetInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
	no: string;
	item: number | ID;
	origin: number | ID;
	operator: number | ID;
	value: number;
	v1: number;
	v2: number;
	v3: number;
}

export const FlowState = {
	Start: "$start",
	Ready: "ready"
}

export interface Detail extends ID {
	base: number;
	item: number;
	origin: number;
	value: number;
	v1: number;
	v2: number;
	v3: number;
}

export interface DetailInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
	item: number | ID;
	origin: number | ID;
	value: number;
	v1: number;
	v2: number;
	v3: number;
}

export interface User extends ID {
	tonwaUser: number;
}

export interface UserInActs extends ID {
	ID?: UqID<any>;
	tonwaUser: number;
}

export interface Unit extends ID {
	no: string;
	caption: string;
}

export const Unit = {
}

export interface UnitInActs extends ID {
	ID?: UqID<any>;
	no: string;
	caption: string;
}

export enum MeasureUnitType {
	count = 1,
	length = 2,
	area = 3,
	volume = 4,
	weight = 5,
	time = 6
}

export interface MeasureUnitName extends ID {
	name: string;
	alias: string;
	type: any;
}

export interface MeasureUnitNameInActs extends ID {
	ID?: UqID<any>;
	name: string;
	alias: string;
	type: any;
}

export interface MeasureUnit extends ID {
	unitBase: number;
	quantity: number;
	unitName: number;
	type: any;
}

export interface MeasureUnitInActs extends ID {
	ID?: UqID<any>;
	unitBase: number | ID;
	quantity: number;
	unitName: number | ID;
	type: any;
}

export interface UnitItem extends ID {
	item: number;
	unit: number;
}

export interface UnitItemInActs extends ID {
	ID?: UqID<any>;
	item: number | ID;
	unit: number | ID;
}

export interface ParamReportStorage {
	key: string;
}
export interface ReturnReportStorage$page {
	item: number;
	value: number;
	init: number;
}
export interface ResultReportStorage {
	$page: ReturnReportStorage$page[];
}

export interface ParamHistoryStorage {
	item: number;
}
export interface ReturnHistoryStorage$page {
	id: number;
	value: number;
	ref: number;
}
export interface ResultHistoryStorage {
	$page: ReturnHistoryStorage$page[];
}



export interface ParamActs {
	$phrase?: $phraseInActs[];
	subject?: SubjectInActs[];
	history?: HistoryInActs[];
	ixProp?: IxProp[];
	userUnit?: UserUnitInActs[];
	unitPhrase?: UnitPhraseInActs[];
	bindItem?: BindItemInActs[];
	bindSheet?: BindSheetInActs[];
	item?: ItemInActs[];
	sheet?: SheetInActs[];
	detail?: DetailInActs[];
	user?: UserInActs[];
	unit?: UnitInActs[];
	measureUnitName?: MeasureUnitNameInActs[];
	measureUnit?: MeasureUnitInActs[];
	unitItem?: UnitItemInActs[];
}


export interface UqExt extends Uq {
	Acts(param:ParamActs): Promise<any>;
	SQL: Uq;
    Role: { [key: string]: string[] };

	$phrase: UqID<any>;
	$role_My: UqQuery<Param$role_My, Result$role_My>;
	$role_Unit_Users: UqQuery<Param$role_Unit_Users, Result$role_Unit_Users>;
	$role_Unit_Add_Admin: UqAction<Param$role_Unit_Add_Admin, Result$role_Unit_Add_Admin>;
	$role_Unit_Del_Admin: UqAction<Param$role_Unit_Del_Admin, Result$role_Unit_Del_Admin>;
	$role_Unit_Add_User: UqAction<Param$role_Unit_Add_User, Result$role_Unit_Add_User>;
	$role_Unit_User_Role: UqAction<Param$role_Unit_User_Role, Result$role_Unit_User_Role>;
	$role_Unit_Quit_Owner: UqAction<Param$role_Unit_Quit_Owner, Result$role_Unit_Quit_Owner>;
	$poked: UqQuery<Param$poked, Result$poked>;
	$setMyTimezone: UqAction<Param$setMyTimezone, Result$setMyTimezone>;
	$getUnitTime: UqQuery<Param$getUnitTime, Result$getUnitTime>;
	BookSheet: UqAction<ParamBookSheet, ResultBookSheet>;
	BookSheetStoreIn: UqAction<ParamBookSheetStoreIn, ResultBookSheetStoreIn>;
	BookSheetStoreOut: UqAction<ParamBookSheetStoreOut, ResultBookSheetStoreOut>;
	MyUnits: UqQuery<ParamMyUnits, ResultMyUnits>;
	SaveItem: UqAction<ParamSaveItem, ResultSaveItem>;
	SaveSetting: UqAction<ParamSaveSetting, ResultSaveSetting>;
	SaveProp: UqAction<ParamSaveProp, ResultSaveProp>;
	SaveSheet: UqAction<ParamSaveSheet, ResultSaveSheet>;
	SaveDetail: UqAction<ParamSaveDetail, ResultSaveDetail>;
	RemoveDraft: UqAction<ParamRemoveDraft, ResultRemoveDraft>;
	GetMyDrafts: UqQuery<ParamGetMyDrafts, ResultGetMyDrafts>;
	SearchItem: UqQuery<ParamSearchItem, ResultSearchItem>;
	SearchItemSettings: UqQuery<ParamSearchItemSettings, ResultSearchItemSettings>;
	Subject: UqID<any>;
	History: UqID<any>;
	IxProp: UqIX<any>;
	UserUnit: UqID<any>;
	UnitPhrase: UqID<any>;
	BindItem: UqID<any>;
	BindSheet: UqID<any>;
	GetDetails: UqQuery<ParamGetDetails, ResultGetDetails>;
	GetDetailOrigin: UqQuery<ParamGetDetailOrigin, ResultGetDetailOrigin>;
	SearchProductForSale: UqQuery<ParamSearchProductForSale, ResultSearchProductForSale>;
	SearchSheetReady: UqQuery<ParamSearchSheetReady, ResultSearchSheetReady>;
	Item: UqID<any>;
	Sheet: UqID<any>;
	Detail: UqID<any>;
	User: UqID<any>;
	Unit: UqID<any>;
	MeasureUnitName: UqID<any>;
	MeasureUnit: UqID<any>;
	UnitItem: UqID<any>;
	ReportStorage: UqQuery<ParamReportStorage, ResultReportStorage>;
	HistoryStorage: UqQuery<ParamHistoryStorage, ResultHistoryStorage>;
}


export const uqSchema={
    "$phrase": {
        "name": "$phrase",
        "type": "id",
        "private": false,
        "fields": [
            {
                "name": "name",
                "type": "char",
                "size": 200
            }
        ],
        "keys": [] as any,
        "global": false,
        "isMinute": false
    },
    "$role_my": {
        "name": "$role_my",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [] as any,
        "returns": [
            {
                "name": "admins",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "unit",
                        "type": "id"
                    },
                    {
                        "name": "admin",
                        "type": "tinyint"
                    },
                    {
                        "name": "entity",
                        "type": "char",
                        "size": 100
                    },
                    {
                        "name": "assigned",
                        "type": "char",
                        "size": 100
                    }
                ]
            },
            {
                "name": "roles",
                "fields": [
                    {
                        "name": "unit",
                        "type": "id"
                    },
                    {
                        "name": "role",
                        "type": "char",
                        "size": 100
                    }
                ]
            },
            {
                "name": "unitProps",
                "fields": [
                    {
                        "name": "unit",
                        "type": "id"
                    },
                    {
                        "name": "props",
                        "type": "text"
                    }
                ]
            }
        ]
    },
    "$role_unit_users": {
        "name": "$role_unit_users",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "unit",
                "type": "bigint"
            }
        ],
        "returns": [
            {
                "name": "users",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "user",
                        "type": "id"
                    },
                    {
                        "name": "admin",
                        "type": "tinyint"
                    },
                    {
                        "name": "assigned",
                        "type": "char",
                        "size": 100
                    },
                    {
                        "name": "name",
                        "type": "char",
                        "size": 100
                    },
                    {
                        "name": "nick",
                        "type": "char",
                        "size": 100
                    },
                    {
                        "name": "icon",
                        "type": "char",
                        "size": 200
                    },
                    {
                        "name": "addBy",
                        "type": "id"
                    }
                ]
            },
            {
                "name": "roles",
                "fields": [
                    {
                        "name": "user",
                        "type": "id"
                    },
                    {
                        "name": "role",
                        "type": "char",
                        "size": 100
                    }
                ]
            }
        ]
    },
    "$role_unit_add_admin": {
        "name": "$role_unit_add_admin",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "unit",
                "type": "bigint"
            },
            {
                "name": "user",
                "type": "bigint"
            },
            {
                "name": "admin",
                "type": "tinyint"
            },
            {
                "name": "assigned",
                "type": "char",
                "size": 100
            }
        ],
        "returns": [] as any
    },
    "$role_unit_del_admin": {
        "name": "$role_unit_del_admin",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "unit",
                "type": "bigint"
            },
            {
                "name": "user",
                "type": "bigint"
            },
            {
                "name": "admin",
                "type": "tinyint"
            }
        ],
        "returns": [] as any
    },
    "$role_unit_add_user": {
        "name": "$role_unit_add_user",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "unit",
                "type": "bigint"
            },
            {
                "name": "user",
                "type": "bigint"
            },
            {
                "name": "assigned",
                "type": "char",
                "size": 100
            }
        ],
        "returns": [] as any
    },
    "$role_unit_user_role": {
        "name": "$role_unit_user_role",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "unit",
                "type": "bigint"
            },
            {
                "name": "user",
                "type": "bigint"
            },
            {
                "name": "action",
                "type": "char",
                "size": 100
            },
            {
                "name": "role",
                "type": "char",
                "size": 100
            }
        ],
        "returns": [] as any
    },
    "$role_unit_quit_owner": {
        "name": "$role_unit_quit_owner",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "unit",
                "type": "bigint"
            }
        ],
        "returns": [] as any
    },
    "$poked": {
        "name": "$poked",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [] as any,
        "returns": [
            {
                "name": "ret",
                "fields": [
                    {
                        "name": "poke",
                        "type": "tinyint"
                    }
                ]
            }
        ]
    },
    "$setmytimezone": {
        "name": "$setMyTimezone",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "_timezone",
                "type": "tinyint"
            }
        ],
        "returns": [] as any
    },
    "$getunittime": {
        "name": "$getUnitTime",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [] as any,
        "returns": [
            {
                "name": "ret",
                "fields": [
                    {
                        "name": "timezone",
                        "type": "tinyint"
                    },
                    {
                        "name": "unitTimeZone",
                        "type": "tinyint"
                    },
                    {
                        "name": "unitBizMonth",
                        "type": "tinyint"
                    },
                    {
                        "name": "unitBizDate",
                        "type": "tinyint"
                    }
                ]
            }
        ]
    },
    "booksheet": {
        "name": "BookSheet",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id"
            }
        ],
        "returns": [] as any
    },
    "booksheetstorein": {
        "name": "BookSheetStoreIn",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id"
            }
        ],
        "returns": [] as any
    },
    "booksheetstoreout": {
        "name": "BookSheetStoreOut",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id"
            }
        ],
        "returns": [] as any
    },
    "myunits": {
        "name": "MyUnits",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [] as any,
        "returns": [
            {
                "name": "ret",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    }
                ]
            }
        ]
    },
    "saveitem": {
        "name": "SaveItem",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "item",
                "type": "char",
                "size": 100
            },
            {
                "name": "no",
                "type": "char",
                "size": 30
            },
            {
                "name": "ex",
                "type": "char",
                "size": 200
            }
        ],
        "returns": [
            {
                "name": "ret",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    }
                ]
            }
        ]
    },
    "savesetting": {
        "name": "SaveSetting",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "phrase",
                "type": "char",
                "size": 200
            },
            {
                "name": "id",
                "type": "id"
            },
            {
                "name": "int",
                "type": "bigint"
            },
            {
                "name": "dec",
                "type": "dec",
                "scale": 4,
                "precision": 18
            },
            {
                "name": "str",
                "type": "char",
                "size": 100
            }
        ],
        "returns": [] as any
    },
    "saveprop": {
        "name": "SaveProp",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "phrase",
                "type": "char",
                "size": 200
            },
            {
                "name": "id",
                "type": "id"
            },
            {
                "name": "int",
                "type": "bigint"
            },
            {
                "name": "dec",
                "type": "dec",
                "scale": 4,
                "precision": 18
            },
            {
                "name": "str",
                "type": "char",
                "size": 100
            }
        ],
        "returns": [] as any
    },
    "savesheet": {
        "name": "SaveSheet",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "sheet",
                "type": "char",
                "size": 100
            },
            {
                "name": "no",
                "type": "char",
                "size": 30
            },
            {
                "name": "item",
                "type": "id"
            },
            {
                "name": "value",
                "type": "dec",
                "scale": 4,
                "precision": 18
            },
            {
                "name": "v1",
                "type": "dec",
                "scale": 4,
                "precision": 18
            },
            {
                "name": "v2",
                "type": "dec",
                "scale": 4,
                "precision": 18
            },
            {
                "name": "v3",
                "type": "dec",
                "scale": 4,
                "precision": 18
            }
        ],
        "returns": [
            {
                "name": "ret",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    }
                ]
            }
        ]
    },
    "savedetail": {
        "name": "SaveDetail",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "base",
                "type": "id"
            },
            {
                "name": "id",
                "type": "id"
            },
            {
                "name": "item",
                "type": "id"
            },
            {
                "name": "value",
                "type": "dec",
                "scale": 4,
                "precision": 18
            },
            {
                "name": "v1",
                "type": "dec",
                "scale": 4,
                "precision": 18
            },
            {
                "name": "v2",
                "type": "dec",
                "scale": 4,
                "precision": 18
            },
            {
                "name": "v3",
                "type": "dec",
                "scale": 4,
                "precision": 18
            }
        ],
        "returns": [
            {
                "name": "ret",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    }
                ]
            }
        ]
    },
    "removedraft": {
        "name": "RemoveDraft",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id"
            }
        ],
        "returns": [] as any
    },
    "getmydrafts": {
        "name": "GetMyDrafts",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [] as any,
        "returns": [
            {
                "name": "$page",
                "fields": [
                    {
                        "name": "id",
                        "type": "id",
                        "null": false
                    },
                    {
                        "name": "base",
                        "type": "id"
                    },
                    {
                        "name": "no",
                        "type": "char",
                        "size": 20
                    },
                    {
                        "name": "item",
                        "type": "id"
                    },
                    {
                        "name": "origin",
                        "type": "id"
                    },
                    {
                        "name": "operator",
                        "type": "id"
                    },
                    {
                        "name": "value",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "v1",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "v2",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "v3",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "phrase",
                        "type": "char",
                        "size": 200
                    }
                ],
                "order": "desc"
            }
        ]
    },
    "searchitem": {
        "name": "SearchItem",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "item",
                "type": "char",
                "size": 100
            },
            {
                "name": "key",
                "type": "char",
                "size": 50
            }
        ],
        "returns": [
            {
                "name": "$page",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "no",
                        "type": "char",
                        "size": 50
                    },
                    {
                        "name": "ex",
                        "type": "char",
                        "size": 50
                    }
                ],
                "order": "desc"
            }
        ]
    },
    "searchitemsettings": {
        "name": "SearchItemSettings",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "item",
                "type": "char",
                "size": 100
            },
            {
                "name": "key",
                "type": "char",
                "size": 50
            },
            {
                "name": "names",
                "type": "char",
                "size": 300
            }
        ],
        "returns": [
            {
                "name": "$page",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "no",
                        "type": "char",
                        "size": 50
                    },
                    {
                        "name": "ex",
                        "type": "char",
                        "size": 50
                    }
                ],
                "order": "desc"
            },
            {
                "name": "props",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "prop",
                        "type": "id"
                    },
                    {
                        "name": "propName",
                        "type": "char",
                        "size": 50
                    },
                    {
                        "name": "value",
                        "type": "char",
                        "size": 200
                    }
                ]
            }
        ]
    },
    "subjecttype": {
        "name": "SubjectType",
        "type": "enum",
        "private": false,
        "sys": true,
        "values": {
            "Storage": 201
        }
    },
    "subject": {
        "name": "Subject",
        "type": "id",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id",
                "null": false
            },
            {
                "name": "item",
                "type": "id"
            },
            {
                "name": "type",
                "type": "id"
            }
        ],
        "keys": [
            {
                "name": "item",
                "type": "id"
            },
            {
                "name": "type",
                "type": "id"
            }
        ],
        "global": false,
        "idType": 3,
        "isMinute": false
    },
    "history": {
        "name": "History",
        "type": "id",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id",
                "null": false
            },
            {
                "name": "subject",
                "type": "id"
            },
            {
                "name": "value",
                "type": "dec",
                "scale": 4,
                "precision": 18
            },
            {
                "name": "ref",
                "type": "id"
            }
        ],
        "keys": [] as any,
        "global": false,
        "idType": 3,
        "isMinute": true
    },
    "ixprop": {
        "name": "IxProp",
        "type": "ix",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "ix",
                "type": "id"
            },
            {
                "name": "xi",
                "type": "id"
            }
        ],
        "ixx": false,
        "hasSort": false,
        "xiType": 0
    },
    "userunit": {
        "name": "UserUnit",
        "type": "id",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id",
                "null": false
            },
            {
                "name": "user",
                "type": "id"
            },
            {
                "name": "unit",
                "type": "id"
            }
        ],
        "keys": [
            {
                "name": "user",
                "type": "id"
            },
            {
                "name": "unit",
                "type": "id"
            }
        ],
        "global": false,
        "idType": 3,
        "isMinute": false
    },
    "unitphrase": {
        "name": "UnitPhrase",
        "type": "id",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id",
                "null": false
            },
            {
                "name": "unit",
                "type": "id"
            },
            {
                "name": "phrase",
                "type": "id"
            }
        ],
        "keys": [
            {
                "name": "unit",
                "type": "id"
            },
            {
                "name": "phrase",
                "type": "id"
            }
        ],
        "global": false,
        "idType": 3,
        "isMinute": false
    },
    "binditem": {
        "name": "BindItem",
        "type": "id",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id",
                "null": false
            },
            {
                "name": "base",
                "type": "id"
            },
            {
                "name": "item",
                "type": "id"
            }
        ],
        "keys": [
            {
                "name": "base",
                "type": "id"
            },
            {
                "name": "item",
                "type": "id"
            }
        ],
        "global": false,
        "idType": 3,
        "isMinute": false
    },
    "bindsheet": {
        "name": "BindSheet",
        "type": "id",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id",
                "null": false
            },
            {
                "name": "base",
                "type": "id"
            },
            {
                "name": "sheet",
                "type": "id"
            }
        ],
        "keys": [
            {
                "name": "base",
                "type": "id"
            },
            {
                "name": "sheet",
                "type": "id"
            }
        ],
        "global": false,
        "idType": 3,
        "isMinute": true
    },
    "getdetails": {
        "name": "GetDetails",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id"
            }
        ],
        "returns": [
            {
                "name": "ret",
                "fields": [
                    {
                        "name": "id",
                        "type": "id",
                        "null": false
                    },
                    {
                        "name": "base",
                        "type": "id"
                    },
                    {
                        "name": "item",
                        "type": "id"
                    },
                    {
                        "name": "origin",
                        "type": "id"
                    },
                    {
                        "name": "value",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "v1",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "v2",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "v3",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    }
                ]
            }
        ]
    },
    "getdetailorigin": {
        "name": "GetDetailOrigin",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id"
            }
        ],
        "returns": [
            {
                "name": "ret",
                "fields": [
                    {
                        "name": "id",
                        "type": "id",
                        "null": false
                    },
                    {
                        "name": "base",
                        "type": "id"
                    },
                    {
                        "name": "item",
                        "type": "id"
                    },
                    {
                        "name": "origin",
                        "type": "id"
                    },
                    {
                        "name": "value",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "v1",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "v2",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "v3",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "originSheet",
                        "type": "id"
                    },
                    {
                        "name": "originItem",
                        "type": "id"
                    },
                    {
                        "name": "originValue",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "originV1",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "originV2",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "originV3",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "done",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    }
                ]
            }
        ]
    },
    "searchproductforsale": {
        "name": "SearchProductForSale",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "key",
                "type": "char",
                "size": 50
            }
        ],
        "returns": [
            {
                "name": "$page",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "no",
                        "type": "char",
                        "size": 50
                    },
                    {
                        "name": "ex",
                        "type": "char",
                        "size": 50
                    },
                    {
                        "name": "v1",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    }
                ],
                "order": "desc"
            }
        ]
    },
    "searchsheetready": {
        "name": "SearchSheetReady",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "sheet",
                "type": "char",
                "size": 50
            },
            {
                "name": "state",
                "type": "char",
                "size": 50
            },
            {
                "name": "key",
                "type": "char",
                "size": 50
            }
        ],
        "returns": [
            {
                "name": "$page",
                "fields": [
                    {
                        "name": "id",
                        "type": "id",
                        "null": false
                    },
                    {
                        "name": "base",
                        "type": "id"
                    },
                    {
                        "name": "no",
                        "type": "char",
                        "size": 20
                    },
                    {
                        "name": "item",
                        "type": "id"
                    },
                    {
                        "name": "origin",
                        "type": "id"
                    },
                    {
                        "name": "operator",
                        "type": "id"
                    },
                    {
                        "name": "value",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "v1",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "v2",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "v3",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    }
                ],
                "order": "asc"
            }
        ]
    },
    "itemtype": {
        "name": "ItemType",
        "type": "const",
        "private": false,
        "sys": true,
        "fields": [] as any,
        "values": {
            "Product": "product",
            "Contact": "contact"
        }
    },
    "item": {
        "name": "Item",
        "type": "id",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id",
                "null": false
            },
            {
                "name": "base",
                "type": "id"
            },
            {
                "name": "no",
                "type": "char",
                "size": 20
            },
            {
                "name": "ex",
                "type": "char",
                "size": 200
            }
        ],
        "keys": [
            {
                "name": "base",
                "type": "id"
            },
            {
                "name": "no",
                "type": "char",
                "size": 20
            }
        ],
        "global": false,
        "idType": 3,
        "isMinute": false
    },
    "sheettype": {
        "name": "SheetType",
        "type": "const",
        "private": false,
        "sys": true,
        "fields": [] as any,
        "values": {
            "Purchase": "purchase",
            "Sale": "sale",
            "StoreIn": "storein",
            "StoreOut": "storeout"
        }
    },
    "sheet": {
        "name": "Sheet",
        "type": "id",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id",
                "null": false
            },
            {
                "name": "base",
                "type": "id"
            },
            {
                "name": "no",
                "type": "char",
                "size": 20
            },
            {
                "name": "item",
                "type": "id"
            },
            {
                "name": "origin",
                "type": "id"
            },
            {
                "name": "operator",
                "type": "id"
            },
            {
                "name": "value",
                "type": "dec",
                "scale": 4,
                "precision": 18
            },
            {
                "name": "v1",
                "type": "dec",
                "scale": 4,
                "precision": 18
            },
            {
                "name": "v2",
                "type": "dec",
                "scale": 4,
                "precision": 18
            },
            {
                "name": "v3",
                "type": "dec",
                "scale": 4,
                "precision": 18
            }
        ],
        "keys": [
            {
                "name": "base",
                "type": "id"
            },
            {
                "name": "no",
                "type": "char",
                "size": 20
            }
        ],
        "global": false,
        "idType": 3,
        "isMinute": true
    },
    "flowstate": {
        "name": "FlowState",
        "type": "const",
        "private": false,
        "sys": true,
        "fields": [] as any,
        "values": {
            "Start": "$start",
            "Ready": "ready"
        }
    },
    "detail": {
        "name": "Detail",
        "type": "id",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id",
                "null": false
            },
            {
                "name": "base",
                "type": "id"
            },
            {
                "name": "item",
                "type": "id"
            },
            {
                "name": "origin",
                "type": "id"
            },
            {
                "name": "value",
                "type": "dec",
                "scale": 4,
                "precision": 18
            },
            {
                "name": "v1",
                "type": "dec",
                "scale": 4,
                "precision": 18
            },
            {
                "name": "v2",
                "type": "dec",
                "scale": 4,
                "precision": 18
            },
            {
                "name": "v3",
                "type": "dec",
                "scale": 4,
                "precision": 18
            }
        ],
        "keys": [] as any,
        "global": false,
        "idType": 3,
        "isMinute": true
    },
    "user": {
        "name": "User",
        "type": "id",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id",
                "null": false
            },
            {
                "name": "tonwaUser",
                "type": "int"
            }
        ],
        "keys": [
            {
                "name": "tonwaUser",
                "type": "int"
            }
        ],
        "global": false,
        "idType": 3,
        "isMinute": false
    },
    "unit": {
        "name": "Unit",
        "type": "id",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id",
                "null": false
            },
            {
                "name": "no",
                "type": "char",
                "size": 20
            },
            {
                "name": "caption",
                "type": "char",
                "size": 100
            }
        ],
        "values": {},
        "keys": [
            {
                "name": "no",
                "type": "char",
                "size": 20
            }
        ],
        "global": false,
        "idType": 3,
        "isMinute": false
    },
    "measureunittype": {
        "name": "MeasureUnitType",
        "type": "enum",
        "private": false,
        "sys": true,
        "values": {
            "count": 1,
            "length": 2,
            "area": 3,
            "volume": 4,
            "weight": 5,
            "time": 6
        }
    },
    "measureunitname": {
        "name": "MeasureUnitName",
        "type": "id",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id",
                "null": false
            },
            {
                "name": "name",
                "type": "char",
                "size": 50
            },
            {
                "name": "alias",
                "type": "char",
                "size": 50
            },
            {
                "name": "type",
                "type": "enum"
            }
        ],
        "keys": [
            {
                "name": "name",
                "type": "char",
                "size": 50
            }
        ],
        "global": false,
        "idType": 3,
        "isMinute": false
    },
    "measureunit": {
        "name": "MeasureUnit",
        "type": "id",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id",
                "null": false
            },
            {
                "name": "unitBase",
                "type": "id",
                "ID": "measureunit",
                "tuid": "measureunit"
            },
            {
                "name": "quantity",
                "type": "dec",
                "scale": 4,
                "precision": 9
            },
            {
                "name": "unitName",
                "type": "id",
                "ID": "measureunitname",
                "tuid": "measureunitname"
            },
            {
                "name": "type",
                "type": "enum"
            }
        ],
        "keys": [
            {
                "name": "unitBase",
                "type": "id",
                "ID": "measureunit",
                "tuid": "measureunit"
            },
            {
                "name": "quantity",
                "type": "dec",
                "scale": 4,
                "precision": 9
            }
        ],
        "global": false,
        "idType": 3,
        "isMinute": false
    },
    "unititem": {
        "name": "UnitItem",
        "type": "id",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id",
                "null": false
            },
            {
                "name": "item",
                "type": "id"
            },
            {
                "name": "unit",
                "type": "id"
            }
        ],
        "keys": [
            {
                "name": "item",
                "type": "id"
            },
            {
                "name": "unit",
                "type": "id"
            }
        ],
        "global": false,
        "idType": 3,
        "isMinute": false
    },
    "reportstorage": {
        "name": "ReportStorage",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "key",
                "type": "char",
                "size": 50
            }
        ],
        "returns": [
            {
                "name": "$page",
                "fields": [
                    {
                        "name": "item",
                        "type": "id"
                    },
                    {
                        "name": "value",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "init",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    }
                ],
                "order": "asc"
            }
        ]
    },
    "historystorage": {
        "name": "HistoryStorage",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "item",
                "type": "id"
            }
        ],
        "returns": [
            {
                "name": "$page",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "value",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "ref",
                        "type": "id"
                    }
                ],
                "order": "desc"
            }
        ]
    },
    "$biz": {
        "$user": {
            "name": "$user",
            "type": "$user",
            "props": [] as any,
            "settings": [] as any
        },
        "$unit": {
            "name": "$unit",
            "type": "$unit",
            "props": [] as any,
            "settings": [] as any
        },
        "b": {
            "name": "b",
            "type": "item",
            "props": [
                {
                    "name": "a",
                    "type": "int"
                },
                {
                    "name": "b",
                    "type": "char",
                    "value": 1
                },
                {
                    "name": "c",
                    "type": "char"
                }
            ],
            "settings": [
                {
                    "name": "流水",
                    "type": "char",
                    "caption": "下一步",
                    "value": "s2"
                }
            ],
            "states": [] as any
        },
        "c": {
            "name": "c",
            "type": "subject",
            "props": [] as any,
            "settings": [
                {
                    "name": "流水",
                    "type": "char",
                    "caption": "下一步",
                    "value": "s2"
                }
            ]
        },
        "contact": {
            "name": "contact",
            "type": "item",
            "caption": "往来单位",
            "props": [
                {
                    "name": "a",
                    "type": "int",
                    "caption": "联系人"
                },
                {
                    "name": "b",
                    "type": "radio",
                    "caption": "类型",
                    "items": [
                        [
                            "big",
                            "大",
                            1
                        ],
                        [
                            "中",
                            null,
                            2
                        ],
                        [
                            "small",
                            "小",
                            3
                        ]
                    ]
                },
                {
                    "name": "c",
                    "type": "radio",
                    "caption": "可信度",
                    "items": [
                        [
                            "高",
                            null,
                            null
                        ],
                        [
                            "中",
                            null,
                            null
                        ],
                        [
                            "低",
                            null,
                            null
                        ]
                    ]
                },
                {
                    "name": "d",
                    "type": "check",
                    "caption": "产品种类",
                    "items": [
                        [
                            "中药",
                            null,
                            null
                        ],
                        [
                            "片剂",
                            null,
                            null
                        ],
                        [
                            "水剂",
                            null,
                            null
                        ],
                        [
                            "器械",
                            null,
                            null
                        ]
                    ]
                }
            ],
            "settings": [] as any,
            "states": [
                {
                    "name": "可用",
                    "type": "itemstate"
                },
                {
                    "name": "禁用",
                    "type": "itemstate"
                },
                {
                    "name": "经理级别可见",
                    "type": "itemstate"
                }
            ]
        },
        "product": {
            "name": "product",
            "type": "item",
            "caption": "产品",
            "props": [
                {
                    "name": "厂家",
                    "type": "ID",
                    "item": "contact"
                }
            ],
            "settings": [
                {
                    "name": "retailprice",
                    "type": "dec",
                    "caption": "零售价"
                }
            ],
            "states": [] as any
        },
        "batch": {
            "name": "batch",
            "type": "item",
            "props": [
                {
                    "name": "效期",
                    "type": "date"
                }
            ],
            "settings": [] as any,
            "states": [] as any
        },
        "销售员": {
            "name": "销售员",
            "type": "permit",
            "props": [] as any,
            "settings": [] as any
        },
        "入库员": {
            "name": "入库员",
            "type": "permit",
            "props": [] as any,
            "settings": [] as any
        },
        "检验员": {
            "name": "检验员",
            "type": "permit",
            "props": [] as any,
            "settings": [] as any
        },
        "经理": {
            "name": "经理",
            "type": "role",
            "props": [] as any,
            "settings": [] as any
        },
        "销售部经理": {
            "name": "销售部经理",
            "type": "role",
            "props": [] as any,
            "settings": [] as any
        },
        "公司规程": {
            "name": "公司规程",
            "type": "subject",
            "props": [
                {
                    "name": "name",
                    "type": "char",
                    "caption": "公司名称"
                }
            ],
            "settings": [] as any
        },
        "purchase": {
            "name": "purchase",
            "type": "sheet",
            "caption": "采购单",
            "props": [] as any,
            "settings": [] as any,
            "details": [
                {
                    "name": "$detail",
                    "props": [] as any,
                    "settings": [] as any
                }
            ],
            "states": [
                {
                    "name": "s1",
                    "props": [] as any,
                    "settings": [] as any,
                    "acts": [] as any
                },
                {
                    "name": "$start",
                    "props": [] as any,
                    "settings": [] as any,
                    "acts": [] as any
                }
            ]
        },
        "sale": {
            "name": "sale",
            "type": "sheet",
            "caption": "销售单",
            "props": [] as any,
            "settings": [] as any,
            "details": [
                {
                    "name": "$detail",
                    "props": [] as any,
                    "settings": [] as any
                }
            ],
            "states": [
                {
                    "name": "$start",
                    "props": [] as any,
                    "settings": [] as any,
                    "acts": [] as any
                }
            ]
        },
        "storein": {
            "name": "storein",
            "type": "sheet",
            "caption": "入库单",
            "props": [] as any,
            "settings": [] as any,
            "details": [
                {
                    "name": "$detail",
                    "props": [] as any,
                    "settings": [] as any
                }
            ],
            "states": [
                {
                    "name": "$start",
                    "props": [] as any,
                    "settings": [] as any,
                    "acts": [] as any
                }
            ]
        },
        "storeout": {
            "name": "storeout",
            "type": "sheet",
            "caption": "出库单",
            "props": [] as any,
            "settings": [] as any,
            "details": [
                {
                    "name": "$detail",
                    "props": [] as any,
                    "settings": [] as any
                }
            ],
            "states": [
                {
                    "name": "$start",
                    "props": [] as any,
                    "settings": [] as any,
                    "acts": [] as any
                }
            ]
        },
        "a": {
            "name": "a",
            "type": "sheet",
            "props": [
                {
                    "name": "a",
                    "type": "int",
                    "caption": "显示a"
                },
                {
                    "name": "b",
                    "type": "int",
                    "caption": "显示b"
                },
                {
                    "name": "c",
                    "type": "radio",
                    "caption": "类型",
                    "items": [
                        [
                            "big",
                            "大",
                            1
                        ],
                        [
                            "中",
                            null,
                            2
                        ],
                        [
                            "small",
                            "小",
                            3
                        ]
                    ]
                }
            ],
            "settings": [
                {
                    "name": "流水",
                    "type": "char",
                    "caption": "下一步",
                    "value": "s2"
                }
            ],
            "details": [
                {
                    "name": "da",
                    "caption": "显示detail a",
                    "props": [] as any,
                    "settings": [] as any
                },
                {
                    "name": "db",
                    "caption": "显示detail b",
                    "props": [
                        {
                            "name": "b",
                            "type": "char"
                        }
                    ],
                    "settings": [] as any
                },
                {
                    "name": "$detail",
                    "props": [
                        {
                            "name": "a",
                            "type": "int"
                        },
                        {
                            "name": "b",
                            "type": "int"
                        }
                    ],
                    "settings": [] as any
                }
            ],
            "states": [
                {
                    "name": "s0",
                    "props": [] as any,
                    "settings": [
                        {
                            "name": "next",
                            "type": "char",
                            "caption": "下一步",
                            "value": "s2"
                        }
                    ],
                    "acts": [
                        {
                            "name": "procstorein",
                            "caption": "入库"
                        }
                    ]
                },
                {
                    "name": "s1",
                    "caption": "状态s1",
                    "props": [] as any,
                    "settings": [] as any,
                    "acts": [
                        {
                            "name": "$act"
                        }
                    ]
                },
                {
                    "name": "s2",
                    "caption": "状态s2",
                    "props": [] as any,
                    "settings": [] as any,
                    "acts": [
                        {
                            "name": "procstoreout2"
                        }
                    ]
                },
                {
                    "name": "$start",
                    "props": [] as any,
                    "settings": [] as any,
                    "acts": [] as any
                }
            ]
        }
    }
}