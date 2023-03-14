//=== UqApp builder created on Tue Mar 14 2023 16:01:21 GMT-0400 (Eastern Daylight Time) ===//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IDXValue, Uq, UqQuery, UqAction, UqID, UqIX } from "tonwa-uq";
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

export interface ParamBookSheetPurchase {
	id: number;
}
export interface ResultBookSheetPurchase {
}

export interface ParamBookSheetStoreIn {
	id: number;
}
export interface ResultBookSheetStoreIn {
}

export interface ParamBookSheetSale {
	id: number;
}
export interface ResultBookSheetSale {
}

export interface ParamBookSheetStoreOut {
	id: number;
}
export interface ResultBookSheetStoreOut {
}

export interface ParamSaveProduct {
	pNo: string;
	name: string;
}
export interface ReturnSaveProductRet {
	id: number;
}
export interface ResultSaveProduct {
	ret: ReturnSaveProductRet[];
}

export interface ParamSaveContact {
	pNo: string;
	name: string;
}
export interface ReturnSaveContactRet {
	id: number;
}
export interface ResultSaveContact {
	ret: ReturnSaveContactRet[];
}

export enum ProjectType {
	Storage = 201
}

export interface Project extends ID {
	type: any;
	item: number;
}

export interface ProjectInActs extends ID {
	ID?: UqID<any>;
	type: any;
	item: number | ID;
}

export interface History extends ID {
	project: number;
	value: number;
	ref: number;
}

export interface HistoryInActs extends ID {
	ID?: UqID<any>;
	project: number | ID;
	value: number;
	ref: number | ID;
}

export interface ParamGetDetails {
	id: number;
}
export interface ReturnGetDetailsRet {
	id: number;
	sheet: number;
	item: number;
	value: number;
}
export interface ResultGetDetails {
	ret: ReturnGetDetailsRet[];
}

export interface ParamGetDetailQPAs {
	id: number;
}
export interface ReturnGetDetailQPAsRet {
	id: number;
	sheet: number;
	item: number;
	quantity: number;
	price: number;
	amount: number;
}
export interface ResultGetDetailQPAs {
	ret: ReturnGetDetailQPAsRet[];
}

export interface ParamGetDetailOrigin {
	id: number;
}
export interface ReturnGetDetailOriginRet {
	id: number;
	sheet: number;
	origin: number;
	value: number;
	originSheet: number;
	originItem: number;
	originValue: number;
	originRowCount: number;
}
export interface ResultGetDetailOrigin {
	ret: ReturnGetDetailOriginRet[];
}

export interface ParamGetDetailFromOrigin {
	id: number;
}
export interface ReturnGetDetailFromOriginRet {
	origin: number;
	originSheet: number;
	originItem: number;
	originValue: number;
	done: number;
}
export interface ResultGetDetailFromOrigin {
	ret: ReturnGetDetailFromOriginRet[];
}

export interface ParamGetDetailOriginQPAs {
	id: number;
}
export interface ReturnGetDetailOriginQPAsRet {
	id: number;
	sheet: number;
	origin: number;
	value: number;
	originSheet: number;
	originItem: number;
	originQuantity: number;
	originPrice: number;
	originAmount: number;
	originRowCount: number;
}
export interface ResultGetDetailOriginQPAs {
	ret: ReturnGetDetailOriginQPAsRet[];
}

export interface ParamGetDetailQPAsFromOrigin {
	id: number;
}
export interface ReturnGetDetailQPAsFromOriginRet {
	origin: number;
	originSheet: number;
	originItem: number;
	originQuantity: number;
	originPrice: number;
	originAmount: number;
	done: number;
}
export interface ResultGetDetailQPAsFromOrigin {
	ret: ReturnGetDetailQPAsFromOriginRet[];
}

export interface ParamSearchProduct {
	key: string;
}
export interface ReturnSearchProduct$page {
	id: number;
	no: string;
	name: string;
}
export interface ResultSearchProduct {
	$page: ReturnSearchProduct$page[];
}

export interface ParamSearchProductForPurchase {
	key: string;
}
export interface ReturnSearchProductForPurchase$page {
	id: number;
	no: string;
	name: string;
}
export interface ResultSearchProductForPurchase {
	$page: ReturnSearchProductForPurchase$page[];
}

export interface ParamSearchProductForSale {
	key: string;
}
export interface ReturnSearchProductForSale$page {
	id: number;
	no: string;
	name: string;
	price: number;
}
export interface ResultSearchProductForSale {
	$page: ReturnSearchProductForSale$page[];
}

export interface ParamSp {
}
export interface ResultSp {
}

