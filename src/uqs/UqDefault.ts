//=== UqApp builder created on Tue Jul 25 2023 15:44:03 GMT-0400 (Eastern Daylight Time) ===//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IDXValue, Uq, UqID, UqIX, UqQuery, UqAction } from "tonwa-uq";
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
	SumFormula = 'sumformula',
	Bud = 'bud',
	History = 'history',
	Atom = 'atom',
	Sheet = 'sheet',
	Detail = 'detail',
	Pend = 'pend',
}

export interface $phrase extends ID {
	name: string;
	caption: string;
	base: number;
	valid: number;
	owner: number;
	type: number;
}

export interface $phraseInActs extends ID {
	ID?: UqID<any>;
	name: string;
	caption: string;
	base: number;
	valid: number;
	owner: number;
	type: number;
}

export interface $ixphrase extends IX {
	type: number;
}

export interface Param$role_My {
}
export interface Return$role_MySites {
	id: number;
	site: number;
	admin: number;
	entity: string;
	assigned: string;
	def: number;
}
export interface Return$role_MyRoles {
	site: number;
	role: string;
}
export interface Return$role_MyPermits {
	site: number;
	permit: string;
}
export interface Result$role_My {
	sites: Return$role_MySites[];
	roles: Return$role_MyRoles[];
	permits: Return$role_MyPermits[];
}

export interface Param$role_Site_Users {
	site: number;
}
export interface Return$role_Site_UsersUsers {
	id: number;
	user: number;
	admin: number;
	assigned: string;
	name: string;
	nick: string;
	icon: string;
	addBy: number;
}
export interface Return$role_Site_UsersRoles {
	user: number;
	role: string;
}
export interface Result$role_Site_Users {
	users: Return$role_Site_UsersUsers[];
	roles: Return$role_Site_UsersRoles[];
}

export interface Param$role_Site_Add_Admin {
	site: number;
	user: number;
	admin: number;
	assigned: string;
}
export interface Result$role_Site_Add_Admin {
}

export interface Param$role_Site_Del_Admin {
	site: number;
	user: number;
	admin: number;
}
export interface Result$role_Site_Del_Admin {
}

export interface Param$role_Site_Add_User {
	site: number;
	user: number;
	assigned: string;
}
export interface Result$role_Site_Add_User {
}

export interface Param$role_Site_User_Role {
	site: number;
	user: number;
	action: string;
	role: string;
}
export interface Result$role_Site_User_Role {
}

export interface Param$role_Site_Quit_Owner {
	site: number;
}
export interface Result$role_Site_Quit_Owner {
}

export interface Param$sites {
}
export interface Return$sites$page {
	id: number;
	no: string;
	ex: string;
}
export interface Result$sites {
	$page: Return$sites$page[];
}

export interface Param$setSite {
	site: number;
}
export interface Result$setSite {
}

