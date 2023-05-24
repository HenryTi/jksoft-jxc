//=== UqApp builder created on Tue May 23 2023 16:52:21 GMT-0400 (Eastern Daylight Time) ===//
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
	Metric = 'metric',
	MetricItem = 'metricitem',
	AtomMetric = 'atommetric',
	AtomMetricSpec = 'atommetricspec',
	UserSite = 'usersite',
	SitePhrase = 'sitephrase',
	BindPhraseTo = 'bindphraseto',
	History = 'history',
	Tie = 'tie',
	Formula = 'formula',
	Atom = 'atom',
	Sheet = 'sheet',
	Detail = 'detail',
	Pend = 'pend',
	Subject = 'subject',
	User = 'user',
	Site = 'site',
	Tree = 'tree',
}

export interface $phrase extends ID {
	name: string;
	caption: string;
	base: number;
	valid: number;
}

export interface $phraseInActs extends ID {
	ID?: UqID<any>;
	name: string;
	caption: string;
	base: number;
	valid: number;
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

export interface ParamSaveSpec {
	spec: string;
	atom: number;
	values: string;
}
export interface ReturnSaveSpecRet {
	id: number;
}
export interface ResultSaveSpec {
	ret: ReturnSaveSpecRet[];
}

export interface ParamSaveSheet {
	sheet: string;
	no: string;
	target: number;
	value: number;
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
	target: number;
	origin: number;
	value: number;
	v1: number;
	v2: number;
	v3: number;
	pendFrom: number;
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
	target: number;
	operator: number;
	value: number;
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
	phrase: string;
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
	phrase: string;
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
	phrase: string;
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
	target: number;
	operator: number;
	value: number;
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
	target: number;
	operator: number;
	value: number;
}
export interface ReturnGetSheetDetails {
	id: number;
	base: number;
	item: number;
	target: number;
	origin: number;
	value: number;
	v1: number;
	v2: number;
	v3: number;
	done: number;
	pendFrom: number;
	pendValue: number;
	sheet: string;
	no: string;
	atom: string;
	atomId: number;
	atomNo: string;
	atomEx: string;
	atomMetric: number;
	metric: number;
	metricNo: string;
	metricEx: string;
	spec: number;
	specValues: string;
}
export interface ReturnGetSheetOrigins {
	id: number;
	base: number;
	item: number;
	target: number;
	origin: number;
	value: number;
	v1: number;
	v2: number;
	v3: number;
	done: number;
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
	origins: ReturnGetSheetOrigins[];
	assigns: ReturnGetSheetAssigns[];
}

export interface ParamGetAtom {
	id: number;
}
export interface ReturnGetAtomMain {
	id: number;
	phrase: string;
	no: string;
	ex: string;
}
export interface ReturnGetAtomBuds {
	bud: number;
	phrase: string;
	value: string;
}
export interface ResultGetAtom {
	main: ReturnGetAtomMain[];
	buds: ReturnGetAtomBuds[];
}

export enum MetricType {
	count = 1,
	length = 2,
	area = 3,
	volume = 4,
	weight = 5,
	time = 6,
	currency = 7
}

export const CurrencyName = {
	cny: "cny",
	usd: "usd",
	jpy: "jpy"
}

export interface Metric extends ID {
	base: number;
	no: string;
	ex: string;
	type: any;
	template: number;
}

export const Metric = {
}

export interface MetricInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
	no: string;
	ex: string;
	type: any;
	template: number | ID;
}

export interface MetricItem extends ID {
	base: number;
	no: string;
	ex: string;
	div: number;
	value: number;
	template: number;
}

export const MetricItem = {
}

export interface MetricItemInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
	no: string;
	ex: string;
	div: number | ID;
	value: number;
	template: number | ID;
}

export interface AtomMetric extends ID {
	atom: number;
	metricItem: number;
}

export interface AtomMetricInActs extends ID {
	ID?: UqID<any>;
	atom: number | ID;
	metricItem: number | ID;
}

export interface AtomMetricSpec extends ID {
	atomMetric: number;
	spec: number;
}

export interface AtomMetricSpecInActs extends ID {
	ID?: UqID<any>;
	atomMetric: number | ID;
	spec: number | ID;
}