export interface ParamSearchContact {
	key: string;
}
export interface ReturnSearchContact$page {
	id: number;
	no: string;
	name: string;
}
export interface ResultSearchContact {
	$page: ReturnSearchContact$page[];
}

export interface ParamSearchStoreIn {
	key: string;
}
export interface ReturnSearchStoreIn$page {
	id: number;
	target: number;
}
export interface ResultSearchStoreIn {
	$page: ReturnSearchStoreIn$page[];
}

export interface ParamSearchStoreOut {
	key: string;
}
export interface ReturnSearchStoreOut$page {
	id: number;
	target: number;
}
export interface ResultSearchStoreOut {
	$page: ReturnSearchStoreOut$page[];
}

export interface Product extends ID {
	no?: string;
	name: string;
}

export interface ProductInActs extends ID {
	ID?: UqID<any>;
	no?: string;
	name: string;
}

export interface Contact extends ID {
	no?: string;
	name: string;
}

export interface ContactInActs extends ID {
	ID?: UqID<any>;
	no?: string;
	name: string;
}

export enum ContactType {
	vendor = 1,
	customer = 2
}

export interface Batch extends ID {
	product: number;
	no?: string;
	date: any;
	before: any;
}

export interface BatchInActs extends ID {
	ID?: UqID<any>;
	product: number | ID;
	no?: string;
	date: any;
	before: any;
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

export interface SheetPurchase extends ID {
	no?: string;
	target: number;
}

export interface SheetPurchaseInActs extends ID {
	ID?: UqID<any>;
	no?: string;
	target: number | ID;
}

export interface SheetSale extends ID {
	no?: string;
	target: number;
}

export interface SheetSaleInActs extends ID {
	ID?: UqID<any>;
	no?: string;
	target: number | ID;
}

export interface SheetStoreIn extends ID {
	no?: string;
	operator: number;
}

export interface SheetStoreInInActs extends ID {
	ID?: UqID<any>;
	no?: string;
	operator: number | ID;
}

export interface SheetStoreOut extends ID {
	no?: string;
	operator: number;
}

export interface SheetStoreOutInActs extends ID {
	ID?: UqID<any>;
	no?: string;
	operator: number | ID;
}

export interface Detail extends ID {
	sheet: number;
	item: number;
	value: number;
}

export interface DetailInActs extends ID {
	ID?: UqID<any>;
	sheet: number | ID;
	item: number | ID;
	value: number;
}

export interface DetailQPA extends ID {
	sheet: number;
	item: number;
	quantity: number;
	price: number;
	amount: number;
}

export interface DetailQPAInActs extends ID {
	ID?: UqID<any>;
	sheet: number | ID;
	item: number | ID;
	quantity: number;
	price: number;
	amount: number;
}

export interface DetailOrigin extends ID {
	sheet: number;
	origin: number;
	value: number;
}

export interface DetailOriginInActs extends ID {
	ID?: UqID<any>;
	sheet: number | ID;
	origin: number | ID;
	value: number;
}

export interface IxMySheet extends IX {
}

export enum PriceType {
	listSale = 101
}

export interface PriceName extends ID {
	target: number;
	type: any;
}

export interface PriceNameInActs extends ID {
	ID?: UqID<any>;
	target: number | ID;
	type: any;
}

export interface ParamReportStorage {
	key: string;
}
export interface ReturnReportStorage$page {
	product: number;
	value: number;
	init: number;
}
export interface ResultReportStorage {
	$page: ReturnReportStorage$page[];
}

export interface ParamHistoryStorage {
	project: number;
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
	project?: ProjectInActs[];
	history?: HistoryInActs[];
	product?: ProductInActs[];
	contact?: ContactInActs[];
	batch?: BatchInActs[];
	measureUnitName?: MeasureUnitNameInActs[];
	measureUnit?: MeasureUnitInActs[];
	unitItem?: UnitItemInActs[];
	sheetPurchase?: SheetPurchaseInActs[];
	sheetSale?: SheetSaleInActs[];
	sheetStoreIn?: SheetStoreInInActs[];
	sheetStoreOut?: SheetStoreOutInActs[];
	detail?: DetailInActs[];
	detailQPA?: DetailQPAInActs[];
	detailOrigin?: DetailOriginInActs[];
	ixMySheet?: IxMySheet[];
	priceName?: PriceNameInActs[];
}


export interface UqExt extends Uq {
	Acts(param:ParamActs): Promise<any>;
	SQL: Uq;
    Role: { [key: string]: string[] };

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
	BookSheetPurchase: UqAction<ParamBookSheetPurchase, ResultBookSheetPurchase>;
	BookSheetStoreIn: UqAction<ParamBookSheetStoreIn, ResultBookSheetStoreIn>;
	BookSheetSale: UqAction<ParamBookSheetSale, ResultBookSheetSale>;
	BookSheetStoreOut: UqAction<ParamBookSheetStoreOut, ResultBookSheetStoreOut>;
	SaveProduct: UqAction<ParamSaveProduct, ResultSaveProduct>;
	SaveContact: UqAction<ParamSaveContact, ResultSaveContact>;
	Project: UqID<any>;
	History: UqID<any>;
	GetDetails: UqQuery<ParamGetDetails, ResultGetDetails>;
	GetDetailQPAs: UqQuery<ParamGetDetailQPAs, ResultGetDetailQPAs>;
	GetDetailOrigin: UqQuery<ParamGetDetailOrigin, ResultGetDetailOrigin>;
	GetDetailFromOrigin: UqQuery<ParamGetDetailFromOrigin, ResultGetDetailFromOrigin>;
	GetDetailOriginQPAs: UqQuery<ParamGetDetailOriginQPAs, ResultGetDetailOriginQPAs>;
	GetDetailQPAsFromOrigin: UqQuery<ParamGetDetailQPAsFromOrigin, ResultGetDetailQPAsFromOrigin>;
	SearchProduct: UqQuery<ParamSearchProduct, ResultSearchProduct>;
	SearchProductForPurchase: UqQuery<ParamSearchProductForPurchase, ResultSearchProductForPurchase>;
	SearchProductForSale: UqQuery<ParamSearchProductForSale, ResultSearchProductForSale>;
	Sp: UqAction<ParamSp, ResultSp>;
	SearchContact: UqQuery<ParamSearchContact, ResultSearchContact>;
	SearchStoreIn: UqQuery<ParamSearchStoreIn, ResultSearchStoreIn>;
	SearchStoreOut: UqQuery<ParamSearchStoreOut, ResultSearchStoreOut>;
	Product: UqID<any>;
	Contact: UqID<any>;
	Batch: UqID<any>;
	MeasureUnitName: UqID<any>;
	MeasureUnit: UqID<any>;
	UnitItem: UqID<any>;
	SheetPurchase: UqID<any>;
	SheetSale: UqID<any>;
	SheetStoreIn: UqID<any>;
	SheetStoreOut: UqID<any>;
	Detail: UqID<any>;
	DetailQPA: UqID<any>;
	DetailOrigin: UqID<any>;
	IxMySheet: UqIX<any>;
	PriceName: UqID<any>;
	ReportStorage: UqQuery<ParamReportStorage, ResultReportStorage>;
	HistoryStorage: UqQuery<ParamHistoryStorage, ResultHistoryStorage>;
}


export const uqSchema={
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
    "booksheetpurchase": {
        "name": "BookSheetPurchase",
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
    "booksheetsale": {
        "name": "BookSheetSale",
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
    "saveproduct": {
        "name": "SaveProduct",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "pNo",
                "type": "char",
                "size": 20
            },
            {
                "name": "name",
                "type": "char",
                "size": 50
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
    "savecontact": {
        "name": "SaveContact",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "pNo",
                "type": "char",
                "size": 20
            },
            {
                "name": "name",
                "type": "char",
                "size": 50
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
    "projecttype": {
        "name": "ProjectType",
        "type": "enum",
        "private": false,
        "sys": true,
        "values": {
            "Storage": 201
        }
    },
    "project": {
        "name": "Project",
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
                "name": "type",
                "type": "enum"
            },
            {
                "name": "item",
                "type": "id"
            }
        ],
        "keys": [
            {
                "name": "type",
                "type": "enum"
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
                "name": "project",
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
                        "name": "sheet",
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
                    }
                ]
            }
        ]
    },
    "getdetailqpas": {
        "name": "GetDetailQPAs",
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
                        "name": "sheet",
                        "type": "id"
                    },
                    {
                        "name": "item",
                        "type": "id"
                    },
                    {
                        "name": "quantity",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "price",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "amount",
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
                        "name": "sheet",
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
                        "name": "originRowCount",
                        "type": "int"
                    }
                ]
            }
        ]
    },
    "getdetailfromorigin": {
        "name": "GetDetailFromOrigin",
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
                        "name": "origin",
                        "type": "id"
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
                        "name": "done",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    }
                ]
            }
        ]
    },
    "getdetailoriginqpas": {
        "name": "GetDetailOriginQPAs",
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
                        "name": "sheet",
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
                        "name": "originSheet",
                        "type": "id"
                    },
                    {
                        "name": "originItem",
                        "type": "id"
                    },
                    {
                        "name": "originQuantity",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "originPrice",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "originAmount",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "originRowCount",
                        "type": "int"
                    }
                ]
            }
        ]
    },
    "getdetailqpasfromorigin": {
        "name": "GetDetailQPAsFromOrigin",
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
                        "name": "origin",
                        "type": "id"
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
                        "name": "originQuantity",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "originPrice",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "originAmount",
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
    "searchproduct": {
        "name": "SearchProduct",
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
                        "name": "name",
                        "type": "char",
                        "size": 50
                    }
                ],
                "order": "desc"
            }
        ]
    },
    "searchproductforpurchase": {
        "name": "SearchProductForPurchase",
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
                        "name": "name",
                        "type": "char",
                        "size": 50
                    }
                ],
                "order": "desc"
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
                        "name": "name",
                        "type": "char",
                        "size": 50
                    },
                    {
                        "name": "price",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    }
                ],
                "order": "desc"
            }
        ]
    },
    "sp": {
        "name": "Sp",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [] as any,
        "returns": [] as any
    },
    "searchcontact": {
        "name": "SearchContact",
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
                        "name": "name",
                        "type": "char",
                        "size": 50
                    }
                ],
                "order": "desc"
            }
        ]
    },
    "searchstorein": {
        "name": "SearchStoreIn",
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
                        "name": "target",
                        "type": "id"
                    }
                ],
                "order": "asc"
            }
        ]
    },
    "searchstoreout": {
        "name": "SearchStoreOut",
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
                        "name": "target",
                        "type": "id"
                    }
                ],
                "order": "asc"
            }
        ]
    },
    "product": {
        "name": "Product",
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
                "name": "name",
                "type": "char",
                "size": 50
            }
        ],
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
    "contact": {
        "name": "Contact",
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
                "name": "name",
                "type": "char",
                "size": 100
            }
        ],
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
    "contacttype": {
        "name": "ContactType",
        "type": "enum",
        "private": false,
        "sys": true,
        "values": {
            "vendor": 1,
            "customer": 2
        }
    },
    "batch": {
        "name": "Batch",
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
                "name": "product",
                "type": "id"
            },
            {
                "name": "no",
                "type": "char",
                "size": 20
            },
            {
                "name": "date",
                "type": "date"
            },
            {
                "name": "before",
                "type": "date"
            }
        ],
        "keys": [
            {
                "name": "product",
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
    "sheetpurchase": {
        "name": "SheetPurchase",
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
                "name": "target",
                "type": "id"
            }
        ],
        "keys": [
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
    "sheetsale": {
        "name": "SheetSale",
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
                "name": "target",
                "type": "id"
            }
        ],
        "keys": [
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
    "sheetstorein": {
        "name": "SheetStoreIn",
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
                "name": "operator",
                "type": "id"
            }
        ],
        "keys": [
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
    "sheetstoreout": {
        "name": "SheetStoreOut",
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
                "name": "operator",
                "type": "id"
            }
        ],
        "keys": [
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
                "name": "sheet",
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
            }
        ],
        "keys": [] as any,
        "global": false,
        "idType": 3,
        "isMinute": true
    },
    "detailqpa": {
        "name": "DetailQPA",
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
                "name": "sheet",
                "type": "id"
            },
            {
                "name": "item",
                "type": "id"
            },
            {
                "name": "quantity",
                "type": "dec",
                "scale": 4,
                "precision": 18
            },
            {
                "name": "price",
                "type": "dec",
                "scale": 4,
                "precision": 18
            },
            {
                "name": "amount",
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
    "detailorigin": {
        "name": "DetailOrigin",
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
                "name": "sheet",
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
            }
        ],
        "keys": [] as any,
        "global": false,
        "idType": 3,
        "isMinute": true
    },
    "ixmysheet": {
        "name": "IxMySheet",
        "type": "ix",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "ix",
                "type": "id",
                "ID": "$user",
                "tuid": "$user"
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
    "pricetype": {
        "name": "PriceType",
        "type": "enum",
        "private": false,
        "sys": true,
        "values": {
            "listSale": 101
        }
    },
    "pricename": {
        "name": "PriceName",
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
                "name": "target",
                "type": "id"
            },
            {
                "name": "type",
                "type": "enum"
            }
        ],
        "keys": [
            {
                "name": "target",
                "type": "id"
            },
            {
                "name": "type",
                "type": "enum"
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
                        "name": "product",
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
                "name": "project",
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
    }
}