export enum EnumBizType {
	atom = 1,
	sheet = 2,
	key = 11,
	prop = 12,
	assign = 13,
	permit = 14,
	with = 15,
	role = 16
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

export interface Param$AllPhrases {
}
export interface Return$AllPhrasesMain {
	id: number;
	name: string;
	caption: string;
	type: any;
}
export interface Return$AllPhrasesDetail {
	id: number;
	name: string;
	caption: string;
	owner: number;
	type: any;
}
export interface Result$AllPhrases {
	main: Return$AllPhrasesMain[];
	detail: Return$AllPhrasesDetail[];
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

export interface ParamSaveBud {
	phrase: string;
	id: number;
	int: number;
	dec: number;
	str: string;
}
export interface ResultSaveBud {
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
	props: {
		prop: string;
		propValue: number;
	}[];

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

export interface ParamSearchAtomBuds {
	phrase: string;
	key: string;
	budNames: string;
}
export interface ReturnSearchAtomBuds$page {
	id: number;
	no: string;
	ex: string;
	phrase: string;
}
export interface ReturnSearchAtomBudsMeds {
	id: number;
	main: number;
	detail: number;
}
export interface ReturnSearchAtomBudsBudsInt {
	id: number;
	bud: number;
	phrase: string;
	value: number;
}
export interface ReturnSearchAtomBudsBudsDec {
	id: number;
	bud: number;
	phrase: string;
	value: number;
}
export interface ReturnSearchAtomBudsBudsStr {
	id: number;
	bud: number;
	phrase: string;
	value: string;
}
export interface ResultSearchAtomBuds {
	$page: ReturnSearchAtomBuds$page[];
	meds: ReturnSearchAtomBudsMeds[];
	budsInt: ReturnSearchAtomBudsBudsInt[];
	budsDec: ReturnSearchAtomBudsBudsDec[];
	budsStr: ReturnSearchAtomBudsBudsStr[];
}

export interface ParamSearchAtomMetricBuds {
	phrase: string;
	key: string;
	budNames: string;
}
export interface ReturnSearchAtomMetricBuds$page {
	id: number;
	no: string;
	ex: string;
	phrase: string;
}
export interface ReturnSearchAtomMetricBudsMeds {
	id: number;
	main: number;
	detail: number;
}
export interface ReturnSearchAtomMetricBudsBudsInt {
	id: number;
	bud: number;
	phrase: string;
	value: number;
}
export interface ReturnSearchAtomMetricBudsBudsDec {
	id: number;
	bud: number;
	phrase: string;
	value: number;
}
export interface ReturnSearchAtomMetricBudsBudsStr {
	id: number;
	bud: number;
	phrase: string;
	value: string;
}
export interface ResultSearchAtomMetricBuds {
	$page: ReturnSearchAtomMetricBuds$page[];
	meds: ReturnSearchAtomMetricBudsMeds[];
	budsInt: ReturnSearchAtomMetricBudsBudsInt[];
	budsDec: ReturnSearchAtomMetricBudsBudsDec[];
	budsStr: ReturnSearchAtomMetricBudsBudsStr[];
}

export interface ParamGetSheet {
	id: number;
	budNames: string;
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
	pendFrom: number;
	pendValue: number;
	sheet: string;
	no: string;
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
}
export interface ReturnGetSheetBuds {
	id: number;
	bud: number;
	phrase: string;
	value: number;
}
export interface ResultGetSheet {
	main: ReturnGetSheetMain[];
	details: ReturnGetSheetDetails[];
	origins: ReturnGetSheetOrigins[];
	buds: ReturnGetSheetBuds[];
}

export interface ParamGetAtom {
	id: number;
	budNames: string;
}
export interface ReturnGetAtomMain {
	id: number;
	phrase: string;
	no: string;
	ex: string;
}
export interface ReturnGetAtomBudsInt {
	bud: number;
	phrase: string;
	value: number;
}
export interface ReturnGetAtomBudsDec {
	bud: number;
	phrase: string;
	value: number;
}
export interface ReturnGetAtomBudsStr {
	bud: number;
	phrase: string;
	value: string;
}
export interface ResultGetAtom {
	main: ReturnGetAtomMain[];
	budsInt: ReturnGetAtomBudsInt[];
	budsDec: ReturnGetAtomBudsDec[];
	budsStr: ReturnGetAtomBudsStr[];
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

export enum SumFormulaType {
	person = 1,
	group = 2
}

export interface SumFormula extends ID {
	formulaType: any;
	subject: number;
	post: number;
	sumSubject: number;
	caption: string;
	start: any;
	end: any;
	ratio: number;
}

export interface SumFormulaInActs extends ID {
	ID?: UqID<any>;
	formulaType: any;
	subject: number | ID;
	post: number | ID;
	sumSubject: number | ID;
	caption: string;
	start: any;
	end: any;
	ratio: number;
}

export interface ParamSearchGroupPersons {
	group: number;
	key: string;
}
export interface ReturnSearchGroupPersons$page {
	id: number;
	no: string;
	ex: string;
	phrase: string;
	selected: number;
}
export interface ResultSearchGroupPersons {
	$page: ReturnSearchGroupPersons$page[];
}

export interface ParamGetAllFormula {
}
export interface ReturnGetAllFormulaRet {
	id: number;
	formulaType: any;
	subject: number;
	post: number;
	sumSubject: number;
	caption: string;
	start: any;
	end: any;
	ratio: number;
}
export interface ReturnGetAllFormulaPhrases {
	id: number;
	name: string;
	caption: string;
	owner: number;
	type: any;
}
export interface ResultGetAllFormula {
	ret: ReturnGetAllFormulaRet[];
	phrases: ReturnGetAllFormulaPhrases[];
}

export interface ParamSetSumGroupPerson {
	group: number;
	person: number;
	act: number;
}
export interface ResultSetSumGroupPerson {
}

export interface IxBud extends IX {
	i: number;
	x: number;
}

export interface Bud extends ID {
	base: number;
	phrase: number;
}

export interface BudInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
	phrase: number | ID;
}

export interface History extends ID {
	subject: number;
	value: number;
	ref: number;
	op: number;
}

export interface HistoryInActs extends ID {
	ID?: UqID<any>;
	subject: number | ID;
	value: number;
	ref: number | ID;
	op: number;
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

export interface ParamReportStorage {
	key: string;
	subject: string;
}
export interface ReturnReportStorage$page {
	atom: number;
	metricItem: number;
	spec: number;
	id: number;
	value: number;
	init: number;
}
export interface ResultReportStorage {
	$page: ReturnReportStorage$page[];
}

export interface ParamReportStorageAtom {
	key: string;
	subject: string;
}
export interface ReturnReportStorageAtom$page {
	obj: number;
	value: number;
	init: number;
}
export interface ResultReportStorageAtom {
	$page: ReturnReportStorageAtom$page[];
}

export interface ParamReportStorageSpec {
	key: string;
	subject: string;
}
export interface ReturnReportStorageSpec$page {
	obj: number;
	value: number;
	init: number;
}
export interface ResultReportStorageSpec {
	$page: ReturnReportStorageSpec$page[];
}

export interface ParamHistoryStorage {
	objId: number;
	subject: string;
}
export interface ReturnHistoryStorage$page {
	id: number;
	value: number;
	ref: number;
	op: number;
	sheetNo: string;
	sheetName: string;
	sheetCaption: string;
}
export interface ResultHistoryStorage {
	$page: ReturnHistoryStorage$page[];
}



export interface ParamActs {
	$phrase?: $phraseInActs[];
	$ixphrase?: $ixphrase[];
	metric?: MetricInActs[];
	metricItem?: MetricItemInActs[];
	atomMetric?: AtomMetricInActs[];
	atomMetricSpec?: AtomMetricSpecInActs[];
	sumFormula?: SumFormulaInActs[];
	ixBud?: IxBud[];
	bud?: BudInActs[];
	history?: HistoryInActs[];
	atom?: AtomInActs[];
	sheet?: SheetInActs[];
	detail?: DetailInActs[];
	pend?: PendInActs[];
}


export interface UqExt extends Uq {
	Acts(param:ParamActs): Promise<any>;
	SQL: Uq;
    Role: { [key: string]: string[] };