export interface ParamSaveMetric {
	id: number;
	no: string;
	ex: string;
	type: any;
	template: number;
}
export interface ReturnSaveMetricRet {
	id: number;
}
export interface ResultSaveMetric {
	ret: ReturnSaveMetricRet[];
}

export interface ParamSaveMetricItem {
	atom: number;
	id: number;
	base: number;
	no: string;
	ex: string;
	div: number;
	value: number;
	template: number;
	metricType: any;
	metricTemplate: number;
}
export interface ReturnSaveMetricItemRet {
	id: number;
	metric: number;
	atomMetric: number;
}
export interface ResultSaveMetricItem {
	ret: ReturnSaveMetricItemRet[];
}

export interface ParamSaveAtomMetric {
	atom: number;
	metricItem: number;
}
export interface ReturnSaveAtomMetricRet {
	id: number;
}
export interface ResultSaveAtomMetric {
	ret: ReturnSaveAtomMetricRet[];
}

export interface ParamSaveAtomMetricSpec {
	atomMetric: number;
	spec: number;
}
export interface ReturnSaveAtomMetricSpecRet {
	id: number;
}
export interface ResultSaveAtomMetricSpec {
	ret: ReturnSaveAtomMetricSpecRet[];
}

export interface ParamGetAtomMetric {
	id: number;
}
export interface ReturnGetAtomMetricRet {
	id: number;
	base: number;
	no: string;
	ex: string;
	type: any;
	template: number;
}
export interface ReturnGetAtomMetricItems {
	id: number;
	base: number;
	no: string;
	ex: string;
	div: number;
	value: number;
	template: number;
}
export interface ResultGetAtomMetric {
	ret: ReturnGetAtomMetricRet[];
	items: ReturnGetAtomMetricItems[];
}

export interface ParamSearchMetricTemplate {
	key: string;
	metricType: any;
}
export interface ReturnSearchMetricTemplate$page {
	id: number;
	base: number;
	no: string;
	ex: string;
	type: any;
	template: number;
}
export interface ResultSearchMetricTemplate {
	$page: ReturnSearchMetricTemplate$page[];
}

export interface ParamGetMetricItems {
	id: number;
}
export interface ReturnGetMetricItemsRet {
	id: number;
	base: number;
	no: string;
	ex: string;
	div: number;
	value: number;
	template: number;
}
export interface ResultGetMetricItems {
	ret: ReturnGetMetricItemsRet[];
}

export interface ParamGetPendSheetFromNo {
	pend: string;
	key: string;
}
export interface ReturnGetPendSheetFromNo$page {
	id: number;
	base: number;
	no: string;
	target: number;
	operator: number;
	value: number;
	sheet: string;
}
export interface ResultGetPendSheetFromNo {
	$page: ReturnGetPendSheetFromNo$page[];
}

export interface ParamGetPendSheetFromTarget {
	pend: string;
	key: string;
}
export interface ReturnGetPendSheetFromTarget$page {
	id: number;
	base: number;
	no: string;
	target: number;
	operator: number;
	value: number;
	sheet: string;
}
export interface ResultGetPendSheetFromTarget {
	$page: ReturnGetPendSheetFromTarget$page[];
}

export interface ParamGetPendDetailFromItem {
	pend: string;
	key: string;
}
export interface ReturnGetPendDetailFromItem$page {
	id: number;
	base: number;
	item: number;
	target: number;
	origin: number;
	value: number;
	v1: number;
	v2: number;
	v3: number;
	pend: number;
	pendValue: number;
	sheet: string;
	no: string;
}
export interface ResultGetPendDetailFromItem {
	$page: ReturnGetPendDetailFromItem$page[];
}

export interface ParamGetPendDetailFromSheetId {
	pend: string;
	sheetId: number;
}
export interface ReturnGetPendDetailFromSheetIdRet {
	id: number;
	base: number;
	item: number;
	target: number;
	origin: number;
	value: number;
	v1: number;
	v2: number;
	v3: number;
	pend: number;
	pendValue: number;
	sheet: string;
	no: string;
}
export interface ResultGetPendDetailFromSheetId {
	ret: ReturnGetPendDetailFromSheetIdRet[];
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

export interface BindPhraseTo extends ID {
	base: number;
	to: number;
}

export interface BindPhraseToInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
	to: number | ID;
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

export interface Tie extends ID {
	base: number;
	atom: number;
}

export interface TieInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
	atom: number | ID;
}

