//=== UqApp builder created on Wed Apr 05 2023 19:58:15 GMT-0400 (Eastern Daylight Time) ===//
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
	History = 'history',
	UserSite = 'usersite',
	SitePhrase = 'sitephrase',
	BindAtom = 'bindatom',
	BindPhraseTo = 'bindphraseto',
	Atom = 'atom',
	Sheet = 'sheet',
	Detail = 'detail',
	Subject = 'subject',
	User = 'user',
	Site = 'site',
	Group = 'group',
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

export interface ParamMyUnits {
}
export interface ReturnMyUnitsRet {
	id: number;
}
export interface ResultMyUnits {
	ret: ReturnMyUnitsRet[];
}

export interface ParamSaveAtom {
	atom: string;
	no: string;
	ex: string;
}
export interface ReturnSaveAtomRet {
	id: number;
}
export interface ResultSaveAtom {
	ret: ReturnSaveAtomRet[];
}

export interface ParamSaveAssign {
	phrase: string;
	id: number;
	int: number;
	dec: number;
	str: string;
}
export interface ResultSaveAssign {
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
	origin: number;
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

export interface ParamSearchAtom {
	atom: string;
	key: string;
}
export interface ReturnSearchAtom$page {
	id: number;
	no: string;
	ex: string;
}
export interface ResultSearchAtom {
	$page: ReturnSearchAtom$page[];
}

export interface ParamSearchAtomProps {
	atom: string;
	key: string;
	names: string;
}
export interface ReturnSearchAtomProps$page {
	id: number;
	no: string;
	ex: string;
}
export interface ReturnSearchAtomPropsBuds {
	id: number;
	bud: number;
	phrase: string;
	value: string;
}
export interface ResultSearchAtomProps {
	$page: ReturnSearchAtomProps$page[];
	buds: ReturnSearchAtomPropsBuds[];
}

export interface ParamSearchAtomAssigns {
	atom: string;
	key: string;
	names: string;
}
export interface ReturnSearchAtomAssigns$page {
	id: number;
	no: string;
	ex: string;
}
export interface ReturnSearchAtomAssignsBuds {
	id: number;
	bud: number;
	phrase: string;
	value: string;
}
export interface ResultSearchAtomAssigns {
	$page: ReturnSearchAtomAssigns$page[];
	buds: ReturnSearchAtomAssignsBuds[];
}

export interface ParamGetPendSheet {
	sheet: string;
}
export interface ReturnGetPendSheet$page {
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
export interface ResultGetPendSheet {
	$page: ReturnGetPendSheet$page[];
}

export interface ParamGetSheet {
	id: number;
	assigns: string;
}
export interface ReturnGetSheetMain {
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
export interface ReturnGetSheetDetails {
	id: number;
	base: number;
	item: number;
	origin: number;
	value: number;
	v1: number;
	v2: number;
	v3: number;
}
export interface ReturnGetSheetAssigns {
	id: number;
	assign: number;
	phrase: string;
	int: number;
	dec: number;
}
export interface ResultGetSheet {
	main: ReturnGetSheetMain[];
	details: ReturnGetSheetDetails[];
	assigns: ReturnGetSheetAssigns[];
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

export interface UserSite extends ID {
	user: number;
	site: number;
}

export interface UserSiteInActs extends ID {
	ID?: UqID<any>;
	user: number | ID;
	site: number | ID;
}

export interface SitePhrase extends ID {
	site: number;
	phrase: number;
}

export interface SitePhraseInActs extends ID {
	ID?: UqID<any>;
	site: number | ID;
	phrase: number | ID;
}

export interface BindAtom extends ID {
	base: number;
	atom: number;
}

export interface BindAtomInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
	atom: number | ID;
}

export interface BindPhraseTo extends ID {
	base: number;
	to: number;
}

export interface BindPhraseToInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
	to: number | ID;
}

export interface Atom extends ID {
	base: number;
	no: string;
	ex: string;
}

export interface AtomInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
	no: string;
	ex: string;
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

export interface Subject extends ID {
	base: number;
	atom: number;
}

export interface SubjectInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
	atom: number | ID;
}

export interface User extends ID {
	tonwaUser: number;
}

export interface UserInActs extends ID {
	ID?: UqID<any>;
	tonwaUser: number;
}

export interface Site extends ID {
	no: string;
	ex: string;
}

export const Site = {
}

export interface SiteInActs extends ID {
	ID?: UqID<any>;
	no: string;
	ex: string;
}

export interface Group extends ID {
	base: number;
	no: string;
	ex: string;
}

export interface GroupInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
	no: string;
	ex: string;
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
	subject: string;
}
export interface ReturnReportStorage$page {
	atom: number;
	value: number;
	init: number;
}
export interface ResultReportStorage {
	$page: ReturnReportStorage$page[];
}