	$phrase: UqID<any>;
	$ixphrase: UqIX<any>;
	$role_My: UqQuery<Param$role_My, Result$role_My>;
	$role_Site_Users: UqQuery<Param$role_Site_Users, Result$role_Site_Users>;
	$role_Site_Add_Admin: UqAction<Param$role_Site_Add_Admin, Result$role_Site_Add_Admin>;
	$role_Site_Del_Admin: UqAction<Param$role_Site_Del_Admin, Result$role_Site_Del_Admin>;
	$role_Site_Add_User: UqAction<Param$role_Site_Add_User, Result$role_Site_Add_User>;
	$role_Site_User_Role: UqAction<Param$role_Site_User_Role, Result$role_Site_User_Role>;
	$role_Site_Quit_Owner: UqAction<Param$role_Site_Quit_Owner, Result$role_Site_Quit_Owner>;
	$sites: UqQuery<Param$sites, Result$sites>;
	$setSite: UqAction<Param$setSite, Result$setSite>;
	$poked: UqQuery<Param$poked, Result$poked>;
	$setMyTimezone: UqAction<Param$setMyTimezone, Result$setMyTimezone>;
	$getUnitTime: UqQuery<Param$getUnitTime, Result$getUnitTime>;
	$AllPhrases: UqQuery<Param$AllPhrases, Result$AllPhrases>;
	SaveAtom: UqAction<ParamSaveAtom, ResultSaveAtom>;
	SaveBud: UqAction<ParamSaveBud, ResultSaveBud>;
	SaveSpec: UqAction<ParamSaveSpec, ResultSaveSpec>;
	SaveSheet: UqAction<ParamSaveSheet, ResultSaveSheet>;
	SaveDetail: UqAction<ParamSaveDetail, ResultSaveDetail>;
	RemoveDraft: UqAction<ParamRemoveDraft, ResultRemoveDraft>;
	GetMyDrafts: UqQuery<ParamGetMyDrafts, ResultGetMyDrafts>;
	SearchAtom: UqQuery<ParamSearchAtom, ResultSearchAtom>;
	SearchAtomBuds: UqQuery<ParamSearchAtomBuds, ResultSearchAtomBuds>;
	SearchAtomMetricBuds: UqQuery<ParamSearchAtomMetricBuds, ResultSearchAtomMetricBuds>;
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
	SumFormula: UqID<any>;
	SearchGroupPersons: UqQuery<ParamSearchGroupPersons, ResultSearchGroupPersons>;
	GetAllFormula: UqQuery<ParamGetAllFormula, ResultGetAllFormula>;
	SetSumGroupPerson: UqAction<ParamSetSumGroupPerson, ResultSetSumGroupPerson>;
	IxBud: UqIX<any>;
	Bud: UqID<any>;
	History: UqID<any>;
	Atom: UqID<any>;
	Sheet: UqID<any>;
	Detail: UqID<any>;
	Pend: UqID<any>;
	ReportStorage: UqQuery<ParamReportStorage, ResultReportStorage>;
	ReportStorageAtom: UqQuery<ParamReportStorageAtom, ResultReportStorageAtom>;
	ReportStorageSpec: UqQuery<ParamReportStorageSpec, ResultReportStorageSpec>;
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
            },
            {
                "name": "owner",
                "type": "bigint"
            },
            {
                "name": "type",
                "type": "tinyint"
            }
        ],
        "keys": [] as any,
        "global": false,
        "isMinute": false
    },
    "$ixphrase": {
        "name": "$ixphrase",
        "type": "ix",
        "private": false,
        "fields": [
            {
                "name": "type",
                "type": "tinyint",
                "null": false
            }
        ],
        "ixx": false,
        "hasSort": false
    },
    "$role_my": {
        "name": "$role_my",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [] as any,
        "returns": [
            {
                "name": "sites",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "site",
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
                    },
                    {
                        "name": "def",
                        "type": "tinyint"
                    }
                ]
            },
            {
                "name": "roles",
                "fields": [
                    {
                        "name": "site",
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
                "name": "permits",
                "fields": [
                    {
                        "name": "site",
                        "type": "id"
                    },
                    {
                        "name": "permit",
                        "type": "char",
                        "size": 100
                    }
                ]
            }
        ]
    },
    "$role_site_users": {
        "name": "$role_site_users",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "site",
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
    "$role_site_add_admin": {
        "name": "$role_site_add_admin",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "site",
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
    "$role_site_del_admin": {
        "name": "$role_site_del_admin",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "site",
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
    "$role_site_add_user": {
        "name": "$role_site_add_user",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "site",
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
    "$role_site_user_role": {
        "name": "$role_site_user_role",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "site",
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
    "$role_site_quit_owner": {
        "name": "$role_site_quit_owner",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "site",
                "type": "bigint"
            }
        ],
        "returns": [] as any
    },
    "$sites": {
        "name": "$sites",
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
                        "size": 100
                    }
                ],
                "order": "desc"
            }
        ]
    },
    "$setsite": {
        "name": "$setSite",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "site",
                "type": "id"
            }
        ],
        "returns": [] as any
    },
    "enumbiztype": {
        "name": "EnumBizType",
        "type": "enum",
        "private": false,
        "sys": true,
        "values": {
            "atom": 1,
            "sheet": 2,
            "key": 11,
            "prop": 12,
            "assign": 13,
            "permit": 14,
            "with": 15,
            "role": 16
        }
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
    "$allphrases": {
        "name": "$AllPhrases",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [] as any,
        "returns": [
            {
                "name": "main",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
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
                        "name": "type",
                        "type": "enum"
                    }
                ]
            },
            {
                "name": "detail",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
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
                        "name": "owner",
                        "type": "id"
                    },
                    {
                        "name": "type",
                        "type": "enum"
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
    "savebud": {
        "name": "SaveBud",
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
                "scale": 6,
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
                "scale": 6,
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
                "scale": 6,
                "precision": 18
            },
            {
                "name": "v1",
                "type": "dec",
                "scale": 6,
                "precision": 18
            },
            {
                "name": "v2",
                "type": "dec",
                "scale": 6,
                "precision": 18
            },
            {
                "name": "v3",
                "type": "dec",
                "scale": 6,
                "precision": 18
            },
            {
                "name": "pendFrom",
                "type": "id"
            }
        ],
        "arrs": [
            {
                "name": "props",
                "fields": [
                    {
                        "name": "prop",
                        "type": "char",
                        "size": 200
                    },
                    {
                        "name": "propValue",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    }
                ]
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
                        "scale": 6,
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
    "searchatombuds": {
        "name": "SearchAtomBuds",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "phrase",
                "type": "char",
                "size": 200
            },
            {
                "name": "key",
                "type": "char",
                "size": 50
            },
            {
                "name": "budNames",
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
                "name": "meds",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "main",
                        "type": "id"
                    },
                    {
                        "name": "detail",
                        "type": "id"
                    }
                ]
            },
            {
                "name": "budsInt",
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
                        "type": "int"
                    }
                ]
            },
            {
                "name": "budsDec",
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
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    }
                ]
            },
            {
                "name": "budsStr",
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
    "searchatommetricbuds": {
        "name": "SearchAtomMetricBuds",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "phrase",
                "type": "char",
                "size": 200
            },
            {
                "name": "key",
                "type": "char",
                "size": 50
            },
            {
                "name": "budNames",
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
                "name": "meds",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "main",
                        "type": "id"
                    },
                    {
                        "name": "detail",
                        "type": "id"
                    }
                ]
            },
            {
                "name": "budsInt",
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
                        "type": "int"
                    }
                ]
            },
            {
                "name": "budsDec",
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
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    }
                ]
            },
            {
                "name": "budsStr",
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
                "name": "budNames",
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
                        "scale": 6,
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
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "v1",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "v2",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "v3",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "pendFrom",
                        "type": "id"
                    },
                    {
                        "name": "pendValue",
                        "type": "dec",
                        "scale": 6,
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
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "v1",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "v2",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "v3",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    }
                ]
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
                        "type": "dec",
                        "scale": 6,
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
            },
            {
                "name": "budNames",
                "type": "char",
                "size": 300
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
                "name": "budsInt",
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
                        "type": "int"
                    }
                ]
            },
            {
                "name": "budsDec",
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
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    }
                ]
            },
            {
                "name": "budsStr",
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
        "isMinute": false,
        "stars": [
            "atom",
            "metricItem"
        ]
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
        "isMinute": false,
        "stars": [
            "atomMetric",
            "spec"
        ]
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
                        "scale": 6,
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
                        "scale": 6,
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
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "v1",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "v2",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "v3",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "pend",
                        "type": "id"
                    },
                    {
                        "name": "pendValue",
                        "type": "dec",
                        "scale": 6,
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
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "v1",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "v2",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "v3",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "pend",
                        "type": "id"
                    },
                    {
                        "name": "pendValue",
                        "type": "dec",
                        "scale": 6,
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
    "sumformulatype": {
        "name": "SumFormulaType",
        "type": "enum",
        "private": false,
        "sys": true,
        "values": {
            "person": 1,
            "group": 2
        }
    },
    "sumformula": {
        "name": "SumFormula",
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
                "name": "formulaType",
                "type": "enum"
            },
            {
                "name": "subject",
                "type": "id"
            },
            {
                "name": "post",
                "type": "id"
            },
            {
                "name": "sumSubject",
                "type": "id"
            },
            {
                "name": "caption",
                "type": "char",
                "size": 100
            },
            {
                "name": "start",
                "type": "date"
            },
            {
                "name": "end",
                "type": "date"
            },
            {
                "name": "ratio",
                "type": "dec",
                "scale": 6,
                "precision": 18
            }
        ],
        "keys": [
            {
                "name": "formulaType",
                "type": "enum"
            },
            {
                "name": "subject",
                "type": "id"
            },
            {
                "name": "post",
                "type": "id"
            },
            {
                "name": "sumSubject",
                "type": "id"
            }
        ],
        "global": false,
        "idType": 3,
        "isMinute": true
    },
    "searchgrouppersons": {
        "name": "SearchGroupPersons",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "group",
                "type": "id"
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
                    },
                    {
                        "name": "selected",
                        "type": "tinyint"
                    }
                ],
                "order": "desc"
            }
        ]
    },
    "getallformula": {
        "name": "GetAllFormula",
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
                        "type": "id",
                        "null": false
                    },
                    {
                        "name": "formulaType",
                        "type": "enum"
                    },
                    {
                        "name": "subject",
                        "type": "id"
                    },
                    {
                        "name": "post",
                        "type": "id"
                    },
                    {
                        "name": "sumSubject",
                        "type": "id"
                    },
                    {
                        "name": "caption",
                        "type": "char",
                        "size": 100
                    },
                    {
                        "name": "start",
                        "type": "date"
                    },
                    {
                        "name": "end",
                        "type": "date"
                    },
                    {
                        "name": "ratio",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    }
                ]
            },
            {
                "name": "phrases",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
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
                        "name": "owner",
                        "type": "id"
                    },
                    {
                        "name": "type",
                        "type": "enum"
                    }
                ]
            }
        ]
    },
    "setsumgroupperson": {
        "name": "SetSumGroupPerson",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "group",
                "type": "id"
            },
            {
                "name": "person",
                "type": "id"
            },
            {
                "name": "act",
                "type": "tinyint"
            }
        ],
        "returns": [] as any
    },
    "ixbud": {
        "name": "IxBud",
        "type": "ix",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "i",
                "type": "id"
            },
            {
                "name": "x",
                "type": "id"
            }
        ],
        "ixx": false,
        "hasSort": false,
        "xiType": 0
    },
    "bud": {
        "name": "Bud",
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
                "name": "phrase",
                "type": "id"
            }
        ],
        "keys": [
            {
                "name": "base",
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
                "scale": 6,
                "precision": 18
            },
            {
                "name": "ref",
                "type": "id"
            },
            {
                "name": "op",
                "type": "tinyint"
            }
        ],
        "keys": [] as any,
        "global": false,
        "idType": 3,
        "isMinute": true
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
                "scale": 6,
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
                "scale": 6,
                "precision": 18
            },
            {
                "name": "v1",
                "type": "dec",
                "scale": 6,
                "precision": 18
            },
            {
                "name": "v2",
                "type": "dec",
                "scale": 6,
                "precision": 18
            },
            {
                "name": "v3",
                "type": "dec",
                "scale": 6,
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
                "scale": 6,
                "precision": 18
            }
        ],
        "keys": [] as any,
        "global": false,
        "idType": 3,
        "isMinute": true
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
                        "name": "metricItem",
                        "type": "id"
                    },
                    {
                        "name": "spec",
                        "type": "id"
                    },
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "value",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "init",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    }
                ],
                "order": "asc"
            }
        ]
    },
    "reportstorageatom": {
        "name": "ReportStorageAtom",
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
                        "name": "obj",
                        "type": "id"
                    },
                    {
                        "name": "value",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "init",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    }
                ],
                "order": "asc"
            }
        ]
    },
    "reportstoragespec": {
        "name": "ReportStorageSpec",
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
                        "name": "obj",
                        "type": "id"
                    },
                    {
                        "name": "value",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "init",
                        "type": "dec",
                        "scale": 6,
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
                "name": "objId",
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
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "ref",
                        "type": "id"
                    },
                    {
                        "name": "op",
                        "type": "tinyint"
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
                    "type": "prop",
                    "dataType": "int"
                },
                {
                    "name": "b",
                    "type": "prop",
                    "dataType": "char",
                    "value": 1
                },
                {
                    "name": "c",
                    "type": "prop",
                    "dataType": "char"
                }
            ],
            "assigns": [
                {
                    "name": "流水",
                    "type": "assign",
                    "caption": "下一步",
                    "dataType": "char",
                    "value": "s2"
                }
            ]
        },
        "contact": {
            "name": "contact",
            "jName": "Contact",
            "type": "atom",
            "caption": "往来单位",
            "props": [
                {
                    "name": "a",
                    "type": "prop",
                    "caption": "联系人",
                    "dataType": "int"
                },
                {
                    "name": "b",
                    "type": "prop",
                    "caption": "类型",
                    "dataType": "radio",
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
                    "type": "prop",
                    "caption": "可信度",
                    "dataType": "radio",
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
                    "type": "prop",
                    "caption": "产品种类",
                    "dataType": "check",
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
        "person": {
            "name": "person",
            "jName": "Person",
            "type": "atom",
            "caption": "人员"
        },
        "persongroup": {
            "name": "persongroup",
            "jName": "PersonGroup",
            "type": "atom",
            "caption": "小组"
        },
        "goods": {
            "name": "goods",
            "jName": "Goods",
            "type": "atom",
            "caption": "商品",
            "props": [
                {
                    "name": "厂家",
                    "type": "prop",
                    "dataType": "ID",
                    "atom": "contact"
                }
            ],
            "assigns": [
                {
                    "name": "retailprice",
                    "type": "assign",
                    "caption": "零售价",
                    "dataType": "dec"
                }
            ],
            "metric": "*"
        },
        "toy": {
            "name": "toy",
            "jName": "Toy",
            "type": "atom",
            "caption": "玩具",
            "base": "goods",
            "metric": "count"
        },
        "batchvalid": {
            "name": "batchvalid",
            "jName": "BatchValid",
            "type": "spec",
            "caption": "批次",
            "props": [
                {
                    "name": "效期",
                    "type": "prop",
                    "dataType": "date"
                }
            ],
            "keys": [
                {
                    "name": "no",
                    "type": "key",
                    "caption": "批次",
                    "dataType": "char"
                }
            ]
        },
        "batchvalid1": {
            "name": "batchvalid1",
            "jName": "BatchValid1",
            "type": "spec",
            "caption": "批次生成日期",
            "keys": [
                {
                    "name": "no",
                    "type": "key",
                    "caption": "批次",
                    "dataType": "char"
                },
                {
                    "name": "效期",
                    "type": "key",
                    "dataType": "date"
                }
            ]
        },
        "medicine": {
            "name": "medicine",
            "jName": "Medicine",
            "type": "atom",
            "caption": "药品",
            "props": [
                {
                    "name": "specification",
                    "type": "prop",
                    "caption": "规格",
                    "dataType": "char"
                }
            ],
            "base": "goods",
            "spec": "batchvalid",
            "metric": "count"
        },
        "medicinechinese": {
            "name": "medicinechinese",
            "jName": "MedicineChinese",
            "type": "atom",
            "caption": "中药",
            "props": [
                {
                    "name": "approvalchin",
                    "type": "prop",
                    "caption": "中药批号",
                    "dataType": "char"
                }
            ],
            "base": "medicine"
        },
        "specialmedicinechinese": {
            "name": "specialmedicinechinese",
            "jName": "SpecialMedicineChinese",
            "type": "atom",
            "caption": "中药饮品",
            "props": [
                {
                    "name": "approvalchin",
                    "type": "prop",
                    "caption": "中药批号",
                    "dataType": "char"
                }
            ],
            "base": "medicine",
            "spec": "batchvalid1"
        },
        "medicaldevice": {
            "name": "medicaldevice",
            "jName": "MedicalDevice",
            "type": "atom",
            "caption": "医疗器械",
            "base": "goods",
            "metric": "count"
        },
        "specshoe": {
            "name": "specshoe",
            "jName": "SpecShoe",
            "type": "spec",
            "caption": "型号",
            "keys": [
                {
                    "name": "size",
                    "type": "key",
                    "caption": "尺码",
                    "dataType": "char"
                },
                {
                    "name": "color",
                    "type": "key",
                    "caption": "颜色",
                    "dataType": "char"
                }
            ]
        },
        "shoe": {
            "name": "shoe",
            "jName": "Shoe",
            "type": "atom",
            "caption": "鞋",
            "base": "goods",
            "spec": "specshoe"
        },
        "concactproduct": {
            "name": "concactproduct",
            "jName": "ConcactProduct",
            "type": "tie",
            "caption": "ConcactProduct"
        },
        "departmentmember": {
            "name": "departmentmember",
            "jName": "DepartmentMember",
            "type": "tie",
            "caption": "部门",
            "props": [
                {
                    "name": "director",
                    "type": "prop",
                    "dataType": "int"
                },
                {
                    "name": "senior",
                    "type": "prop",
                    "dataType": "int"
                },
                {
                    "name": "junior",
                    "type": "prop",
                    "dataType": "int"
                }
            ]
        },
        "a菜单": {
            "name": "a菜单",
            "jName": "A菜单",
            "type": "permit",
            "caption": "A菜单",
            "items": [
                {
                    "phrase": "permit.a菜单.i1",
                    "name": "i1"
                },
                {
                    "phrase": "permit.a菜单.i2",
                    "name": "i2"
                },
                {
                    "phrase": "permit.a菜单.i4",
                    "name": "i4"
                }
            ],
            "permits": [] as any
        },
        "销售1": {
            "name": "销售1",
            "type": "permit",
            "items": [
                {
                    "phrase": "permit.销售1.入库",
                    "name": "入库"
                },
                {
                    "phrase": "permit.销售1.发货",
                    "name": "发货"
                },
                {
                    "phrase": "permit.销售1.检验",
                    "name": "检验"
                }
            ],
            "permits": [] as any
        },
        "入库": {
            "name": "入库",
            "type": "permit",
            "items": [
                {
                    "phrase": "permit.入库.上架",
                    "name": "上架"
                },
                {
                    "phrase": "permit.入库.收货",
                    "name": "收货"
                }
            ],
            "permits": [] as any
        },
        "检验": {
            "name": "检验",
            "type": "permit",
            "items": [
                {
                    "phrase": "permit.检验.初检",
                    "name": "初检"
                },
                {
                    "phrase": "permit.检验.复检",
                    "name": "复检"
                }
            ],
            "permits": [
                "入库"
            ]
        },
        "经理": {
            "name": "经理",
            "type": "role"
        },
        "销售部经理": {
            "name": "销售部经理",
            "type": "role"
        },
        "检验员": {
            "name": "检验员",
            "type": "role"
        },
        "mainpurchase": {
            "name": "mainpurchase",
            "jName": "MainPurchase",
            "type": "main",
            "caption": "MainPurchase"
        },
        "detailpurchase": {
            "name": "detailpurchase",
            "jName": "DetailPurchase",
            "type": "detail",
            "caption": "DetailPurchase",
            "main": "mainpurchase"
        },
        "detailpurchasemedicine": {
            "name": "detailpurchasemedicine",
            "jName": "DetailPurchaseMedicine",
            "type": "detail",
            "caption": "DetailPurchaseMedicine",
            "main": "mainpurchase"
        },
        "sheetpurchase": {
            "name": "sheetpurchase",
            "jName": "SheetPurchase",
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
            "jName": "MainStoreIn",
            "type": "main",
            "caption": "MainStoreIn"
        },
        "detailstorein": {
            "name": "detailstorein",
            "jName": "DetailStoreIn",
            "type": "detail",
            "caption": "DetailStoreIn",
            "main": "mainstorein"
        },
        "pendstorein": {
            "name": "pendstorein",
            "jName": "PendStoreIn",
            "type": "pend",
            "caption": "待入库",
            "detail": "detailstorein"
        },
        "sheetstorein": {
            "name": "sheetstorein",
            "jName": "SheetStoreIn",
            "type": "sheet",
            "caption": "入库单",
            "main": "mainstorein",
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
            "jName": "SheetStoreInMultiStorage",
            "type": "sheet",
            "caption": "入库单-分仓",
            "main": "mainstorein",
            "acts": [
                {
                    "name": "$",
                    "type": "detailAct",
                    "fromPend": "pendstorein",
                    "detail": "detailstorein"
                }
            ]
        },
        "mainsale": {
            "name": "mainsale",
            "jName": "MainSale",
            "type": "main",
            "caption": "MainSale"
        },
        "sheetsale": {
            "name": "sheetsale",
            "jName": "SheetSale",
            "type": "sheet",
            "caption": "销售单",
            "main": "mainsale",
            "acts": [
                {
                    "name": "$",
                    "type": "detailAct",
                    "detail": "detailsale"
                }
            ]
        },
        "detailsale": {
            "name": "detailsale",
            "jName": "DetailSale",
            "type": "detail",
            "caption": "DetailSale",
            "main": "mainsale"
        },
        "mainstoreout": {
            "name": "mainstoreout",
            "jName": "MainStoreOut",
            "type": "main",
            "caption": "MainStoreOut"
        },
        "detailstoreout": {
            "name": "detailstoreout",
            "jName": "DetailStoreOut",
            "type": "detail",
            "caption": "DetailStoreOut",
            "main": "mainstoreout"
        },
        "pendstoreout": {
            "name": "pendstoreout",
            "jName": "PendStoreOut",
            "type": "pend",
            "caption": "待出库",
            "detail": "detailstorein"
        },
        "sheetstoreout": {
            "name": "sheetstoreout",
            "jName": "SheetStoreOut",
            "type": "sheet",
            "caption": "出库单",
            "main": "mainstoreout",
            "acts": [
                {
                    "name": "$",
                    "type": "detailAct",
                    "fromPend": "pendstoreout",
                    "detail": "detailstoreout"
                }
            ]
        },
        "storage": {
            "name": "storage",
            "type": "subject",
            "caption": "库存",
            "assigns": [
                {
                    "name": "goodsinit",
                    "type": "assign",
                    "dataType": "dec"
                },
                {
                    "name": "goodsbalance",
                    "type": "assign",
                    "dataType": "dec",
                    "history": true
                }
            ]
        },
        "c": {
            "name": "c",
            "type": "subject",
            "assigns": [
                {
                    "name": "流水",
                    "type": "assign",
                    "caption": "下一步",
                    "dataType": "char",
                    "value": "s2"
                }
            ]
        },
        "accountsetting": {
            "name": "accountsetting",
            "jName": "AccountSetting",
            "type": "subject",
            "caption": "AccountSetting",
            "props": [
                {
                    "name": "name",
                    "type": "prop",
                    "caption": "单位名称",
                    "dataType": "char"
                },
                {
                    "name": "库存上限",
                    "type": "prop",
                    "dataType": "dec"
                }
            ],
            "assigns": [
                {
                    "name": "库存下限",
                    "type": "assign",
                    "dataType": "dec"
                }
            ]
        },
        "personsetting": {
            "name": "personsetting",
            "jName": "PersonSetting",
            "type": "subject",
            "caption": "PersonSetting",
            "props": [
                {
                    "name": "name",
                    "type": "prop",
                    "caption": "名字",
                    "dataType": "char"
                },
                {
                    "name": "工时上限",
                    "type": "prop",
                    "dataType": "int"
                }
            ],
            "assigns": [
                {
                    "name": "工时下限",
                    "type": "assign",
                    "dataType": "int"
                }
            ]
        },
        "price": {
            "name": "price",
            "jName": "Price",
            "type": "subject",
            "caption": "Price",
            "assigns": [
                {
                    "name": "retail",
                    "type": "assign",
                    "dataType": "dec"
                }
            ]
        },
        "customertree": {
            "name": "customertree",
            "jName": "CustomerTree",
            "type": "tree",
            "caption": "客户分组"
        },
        "vendortree": {
            "name": "vendortree",
            "jName": "VendorTree",
            "type": "tree",
            "caption": "供应商分组"
        },
        "sum": {
            "name": "sum",
            "jName": "Sum",
            "type": "subject",
            "caption": "Sum",
            "assigns": [
                {
                    "name": "psource",
                    "type": "assign",
                    "dataType": "int"
                },
                {
                    "name": "psource1",
                    "type": "assign",
                    "dataType": "int"
                },
                {
                    "name": "startsummonth",
                    "type": "assign",
                    "dataType": "int"
                }
            ]
        },
        "subject": {
            "name": "subject",
            "jName": "Subject",
            "type": "atom",
            "caption": "科目"
        },
        "sumpersonpost": {
            "name": "sumpersonpost",
            "jName": "SumPersonPost",
            "type": "atom",
            "caption": "岗位"
        },
        "sumgrouppost": {
            "name": "sumgrouppost",
            "jName": "SumGroupPost",
            "type": "atom",
            "caption": "职能组"
        },
        "sumgroup": {
            "name": "sumgroup",
            "jName": "SumGroup",
            "type": "atom",
            "caption": "小组合计"
        }
    }
}

export enum EnumAtom {
	b = 'b',
	Contact = 'contact',
	Person = 'person',
	PersonGroup = 'persongroup',
	Goods = 'goods',
	Toy = 'toy',
	Medicine = 'medicine',
	MedicineChinese = 'medicinechinese',
	SpecialMedicineChinese = 'specialmedicinechinese',
	MedicalDevice = 'medicaldevice',
	Shoe = 'shoe',
	Subject = 'subject',
	SumPersonPost = 'sumpersonpost',
	SumGroupPost = 'sumgrouppost',
	SumGroup = 'sumgroup',
}

export enum EnumSheet {
	SheetPurchase = 'sheetpurchase',
	SheetStoreIn = 'sheetstorein',
	SheetStoreInMultiStorage = 'sheetstoreinmultistorage',
	SheetSale = 'sheetsale',
	SheetStoreOut = 'sheetstoreout',
}

export enum EnumDetail {
	DetailPurchase = 'detailpurchase',
	DetailPurchaseMedicine = 'detailpurchasemedicine',
	DetailStoreIn = 'detailstorein',
	DetailSale = 'detailsale',
	DetailStoreOut = 'detailstoreout',
}

export enum EnumSubject {
	storage = 'storage',
	c = 'c',
	AccountSetting = 'accountsetting',
	PersonSetting = 'personsetting',
	Price = 'price',
	Sum = 'sum',
}