export interface Formula extends ID {
	from: number;
	tiePhrase: number;
	to: number;
	radio: number;
}

export interface FormulaInActs extends ID {
	ID?: UqID<any>;
	from: number | ID;
	tiePhrase: number | ID;
	to: number | ID;
	radio: number;
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
	target: number;
	operator: number;
	value: number;
}

export interface SheetInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
	no: string;
	target: number | ID;
	operator: number | ID;
	value: number;
}

export interface Detail extends ID {
	base: number;
	item: number;
	target: number;
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
	target: number | ID;
	origin: number | ID;
	value: number;
	v1: number;
	v2: number;
	v3: number;
}

export interface Pend extends ID {
	base: number;
	detail: number;
	value: number;
}

export interface PendInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
	detail: number | ID;
	value: number;
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

export interface Tree extends ID {
	base: number;
	no: string;
	ex: string;
}

export interface TreeInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
	no: string;
	ex: string;
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
	sheetNo: string;
	sheetName: string;
	sheetCaption: string;
}
export interface ResultHistoryStorage {
	$page: ReturnHistoryStorage$page[];
}



export interface ParamActs {
	$phrase?: $phraseInActs[];
	metric?: MetricInActs[];
	metricItem?: MetricItemInActs[];
	atomMetric?: AtomMetricInActs[];
	atomMetricSpec?: AtomMetricSpecInActs[];
	ixProp?: IxProp[];
	userSite?: UserSiteInActs[];
	sitePhrase?: SitePhraseInActs[];
	bindPhraseTo?: BindPhraseToInActs[];
	history?: HistoryInActs[];
	tie?: TieInActs[];
	formula?: FormulaInActs[];
	atom?: AtomInActs[];
	sheet?: SheetInActs[];
	detail?: DetailInActs[];
	pend?: PendInActs[];
	subject?: SubjectInActs[];
	user?: UserInActs[];
	site?: SiteInActs[];
	tree?: TreeInActs[];
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
	SaveSpec: UqAction<ParamSaveSpec, ResultSaveSpec>;
	SaveSheet: UqAction<ParamSaveSheet, ResultSaveSheet>;
	SaveDetail: UqAction<ParamSaveDetail, ResultSaveDetail>;
	RemoveDraft: UqAction<ParamRemoveDraft, ResultRemoveDraft>;
	GetMyDrafts: UqQuery<ParamGetMyDrafts, ResultGetMyDrafts>;
	SearchAtom: UqQuery<ParamSearchAtom, ResultSearchAtom>;
	SearchAtomProps: UqQuery<ParamSearchAtomProps, ResultSearchAtomProps>;
	SearchAtomAssigns: UqQuery<ParamSearchAtomAssigns, ResultSearchAtomAssigns>;
	GetPendSheet: UqQuery<ParamGetPendSheet, ResultGetPendSheet>;
	GetSheet: UqQuery<ParamGetSheet, ResultGetSheet>;
	GetAtom: UqQuery<ParamGetAtom, ResultGetAtom>;
	Metric: UqID<any>;
	MetricItem: UqID<any>;
	AtomMetric: UqID<any>;
	AtomMetricSpec: UqID<any>;
	SaveMetric: UqAction<ParamSaveMetric, ResultSaveMetric>;
	SaveMetricItem: UqAction<ParamSaveMetricItem, ResultSaveMetricItem>;
	SaveAtomMetric: UqAction<ParamSaveAtomMetric, ResultSaveAtomMetric>;
	SaveAtomMetricSpec: UqAction<ParamSaveAtomMetricSpec, ResultSaveAtomMetricSpec>;
	GetAtomMetric: UqQuery<ParamGetAtomMetric, ResultGetAtomMetric>;
	SearchMetricTemplate: UqQuery<ParamSearchMetricTemplate, ResultSearchMetricTemplate>;
	GetMetricItems: UqQuery<ParamGetMetricItems, ResultGetMetricItems>;
	GetPendSheetFromNo: UqQuery<ParamGetPendSheetFromNo, ResultGetPendSheetFromNo>;
	GetPendSheetFromTarget: UqQuery<ParamGetPendSheetFromTarget, ResultGetPendSheetFromTarget>;
	GetPendDetailFromItem: UqQuery<ParamGetPendDetailFromItem, ResultGetPendDetailFromItem>;
	GetPendDetailFromSheetId: UqQuery<ParamGetPendDetailFromSheetId, ResultGetPendDetailFromSheetId>;
	IxProp: UqIX<any>;
	UserSite: UqID<any>;
	SitePhrase: UqID<any>;
	BindPhraseTo: UqID<any>;
	History: UqID<any>;
	Tie: UqID<any>;
	Formula: UqID<any>;
	Atom: UqID<any>;
	Sheet: UqID<any>;
	Detail: UqID<any>;
	Pend: UqID<any>;
	Subject: UqID<any>;
	User: UqID<any>;
	Site: UqID<any>;
	Tree: UqID<any>;
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
            },
            {
                "name": "caption",
                "type": "char",
                "size": 100
            },
            {
                "name": "base",
                "type": "bigint"
            },
            {
                "name": "valid",
                "type": "tinyint"
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
    "savespec": {
        "name": "SaveSpec",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "spec",
                "type": "char",
                "size": 100
            },
            {
                "name": "atom",
                "type": "id"
            },
            {
                "name": "values",
                "type": "char",
                "size": 300
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
                "name": "target",
                "type": "id"
            },
            {
                "name": "value",
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
                "name": "target",
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
                "name": "pendFrom",
                "type": "id"
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
                        "name": "target",
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
                    },
                    {
                        "name": "phrase",
                        "type": "char",
                        "size": 200
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
                    },
                    {
                        "name": "phrase",
                        "type": "char",
                        "size": 200
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
                        "name": "target",
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
                        "name": "target",
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
                        "name": "target",
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
                        "name": "done",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "pendFrom",
                        "type": "id"
                    },
                    {
                        "name": "pendValue",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "sheet",
                        "type": "char",
                        "size": 200
                    },
                    {
                        "name": "no",
                        "type": "char",
                        "size": 30
                    },
                    {
                        "name": "atom",
                        "type": "char",
                        "size": 200
                    },
                    {
                        "name": "atomId",
                        "type": "id"
                    },
                    {
                        "name": "atomNo",
                        "type": "char",
                        "size": 30
                    },
                    {
                        "name": "atomEx",
                        "type": "char",
                        "size": 200
                    },
                    {
                        "name": "atomMetric",
                        "type": "id"
                    },
                    {
                        "name": "metric",
                        "type": "id"
                    },
                    {
                        "name": "metricNo",
                        "type": "char",
                        "size": 30
                    },
                    {
                        "name": "metricEx",
                        "type": "char",
                        "size": 50
                    },
                    {
                        "name": "spec",
                        "type": "id"
                    },
                    {
                        "name": "specValues",
                        "type": "char",
                        "size": 200
                    }
                ]
            },
            {
                "name": "origins",
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
                        "name": "target",
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
                        "name": "done",
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
    "getatom": {
        "name": "GetAtom",
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
                "name": "main",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "phrase",
                        "type": "char",
                        "size": 200
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
                ]
            },
            {
                "name": "buds",
                "fields": [
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
    "metrictype": {
        "name": "MetricType",
        "type": "enum",
        "private": false,
        "sys": true,
        "values": {
            "count": 1,
            "length": 2,
            "area": 3,
            "volume": 4,
            "weight": 5,
            "time": 6,
            "currency": 7
        }
    },
    "currencyname": {
        "name": "CurrencyName",
        "type": "const",
        "private": false,
        "sys": true,
        "fields": [] as any,
        "values": {
            "cny": "cny",
            "usd": "usd",
            "jpy": "jpy"
        }
    },
    "metric": {
        "name": "Metric",
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
                "size": 50
            },
            {
                "name": "type",
                "type": "enum"
            },
            {
                "name": "template",
                "type": "id"
            }
        ],
        "values": {},
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
    "metricitem": {
        "name": "MetricItem",
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
                "type": "id",
                "ID": "metric",
                "tuid": "metric"
            },
            {
                "name": "no",
                "type": "char",
                "size": 20
            },
            {
                "name": "ex",
                "type": "char",
                "size": 50
            },
            {
                "name": "div",
                "type": "id",
                "ID": "metric",
                "tuid": "metric"
            },
            {
                "name": "value",
                "type": "dec",
                "scale": 4,
                "precision": 9
            },
            {
                "name": "template",
                "type": "id"
            }
        ],
        "values": {},
        "keys": [
            {
                "name": "base",
                "type": "id",
                "ID": "metric",
                "tuid": "metric"
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
    "atommetric": {
        "name": "AtomMetric",
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
                "name": "atom",
                "type": "id",
                "ID": "atom",
                "tuid": "atom"
            },
            {
                "name": "metricItem",
                "type": "id",
                "ID": "metricitem",
                "tuid": "metricitem"
            }
        ],
        "keys": [
            {
                "name": "atom",
                "type": "id",
                "ID": "atom",
                "tuid": "atom"
            },
            {
                "name": "metricItem",
                "type": "id",
                "ID": "metricitem",
                "tuid": "metricitem"
            }
        ],
        "global": false,
        "idType": 3,
        "isMinute": false
    },
    "atommetricspec": {
        "name": "AtomMetricSpec",
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
                "name": "atomMetric",
                "type": "id",
                "ID": "atommetric",
                "tuid": "atommetric"
            },
            {
                "name": "spec",
                "type": "id"
            }
        ],
        "keys": [
            {
                "name": "atomMetric",
                "type": "id",
                "ID": "atommetric",
                "tuid": "atommetric"
            },
            {
                "name": "spec",
                "type": "id"
            }
        ],
        "global": false,
        "idType": 3,
        "isMinute": false
    },
    "savemetric": {
        "name": "SaveMetric",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id"
            },
            {
                "name": "no",
                "type": "char",
                "size": 30
            },
            {
                "name": "ex",
                "type": "char",
                "size": 50
            },
            {
                "name": "type",
                "type": "enum"
            },
            {
                "name": "template",
                "type": "id"
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
    "savemetricitem": {
        "name": "SaveMetricItem",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "atom",
                "type": "id"
            },
            {
                "name": "id",
                "type": "id"
            },
            {
                "name": "base",
                "type": "id"
            },
            {
                "name": "no",
                "type": "char",
                "size": 30
            },
            {
                "name": "ex",
                "type": "char",
                "size": 50
            },
            {
                "name": "div",
                "type": "id",
                "ID": "metric",
                "tuid": "metric"
            },
            {
                "name": "value",
                "type": "dec",
                "scale": 4,
                "precision": 9
            },
            {
                "name": "template",
                "type": "id"
            },
            {
                "name": "metricType",
                "type": "enum"
            },
            {
                "name": "metricTemplate",
                "type": "id"
            }
        ],
        "returns": [
            {
                "name": "ret",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "metric",
                        "type": "id"
                    },
                    {
                        "name": "atomMetric",
                        "type": "id"
                    }
                ]
            }
        ]
    },
    "saveatommetric": {
        "name": "SaveAtomMetric",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "atom",
                "type": "id"
            },
            {
                "name": "metricItem",
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
                        "ID": "atommetric",
                        "tuid": "atommetric"
                    }
                ]
            }
        ]
    },
    "saveatommetricspec": {
        "name": "SaveAtomMetricSpec",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "atomMetric",
                "type": "id"
            },
            {
                "name": "spec",
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
                        "ID": "atommetricspec",
                        "tuid": "atommetricspec"
                    }
                ]
            }
        ]
    },
    "getatommetric": {
        "name": "GetAtomMetric",
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
                        "name": "no",
                        "type": "char",
                        "size": 20
                    },
                    {
                        "name": "ex",
                        "type": "char",
                        "size": 50
                    },
                    {
                        "name": "type",
                        "type": "enum"
                    },
                    {
                        "name": "template",
                        "type": "id"
                    }
                ]
            },
            {
                "name": "items",
                "fields": [
                    {
                        "name": "id",
                        "type": "id",
                        "null": false
                    },
                    {
                        "name": "base",
                        "type": "id",
                        "ID": "metric",
                        "tuid": "metric"
                    },
                    {
                        "name": "no",
                        "type": "char",
                        "size": 20
                    },
                    {
                        "name": "ex",
                        "type": "char",
                        "size": 50
                    },
                    {
                        "name": "div",
                        "type": "id",
                        "ID": "metric",
                        "tuid": "metric"
                    },
                    {
                        "name": "value",
                        "type": "dec",
                        "scale": 4,
                        "precision": 9
                    },
                    {
                        "name": "template",
                        "type": "id"
                    }
                ]
            }
        ]
    },
    "searchmetrictemplate": {
        "name": "SearchMetricTemplate",
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
                "name": "metricType",
                "type": "enum"
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
                        "name": "ex",
                        "type": "char",
                        "size": 50
                    },
                    {
                        "name": "type",
                        "type": "enum"
                    },
                    {
                        "name": "template",
                        "type": "id"
                    }
                ],
                "order": "asc"
            }
        ]
    },
    "getmetricitems": {
        "name": "GetMetricItems",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id",
                "ID": "metric",
                "tuid": "metric"
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
                        "type": "id",
                        "ID": "metric",
                        "tuid": "metric"
                    },
                    {
                        "name": "no",
                        "type": "char",
                        "size": 20
                    },
                    {
                        "name": "ex",
                        "type": "char",
                        "size": 50
                    },
                    {
                        "name": "div",
                        "type": "id",
                        "ID": "metric",
                        "tuid": "metric"
                    },
                    {
                        "name": "value",
                        "type": "dec",
                        "scale": 4,
                        "precision": 9
                    },
                    {
                        "name": "template",
                        "type": "id"
                    }
                ]
            }
        ]
    },
    "getpendsheetfromno": {
        "name": "GetPendSheetFromNo",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "pend",
                "type": "char",
                "size": 200
            },
            {
                "name": "key",
                "type": "char",
                "size": 100
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
                        "name": "target",
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
                        "name": "sheet",
                        "type": "char",
                        "size": 200
                    }
                ],
                "order": "asc"
            }
        ]
    },
    "getpendsheetfromtarget": {
        "name": "GetPendSheetFromTarget",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "pend",
                "type": "char",
                "size": 200
            },
            {
                "name": "key",
                "type": "char",
                "size": 100
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
                        "name": "target",
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
                        "name": "sheet",
                        "type": "char",
                        "size": 200
                    }
                ],
                "order": "asc"
            }
        ]
    },
    "getpenddetailfromitem": {
        "name": "GetPendDetailFromItem",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "pend",
                "type": "char",
                "size": 200
            },
            {
                "name": "key",
                "type": "char",
                "size": 100
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
                        "name": "item",
                        "type": "id"
                    },
                    {
                        "name": "target",
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
                        "name": "pend",
                        "type": "id"
                    },
                    {
                        "name": "pendValue",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "sheet",
                        "type": "char",
                        "size": 200
                    },
                    {
                        "name": "no",
                        "type": "char",
                        "size": 30
                    }
                ],
                "order": "asc"
            }
        ]
    },
    "getpenddetailfromsheetid": {
        "name": "GetPendDetailFromSheetId",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "pend",
                "type": "char",
                "size": 200
            },
            {
                "name": "sheetId",
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
                        "name": "target",
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
                        "name": "pend",
                        "type": "id"
                    },
                    {
                        "name": "pendValue",
                        "type": "dec",
                        "scale": 4,
                        "precision": 18
                    },
                    {
                        "name": "sheet",
                        "type": "char",
                        "size": 200
                    },
                    {
                        "name": "no",
                        "type": "char",
                        "size": 30
                    }
                ]
            }
        ]
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
    "tie": {
        "name": "Tie",
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
    "formula": {
        "name": "Formula",
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
                "name": "from",
                "type": "id"
            },
            {
                "name": "tiePhrase",
                "type": "id"
            },
            {
                "name": "to",
                "type": "id"
            },
            {
                "name": "radio",
                "type": "dec",
                "scale": 4,
                "precision": 18
            }
        ],
        "keys": [
            {
                "name": "from",
                "type": "id"
            },
            {
                "name": "tiePhrase",
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
                "name": "target",
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
                "name": "target",
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
    "pend": {
        "name": "Pend",
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
                "name": "detail",
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
    "tree": {
        "name": "Tree",
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
                    },
                    {
                        "name": "sheetNo",
                        "type": "char",
                        "size": 30
                    },
                    {
                        "name": "sheetName",
                        "type": "char",
                        "size": 200
                    },
                    {
                        "name": "sheetCaption",
                        "type": "char",
                        "size": 100
                    }
                ],
                "order": "desc"
            }
        ]
    },
    "$biz": {
        "$user": {
            "name": "$user",
            "type": "$user"
        },
        "$unit": {
            "name": "$unit",
            "type": "$unit"
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
        "goods": {
            "name": "goods",
            "type": "atom",
            "caption": "商品",
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
            "metric": "*"
        },
        "toy": {
            "name": "toy",
            "type": "atom",
            "caption": "玩具",
            "base": "goods",
            "metric": "count"
        },
        "batchvalid": {
            "name": "batchvalid",
            "type": "spec",
            "caption": "批次",
            "props": [
                {
                    "name": "效期",
                    "type": "date"
                }
            ],
            "keys": [
                {
                    "name": "no",
                    "type": "char",
                    "caption": "批次"
                }
            ]
        },
        "batchvalid1": {
            "name": "batchvalid1",
            "type": "spec",
            "caption": "批次生成日期",
            "keys": [
                {
                    "name": "no",
                    "type": "char",
                    "caption": "批次"
                },
                {
                    "name": "效期",
                    "type": "date"
                }
            ]
        },
        "medicine": {
            "name": "medicine",
            "type": "atom",
            "caption": "药品",
            "props": [
                {
                    "name": "specification",
                    "type": "char",
                    "caption": "规格"
                }
            ],
            "base": "goods",
            "spec": "batchvalid",
            "metric": "count"
        },
        "medicinechinese": {
            "name": "medicinechinese",
            "type": "atom",
            "caption": "中药",
            "props": [
                {
                    "name": "approvalchin",
                    "type": "char",
                    "caption": "中药批号"
                }
            ],
            "base": "medicine"
        },
        "specialmedicinechinese": {
            "name": "specialmedicinechinese",
            "type": "atom",
            "caption": "中药饮品",
            "props": [
                {
                    "name": "approvalchin",
                    "type": "char",
                    "caption": "中药批号"
                }
            ],
            "base": "medicine",
            "spec": "batchvalid1"
        },
        "medicaldevice": {
            "name": "medicaldevice",
            "type": "atom",
            "caption": "医疗器械",
            "base": "goods",
            "metric": "count"
        },
        "specshoe": {
            "name": "specshoe",
            "type": "spec",
            "caption": "型号",
            "keys": [
                {
                    "name": "size",
                    "type": "char",
                    "caption": "尺码"
                },
                {
                    "name": "color",
                    "type": "char",
                    "caption": "颜色"
                }
            ]
        },
        "shoe": {
            "name": "shoe",
            "type": "atom",
            "caption": "鞋",
            "base": "goods",
            "spec": "specshoe"
        },
        "concactproduct": {
            "name": "concactproduct",
            "type": "tie"
        },
        "departmentmember": {
            "name": "departmentmember",
            "type": "tie",
            "caption": "部门",
            "props": [
                {
                    "name": "director",
                    "type": "int"
                },
                {
                    "name": "senior",
                    "type": "int"
                },
                {
                    "name": "junior",
                    "type": "int"
                }
            ]
        },
        "销售员": {
            "name": "销售员",
            "type": "permit"
        },
        "入库员": {
            "name": "入库员",
            "type": "permit"
        },
        "检验员": {
            "name": "检验员",
            "type": "permit"
        },
        "经理": {
            "name": "经理",
            "type": "role"
        },
        "销售部经理": {
            "name": "销售部经理",
            "type": "role"
        },
        "accountsetting": {
            "name": "accountsetting",
            "type": "setting",
            "props": [
                {
                    "name": "name",
                    "type": "char",
                    "caption": "单位名称"
                },
                {
                    "name": "库存上限",
                    "type": "dec"
                }
            ],
            "assigns": [
                {
                    "name": "库存下限",
                    "type": "dec"
                }
            ]
        },
        "personsetting": {
            "name": "personsetting",
            "type": "setting",
            "props": [
                {
                    "name": "name",
                    "type": "char",
                    "caption": "名字"
                },
                {
                    "name": "工时上限",
                    "type": "int"
                }
            ],
            "assigns": [
                {
                    "name": "工时下限",
                    "type": "int"
                }
            ]
        },
        "mainsale": {
            "name": "mainsale",
            "type": "main",
            "props": [
                {
                    "name": "a",
                    "type": "int"
                }
            ]
        },
        "detailsale": {
            "name": "detailsale",
            "type": "detail",
            "main": "mainsale"
        },
        "detailcheck": {
            "name": "detailcheck",
            "type": "detail",
            "main": "mainsale"
        },
        "pendcheck": {
            "name": "pendcheck",
            "type": "pend",
            "detail": "detailcheck"
        },
        "storein1": {
            "name": "storein1",
            "type": "sheet",
            "main": "mainstorein",
            "acts": [
                {
                    "name": "a",
                    "type": "detailAct",
                    "fromPend": "pendstorein",
                    "detail": "d2"
                }
            ]
        },
        "d2": {
            "name": "d2",
            "type": "detail",
            "main": "mainsale"
        },
        "purchase": {
            "name": "purchase",
            "type": "sheet",
            "caption": "采购单",
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
                            "type": "dec"
                        },
                        {
                            "name": "c",
                            "type": "char"
                        }
                    ],
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
                    "acts": [
                        {
                            "name": "$act"
                        }
                    ]
                },
                {
                    "name": "s1",
                    "acts": [] as any
                }
            ]
        },
        "sale": {
            "name": "sale",
            "type": "sheet",
            "caption": "销售单",
            "details": [
                {
                    "name": "detail"
                }
            ],
            "states": [
                {
                    "name": "$start",
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
            "details": [
                {
                    "name": "detail"
                }
            ],
            "states": [
                {
                    "name": "$start",
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
            "details": [
                {
                    "name": "detail"
                }
            ],
            "states": [
                {
                    "name": "$start",
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
                    ]
                }
            ],
            "states": [
                {
                    "name": "$start",
                    "acts": [
                        {
                            "name": "$act"
                        }
                    ]
                },
                {
                    "name": "s0",
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
                    "acts": [
                        {
                            "name": "$act"
                        }
                    ]
                },
                {
                    "name": "s2",
                    "caption": "状态s2",
                    "acts": [
                        {
                            "name": "procstoreout2"
                        }
                    ]
                }
            ]
        },
        "mainpurchase": {
            "name": "mainpurchase",
            "type": "main"
        },
        "detailpurchase": {
            "name": "detailpurchase",
            "type": "detail",
            "main": "mainpurchase"
        },
        "detailpurchasemedicine": {
            "name": "detailpurchasemedicine",
            "type": "detail",
            "main": "mainpurchase"
        },
        "sheetpurchase": {
            "name": "sheetpurchase",
            "type": "sheet",
            "caption": "采购单",
            "main": "mainpurchase",
            "acts": [
                {
                    "name": "$",
                    "type": "detailAct",
                    "detail": "detailpurchase"
                }
            ]
        },
        "mainstorein": {
            "name": "mainstorein",
            "type": "main"
        },
        "detailstorein": {
            "name": "detailstorein",
            "type": "detail",
            "main": "mainstorein"
        },
        "pendstorein": {
            "name": "pendstorein",
            "type": "pend",
            "caption": "待入库",
            "detail": "detailstorein"
        },
        "sheetstorein": {
            "name": "sheetstorein",
            "type": "sheet",
            "caption": "入库单",
            "main": "mainpurchase",
            "acts": [
                {
                    "name": "$",
                    "type": "detailAct",
                    "fromPend": "pendstorein",
                    "detail": "detailstorein"
                }
            ]
        },
        "sheetstoreinmultistorage": {
            "name": "sheetstoreinmultistorage",
            "type": "sheet",
            "caption": "入库单-分仓",
            "main": "mainpurchase",
            "acts": [
                {
                    "name": "$",
                    "type": "detailAct",
                    "fromPend": "pendstorein",
                    "detail": "detailstorein"
                }
            ]
        },
        "storage": {
            "name": "storage",
            "type": "subject",
            "caption": "库存"
        },
        "c": {
            "name": "c",
            "type": "subject",
            "assigns": [
                {
                    "name": "流水",
                    "type": "char",
                    "caption": "下一步",
                    "value": "s2"
                }
            ]
        },
        "customertree": {
            "name": "customertree",
            "type": "tree",
            "caption": "客户分组"
        },
        "vendortree": {
            "name": "vendortree",
            "type": "tree",
            "caption": "供应商分组"
        }
    }
}