export interface ParamHistoryStorage {
	atomId: number;
	subject: string;
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
	history?: HistoryInActs[];
	ixProp?: IxProp[];
	userSite?: UserSiteInActs[];
	sitePhrase?: SitePhraseInActs[];
	bindAtom?: BindAtomInActs[];
	bindPhraseTo?: BindPhraseToInActs[];
	atom?: AtomInActs[];
	sheet?: SheetInActs[];
	detail?: DetailInActs[];
	subject?: SubjectInActs[];
	user?: UserInActs[];
	site?: SiteInActs[];
	group?: GroupInActs[];
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
	MyUnits: UqQuery<ParamMyUnits, ResultMyUnits>;
	SaveAtom: UqAction<ParamSaveAtom, ResultSaveAtom>;
	SaveAssign: UqAction<ParamSaveAssign, ResultSaveAssign>;
	SaveProp: UqAction<ParamSaveProp, ResultSaveProp>;
	SaveSheet: UqAction<ParamSaveSheet, ResultSaveSheet>;
	SaveDetail: UqAction<ParamSaveDetail, ResultSaveDetail>;
	RemoveDraft: UqAction<ParamRemoveDraft, ResultRemoveDraft>;
	GetMyDrafts: UqQuery<ParamGetMyDrafts, ResultGetMyDrafts>;
	SearchAtom: UqQuery<ParamSearchAtom, ResultSearchAtom>;
	SearchAtomProps: UqQuery<ParamSearchAtomProps, ResultSearchAtomProps>;
	SearchAtomAssigns: UqQuery<ParamSearchAtomAssigns, ResultSearchAtomAssigns>;
	GetPendSheet: UqQuery<ParamGetPendSheet, ResultGetPendSheet>;
	GetSheet: UqQuery<ParamGetSheet, ResultGetSheet>;
	History: UqID<any>;
	IxProp: UqIX<any>;
	UserSite: UqID<any>;
	SitePhrase: UqID<any>;
	BindAtom: UqID<any>;
	BindPhraseTo: UqID<any>;
	Atom: UqID<any>;
	Sheet: UqID<any>;
	Detail: UqID<any>;
	Subject: UqID<any>;
	User: UqID<any>;
	Site: UqID<any>;
	Group: UqID<any>;
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
    "saveatom": {
        "name": "SaveAtom",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "atom",
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
    "saveassign": {
        "name": "SaveAssign",
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
    "searchatom": {
        "name": "SearchAtom",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "atom",
                "type": "char",
                "size": 200
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
    "searchatomprops": {
        "name": "SearchAtomProps",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "atom",
                "type": "char",
                "size": 200
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
                "name": "buds",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "bud",
                        "type": "id"
                    },
                    {
                        "name": "phrase",
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
    "searchatomassigns": {
        "name": "SearchAtomAssigns",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "atom",
                "type": "char",
                "size": 200
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
                "name": "buds",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "bud",
                        "type": "id"
                    },
                    {
                        "name": "phrase",
                        "type": "char",
                        "size": 200
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
    "getpendsheet": {
        "name": "GetPendSheet",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "sheet",
                "type": "char",
                "size": 200
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
    "getsheet": {
        "name": "GetSheet",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id"
            },
            {
                "name": "assigns",
                "type": "char",
                "size": 200
            }
        ],
        "returns": [
            {
                "name": "main",
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
                ]
            },
            {
                "name": "details",
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
            },
            {
                "name": "assigns",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "assign",
                        "type": "id"
                    },
                    {
                        "name": "phrase",
                        "type": "char",
                        "size": 200
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
                    }
                ]
            }
        ]
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
    "usersite": {
        "name": "UserSite",
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
                "name": "site",
                "type": "id"
            }
        ],
        "keys": [
            {
                "name": "user",
                "type": "id"
            },
            {
                "name": "site",
                "type": "id"
            }
        ],
        "global": false,
        "idType": 3,
        "isMinute": false
    },
    "sitephrase": {
        "name": "SitePhrase",
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
                "name": "site",
                "type": "id"
            },
            {
                "name": "phrase",
                "type": "id"
            }
        ],
        "keys": [
            {
                "name": "site",
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
    "bindatom": {
        "name": "BindAtom",
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
                "name": "atom",
                "type": "id"
            }
        ],
        "keys": [
            {
                "name": "base",
                "type": "id"
            },
            {
                "name": "atom",
                "type": "id"
            }
        ],
        "global": false,
        "idType": 3,
        "isMinute": false
    },
    "bindphraseto": {
        "name": "BindPhraseTo",
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
                "name": "to",
                "type": "id"
            }
        ],
        "keys": [
            {
                "name": "base",
                "type": "id"
            },
            {
                "name": "to",
                "type": "id"
            }
        ],
        "global": false,
        "idType": 3,
        "isMinute": false
    },
    "atom": {
        "name": "Atom",
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
                "name": "base",
                "type": "id"
            },
            {
                "name": "atom",
                "type": "id"
            }
        ],
        "keys": [
            {
                "name": "base",
                "type": "id"
            },
            {
                "name": "atom",
                "type": "id"
            }
        ],
        "global": false,
        "idType": 3,
        "isMinute": false
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
    "site": {
        "name": "Site",
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
                "name": "ex",
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
    "group": {
        "name": "Group",
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
                "size": 100
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
            },
            {
                "name": "subject",
                "type": "char",
                "size": 200
            }
        ],
        "returns": [
            {
                "name": "$page",
                "fields": [
                    {
                        "name": "atom",
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
                "name": "atomId",
                "type": "id"
            },
            {
                "name": "subject",
                "type": "char",
                "size": 200
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
            "assigns": [] as any
        },
        "$unit": {
            "name": "$unit",
            "type": "$unit",
            "props": [] as any,
            "assigns": [] as any
        },
        "b": {
            "name": "b",
            "type": "atom",
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
            "assigns": [
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
            "assigns": [
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
            "type": "atom",
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
            "assigns": [] as any,
            "states": [
                {
                    "name": "可用",
                    "type": "atomstate"
                },
                {
                    "name": "禁用",
                    "type": "atomstate"
                },
                {
                    "name": "经理级别可见",
                    "type": "atomstate"
                }
            ]
        },
        "product": {
            "name": "product",
            "type": "atom",
            "caption": "产品",
            "props": [
                {
                    "name": "厂家",
                    "type": "ID",
                    "atom": "contact"
                }
            ],
            "assigns": [
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
            "type": "atom",
            "props": [
                {
                    "name": "效期",
                    "type": "date"
                }
            ],
            "assigns": [] as any,
            "states": [] as any
        },
        "customergroup": {
            "name": "customergroup",
            "type": "group",
            "caption": "客户分组",
            "props": [] as any,
            "assigns": [] as any
        },
        "vendorgroup": {
            "name": "vendorgroup",
            "type": "group",
            "caption": "供应商分组",
            "props": [] as any,
            "assigns": [] as any
        },
        "销售员": {
            "name": "销售员",
            "type": "permit",
            "props": [] as any,
            "assigns": [] as any
        },
        "入库员": {
            "name": "入库员",
            "type": "permit",
            "props": [] as any,
            "assigns": [] as any
        },
        "检验员": {
            "name": "检验员",
            "type": "permit",
            "props": [] as any,
            "assigns": [] as any
        },
        "经理": {
            "name": "经理",
            "type": "role",
            "props": [] as any,
            "assigns": [] as any
        },
        "销售部经理": {
            "name": "销售部经理",
            "type": "role",
            "props": [] as any,
            "assigns": [] as any
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
            "assigns": [] as any
        },
        "purchase": {
            "name": "purchase",
            "type": "sheet",
            "caption": "采购单",
            "props": [] as any,
            "assigns": [] as any,
            "details": [
                {
                    "name": "detail",
                    "props": [] as any,
                    "assigns": [
                        {
                            "name": "done",
                            "type": "dec"
                        }
                    ]
                }
            ],
            "states": [
                {
                    "name": "$start",
                    "props": [] as any,
                    "assigns": [] as any,
                    "acts": [
                        {
                            "name": "$act"
                        }
                    ]
                },
                {
                    "name": "s1",
                    "props": [] as any,
                    "assigns": [] as any,
                    "acts": [] as any
                }
            ]
        },
        "sale": {
            "name": "sale",
            "type": "sheet",
            "caption": "销售单",
            "props": [] as any,
            "assigns": [] as any,
            "details": [
                {
                    "name": "detail",
                    "props": [] as any,
                    "assigns": [] as any
                }
            ],
            "states": [
                {
                    "name": "$start",
                    "props": [] as any,
                    "assigns": [] as any,
                    "acts": [
                        {
                            "name": "$act"
                        }
                    ]
                }
            ]
        },
        "storein": {
            "name": "storein",
            "type": "sheet",
            "caption": "入库单",
            "props": [] as any,
            "assigns": [] as any,
            "details": [
                {
                    "name": "detail",
                    "props": [] as any,
                    "assigns": [] as any
                }
            ],
            "states": [
                {
                    "name": "$start",
                    "props": [] as any,
                    "assigns": [] as any,
                    "acts": [
                        {
                            "name": "$act"
                        }
                    ]
                }
            ]
        },
        "storeout": {
            "name": "storeout",
            "type": "sheet",
            "caption": "出库单",
            "props": [] as any,
            "assigns": [] as any,
            "details": [
                {
                    "name": "detail",
                    "props": [] as any,
                    "assigns": [] as any
                }
            ],
            "states": [
                {
                    "name": "$start",
                    "props": [] as any,
                    "assigns": [] as any,
                    "acts": [
                        {
                            "name": "$act"
                        }
                    ]
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
            "assigns": [
                {
                    "name": "流水",
                    "type": "char",
                    "caption": "下一步",
                    "value": "s2"
                }
            ],
            "details": [
                {
                    "name": "detail",
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
                    "assigns": [] as any
                }
            ],
            "states": [
                {
                    "name": "$start",
                    "props": [] as any,
                    "assigns": [] as any,
                    "acts": [
                        {
                            "name": "$act"
                        }
                    ]
                },
                {
                    "name": "s0",
                    "props": [] as any,
                    "assigns": [
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
                    "assigns": [] as any,
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
                    "assigns": [] as any,
                    "acts": [
                        {
                            "name": "procstoreout2"
                        }
                    ]
                }
            ]
        },
        "storage": {
            "name": "storage",
            "type": "subject",
            "caption": "库存",
            "props": [] as any,
            "assigns": [] as any
        }
    }
}