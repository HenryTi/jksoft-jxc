//=== UqApp builder created on Tue Apr 16 2024 16:10:08 GMT-0400 (Eastern Daylight Time) ===//
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
	SumFormula = 'sumformula',
	Bud = 'bud',
	History = 'history',
	Atom = 'atom',
	Spec = 'spec',
	Duo = 'duo',
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
	index: number;
}

export interface $phraseInActs extends ID {
	ID?: UqID<any>;
	name: string;
	caption: string;
	base: number;
	valid: number;
	owner: number;
	type: number;
	index: number;
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

export interface ParamSaveAtom {
	atomPhrase: number;
	base: number;
	no: string;
	ex: string;
}
export interface ReturnSaveAtomRet {
	id: number;
}
export interface ResultSaveAtom {
	ret: ReturnSaveAtomRet[];
}

export interface ParamSaveBudValue {
	phraseId: number;
	id: number;
	int: number;
	dec: number;
	str: string;
}
export interface ResultSaveBudValue {
}

export interface ParamSaveBudCheck {
	budPhrase: number;
	id: number;
	optionsItemPhrase: number;
	checked: number;
}
export interface ResultSaveBudCheck {
}

export interface ParamSaveBudRadio {
	budPhrase: number;
	id: number;
	optionsItemPhrase: number;
}
export interface ResultSaveBudRadio {
}

export interface ParamDelAtom {
	id: number;
}
export interface ResultDelAtom {
}

export interface ParamSaveSpec {
	spec: number;
	base: number;
	keys: any;
	props: any;
}
export interface ReturnSaveSpecRet {
	id: number;
}
export interface ResultSaveSpec {
	ret: ReturnSaveSpecRet[];
}

export interface ParamGetSpec {
	id: number;
}
export interface ReturnGetSpecProps {
	id: number;
	phrase: number;
	value: any;
}
export interface ResultGetSpec {
	props: ReturnGetSpecProps[];
}

export interface ParamSaveSheet {
	phrase: number;
	no: string;
	i: number;
	x: number;
	value: number;
	price: number;
	amount: number;
	props: any;
}
export interface ReturnSaveSheetRet {
	id: number;
	no: string;
}
export interface ResultSaveSheet {
	ret: ReturnSaveSheetRet[];
}

export interface ParamSaveDetail {
	base: number;
	phrase: number;
	id: number;
	i: number;
	x: number;
	origin: number;
	value: number;
	price: number;
	amount: number;
	pend: number;
	props: any;
}
export interface ReturnSaveDetailRet {
	id: number;
}
export interface ResultSaveDetail {
	ret: ReturnSaveDetailRet[];
}

export interface ParamDeleteBin {
	id: number;
}
export interface ResultDeleteBin {
}

export interface ParamSubmitSheet {
	id: number;
}
export interface ReturnSubmitSheetCheckPend {
	pend: number;
	value: number;
	overValue: number;
}
export interface ReturnSubmitSheetCheckBin {
	bin: number;
	message: string;
}
export interface ResultSubmitSheet {
	checkPend: ReturnSubmitSheetCheckPend[];
	checkBin: ReturnSubmitSheetCheckBin[];
}

export interface ParamDoQuery {
	query: number;
	json: any;
	pageStart: number;
	pageSize: number;
}
export interface ReturnDoQueryRet {
	id: number;
	ban: number;
	json: any;
}
export interface ResultDoQuery {
	ret: ReturnDoQueryRet[];
}

export interface ParamGetReport {
	reportPhrase: number;
	atomPhrase: number;
	atomId: number;
	dateStart: any;
	dateEnd: any;
	params: any;
}
export interface ReturnGetReport$page {
	id: number;
	phrase: number;
	no: string;
	ex: string;
	value: any;
}
export interface ReturnGetReportSpecs {
	id: number;
	phrase: number;
	base: number;
	value: any;
	props: any;
}
export interface ResultGetReport {
	$page: ReturnGetReport$page[];
	specs: ReturnGetReportSpecs[];
}

export interface ParamGetHistory {
	objId: number;
	title: number;
}
export interface ReturnGetHistory$page {
	id: number;
	value: number;
	ref: number;
	plusMinus: number;
	sheetNo: string;
	sheetPhrase: number;
	binPhrase: number;
}
export interface ResultGetHistory {
	$page: ReturnGetHistory$page[];
}

export interface ParamRemoveDraft {
	id: number;
}
export interface ResultRemoveDraft {
}

export interface ParamGetMyDrafts {
	entitySheet: number;
}
export interface ReturnGetMyDrafts$page {
	id: number;
	base: number;
	no: string;
	operator: number;
	phrase: string;
}
export interface ResultGetMyDrafts {
	$page: ReturnGetMyDrafts$page[];
}

export interface ParamDeleteMyDrafts {
}
export interface ResultDeleteMyDrafts {
}

export interface ParamSearchAtom {
	atom: number;
	key: string;
}
export interface ReturnSearchAtom$page {
	id: number;
	no: string;
	ex: string;
	phrase: number;
}
export interface ResultSearchAtom {
	$page: ReturnSearchAtom$page[];
}

export interface ParamGetAssigns {
	assign: number;
	params: any;
}
export interface ReturnGetAssigns$page {
	id: number;
	no: string;
	ex: string;
	values: any;
}
export interface ResultGetAssigns {
	$page: ReturnGetAssigns$page[];
}

export interface ParamGetTies {
	tie: number;
	params: any;
}
export interface ReturnGetTies$page {
	id: number;
	no: string;
	ex: string;
	values: any;
}
export interface ResultGetTies {
	$page: ReturnGetTies$page[];
}

export interface ParamSaveTie {
	tie: number;
	i: number;
	x: number;
}
export interface ResultSaveTie {
}

export interface ParamDeleteTie {
	tie: number;
	i: number;
	x: number;
}
export interface ResultDeleteTie {
}

export interface ParamSearchAtomBuds {
	phrase: number;
	key: string;
	buds: any;
}
export interface ReturnSearchAtomBuds$page {
	id: number;
	no: string;
	ex: string;
	phrase: number;
}
export interface ReturnSearchAtomBudsMeds {
	id: number;
	main: number;
	detail: number;
}
export interface ReturnSearchAtomBudsBudsInt {
	id: number;
	bud: number;
	value: number;
}
export interface ReturnSearchAtomBudsBudsDec {
	id: number;
	bud: number;
	value: number;
}
export interface ReturnSearchAtomBudsBudsStr {
	id: number;
	bud: number;
	value: string;
}
export interface ResultSearchAtomBuds {
	$page: ReturnSearchAtomBuds$page[];
	meds: ReturnSearchAtomBudsMeds[];
	budsInt: ReturnSearchAtomBudsBudsInt[];
	budsDec: ReturnSearchAtomBudsBudsDec[];
	budsStr: ReturnSearchAtomBudsBudsStr[];
}

export interface ParamGetSheet {
	id: number;
}
export interface ReturnGetSheetMain {
	id: number;
	base: number;
	no: string;
	operator: number;
	origin: number;
	i: number;
	x: number;
	value: number;
	amount: number;
	price: number;
	phrase: number;
}
export interface ReturnGetSheetDetails {
	id: number;
	origin: number;
	i: number;
	x: number;
	value: number;
	amount: number;
	price: number;
	pend: number;
	pendValue: number;
	phrase: number;
}
export interface ReturnGetSheetOrigins {
	id: number;
	origin: number;
	i: number;
	x: number;
	value: number;
	amount: number;
	price: number;
}
export interface ReturnGetSheetProps {
	id: number;
	phrase: number;
	value: any;
}
export interface ResultGetSheet {
	main: ReturnGetSheetMain[];
	details: ReturnGetSheetDetails[];
	origins: ReturnGetSheetOrigins[];
	props: ReturnGetSheetProps[];
}

export interface ParamGetAtom {
	id: number;
}
export interface ReturnGetAtomProps {
	phrase: number;
	value: any;
}
export interface ResultGetAtom {
	props: ReturnGetAtomProps[];
}

export interface ParamGetSpecsFromBase {
	base: number;
}
export interface ReturnGetSpecsFromBaseRet {
	id: number;
	keys: any;
	props: any;
}
export interface ResultGetSpecsFromBase {
	ret: ReturnGetSpecsFromBaseRet[];
}

export interface ParamSaveDuoOuterApp {
	i: number;
	x: number;
}
export interface ReturnSaveDuoOuterAppRet {
	id: number;
}
export interface ResultSaveDuoOuterApp {
	ret: ReturnSaveDuoOuterAppRet[];
}

export interface ParamDelDuoOuterApp {
	id: number;
	i: number;
	x: number;
}
export interface ResultDelDuoOuterApp {
}

export interface ParamGetDuos {
	i: number;
}
export interface ReturnGetDuosRet {
	id: number;
	x: number;
	props: any;
}
export interface ResultGetDuos {
	ret: ReturnGetDuosRet[];
}

export interface ParamClearCode {
}
export interface ResultClearCode {
}

export interface ParamClearPend {
}
export interface ResultClearPend {
}

export interface ParamGetPend {
	pendEntity: number;
	params: any;
	pendId: number;
}
export interface ReturnGetPend$page {
	pend: number;
	sheet: number;
	id: number;
	i: number;
	x: number;
	value: number;
	price: number;
	amount: number;
	pendValue: number;
	mid: any;
	cols: any;
}
export interface ReturnGetPendRetSheet {
	id: number;
	no: string;
	i: number;
	x: number;
	value: number;
	price: number;
	amount: number;
}
export interface ReturnGetPendProps {
	id: number;
	phrase: number;
	value: any;
}
export interface ResultGetPend {
	$page: ReturnGetPend$page[];
	retSheet: ReturnGetPendRetSheet[];
	props: ReturnGetPendProps[];
}

export interface ParamGetPendsNotify {
}
export interface ReturnGetPendsNotifyRet {
	phrase: number;
	count: number;
}
export interface ResultGetPendsNotify {
	ret: ReturnGetPendsNotifyRet[];
}

export interface ParamGetPendSheetFromNo {
	pend: string;
	key: string;
}
export interface ReturnGetPendSheetFromNo$page {
	id: number;
	base: number;
	no: string;
	operator: number;
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
	operator: number;
	sheet: string;
}
export interface ResultGetPendSheetFromTarget {
	$page: ReturnGetPendSheetFromTarget$page[];
}

export interface ParamGetSiteSheets {
	from: any;
	to: any;
	timeZone: number;
}
export interface ReturnGetSiteSheetsRet {
	phrase: number;
	count: number;
}
export interface ResultGetSiteSheets {
	ret: ReturnGetSiteSheetsRet[];
}

export interface ParamGetSiteSheetList {
	phrase: number;
}
export interface ReturnGetSiteSheetList$page {
	id: number;
	base: number;
	no: string;
	operator: number;
	origin: number;
	i: number;
	x: number;
	value: number;
	amount: number;
	price: number;
}
export interface ResultGetSiteSheetList {
	$page: ReturnGetSiteSheetList$page[];
}

export interface ParamSearchAllSheets {
	no: string;
	phrase: number;
	paramMain: any;
	paramDetail: any;
}
export interface ReturnSearchAllSheets$page {
	id: number;
	no: string;
	phrase: number;
	operator: number;
	buds: any;
}
export interface ResultSearchAllSheets {
	$page: ReturnSearchAllSheets$page[];
}

export enum BizPhraseType {
	any = 0,
	atom = 11,
	spec = 12,
	bud = 13,
	budGroup = 14,
	duo = 15,
	sheet = 101,
	main = 102,
	detail = 103,
	pend = 104,
	detailAct = 111,
	query = 151,
	pick = 161,
	role = 201,
	permit = 202,
	options = 301,
	tree = 401,
	tie = 501,
	report = 601,
	in = 701,
	out = 700,
	ioApp = 710,
	ioSite = 711,
	title = 901,
	assign = 902,
	key = 1001,
	prop = 1011,
	optionsitem = 1031,
	console = 6001
}

export enum BudDataType {
	none = 0,
	int = 11,
	atom = 12,
	radio = 13,
	check = 14,
	ID = 19,
	dec = 21,
	char = 31,
	str = 32,
	date = 41,
	datetime = 42,
	optionItem = 81,
	arr = 99
}

export enum BizBudFlag {
	index = 1
}

export interface ParamGetEntityCode {
	id: number;
}
export interface ReturnGetEntityCodeRet {
	code: string;
	schema: string;
}
export interface ResultGetEntityCode {
	ret: ReturnGetEntityCodeRet[];
}

export interface ParamCreateSiteForUser {
	no: string;
	ex: string;
	tonwaUser: number;
}
export interface ReturnCreateSiteForUserRet {
	site: number;
	userSite: number;
}
export interface ResultCreateSiteForUser {
	ret: ReturnCreateSiteForUserRet[];
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
	valid: number;
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
	valid: number;
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

export interface ParamSaveSumFormula {
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
export interface ReturnSaveSumFormulaRet {
	id: number;
}
export interface ResultSaveSumFormula {
	ret: ReturnSaveSumFormulaRet[];
}

export interface ParamChangeSumFormulaCaption {
	id: number;
	caption: string;
}
export interface ResultChangeSumFormulaCaption {
}

export interface ParamChangeSumFormula {
	id: number;
	start: any;
	end: any;
	ratio: number;
}
export interface ReturnChangeSumFormulaRet {
	id: number;
}
export interface ResultChangeSumFormula {
	ret: ReturnChangeSumFormulaRet[];
}

export interface ParamUserSiteFromTonwaUser {
	tonwaUser: number;
}
export interface ReturnUserSiteFromTonwaUserRet {
	userSite: number;
}
export interface ResultUserSiteFromTonwaUser {
	ret: ReturnUserSiteFromTonwaUserRet[];
}

export interface ParamChangeIxMySum {
	userSite: number;
	added: {
		id: number;
	}[];
	removed: {
		idDel: number;
	}[];

}
export interface ResultChangeIxMySum {
}

export interface ParamGetIxMySum {
	userSite: number;
}
export interface ReturnGetIxMySumUsers {
	tonwaUser: number;
	userSite: number;
}
export interface ReturnGetIxMySumAtoms {
	userSite: number;
	atom: number;
	phrase: string;
	no: string;
	ex: string;
}
export interface ResultGetIxMySum {
	users: ReturnGetIxMySumUsers[];
	atoms: ReturnGetIxMySumAtoms[];
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
	valid: number;
}
export interface ResultGetAllFormula {
	ret: ReturnGetAllFormulaRet[];
}

export interface ParamSetSumGroupPerson {
	group: number;
	person: number;
	act: number;
}
export interface ResultSetSumGroupPerson {
}

export interface ParamGetMySums {
	start: any;
	end: any;
}
export interface ReturnGetMySumsRet {
	obj: number;
	post: number;
	subject: number;
	value: number;
}
export interface ResultGetMySums {
	ret: ReturnGetMySumsRet[];
}

export interface ParamGetMyBalance {
}
export interface ReturnGetMyBalanceRet {
	obj: number;
	post: number;
	subject: number;
	value: number;
}
export interface ResultGetMyBalance {
	ret: ReturnGetMyBalanceRet[];
}

export interface IxBud extends IX {
	i: number;
	x: number;
}

export interface Bud extends ID {
	base: number;
	ext: number;
}

export interface BudInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
	ext: number | ID;
}

export interface History extends ID {
	bud: number;
	value: number;
	ref: number;
	plusMinus: number;
}

export interface HistoryInActs extends ID {
	ID?: UqID<any>;
	bud: number | ID;
	value: number;
	ref: number | ID;
	plusMinus: number;
}

export interface Atom extends ID {
	base: number;
	no?: string;
	ex: string;
}

export interface AtomInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
	no?: string;
	ex: string;
}

export interface Spec extends ID {
	base: number;
}

export interface SpecInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
}

export interface Duo extends ID {
	i: number;
	x: number;
	valid: number;
}

export interface DuoInActs extends ID {
	ID?: UqID<any>;
	i: number | ID;
	x: number | ID;
	valid: number;
}

export interface Sheet extends ID {
	base: number;
	no: string;
	operator: number;
}

export interface SheetInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
	no: string;
	operator: number | ID;
}

export interface Detail extends ID {
	base: number;
}

export interface DetailInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
}

export interface Pend extends ID {
	base: number;
	bin: number;
	mid: any;
	value: number;
}

export interface PendInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
	bin: number | ID;
	mid: any;
	value: number;
}

export interface ParamGetSiteSetting {
}
export interface ReturnGetSiteSettingBudsInt {
	bud: number;
	value: number;
}
export interface ReturnGetSiteSettingBudsDec {
	bud: number;
	value: number;
}
export interface ReturnGetSiteSettingBudsStr {
	bud: number;
	value: string;
}
export interface ReturnGetSiteSettingBudsCheck {
	bud: number;
	item: number;
}
export interface ResultGetSiteSetting {
	budsInt: ReturnGetSiteSettingBudsInt[];
	budsDec: ReturnGetSiteSettingBudsDec[];
	budsStr: ReturnGetSiteSettingBudsStr[];
	budsCheck: ReturnGetSiteSettingBudsCheck[];
}

export interface ParamGetIOSiteAtoms {
	ioSite: number;
}
export interface ReturnGetIOSiteAtoms$page {
	id: number;
	no: string;
	ex: string;
	ioSiteAtom: number;
	errorCount: number;
}
export interface ResultGetIOSiteAtoms {
	$page: ReturnGetIOSiteAtoms$page[];
}

export interface ParamGetIOAtomApps {
	ioSite: number;
	atom: number;
}
export interface ReturnGetIOAtomAppsRet {
	ioSite: number;
	atom: number;
	ioApp: number;
	siteAtomApp: number;
	inKey: string;
	inPassword: string;
	outUrl: string;
	outKey: string;
	outPassword: string;
	valid: number;
}
export interface ResultGetIOAtomApps {
	ret: ReturnGetIOAtomAppsRet[];
}

export interface ParamSetIOSiteAtomAppOut {
	ioSiteAtomApp: number;
	outUrl: string;
	outKey: string;
	outPassword: string;
}
export interface ResultSetIOSiteAtomAppOut {
}

export interface ParamSaveIOAtom {
	id: number;
	ioSite: number;
	siteAtom: number;
	ioApp: number;
	ioAppID: number;
	atom: number;
	no: string;
}
export interface ReturnSaveIOAtomRet {
	id: number;
}
export interface ResultSaveIOAtom {
	ret: ReturnSaveIOAtomRet[];
}

export interface ParamGetIOAtoms {
	ioSite: number;
	siteAtom: number;
	ioApp: number;
	ioAppID: number;
}
export interface ReturnGetIOAtoms$page {
	atom: number;
	atomNo: string;
	atomEx: string;
	no: string;
}
export interface ResultGetIOAtoms {
	$page: ReturnGetIOAtoms$page[];
}

export interface ParamGetIOErrorCounts {
}
export interface ReturnGetIOErrorCountsRet {
	siteAtomApp: number;
	ioSite: number;
	ioAtom: number;
	ioApp: number;
	errorCount: number;
}
export interface ResultGetIOErrorCounts {
	ret: ReturnGetIOErrorCountsRet[];
}

export interface ParamGetIOError {
	siteAtomApp: number;
}
export interface ReturnGetIOError$page {
	id: number;
	siteAtomApp: number;
	appIO: number;
	result: any;
	times: number;
	done: any;
}
export interface ResultGetIOError {
	$page: ReturnGetIOError$page[];
}

export interface ParamIORetry {
	id: number;
}
export interface ResultIORetry {
}

export interface ParamBuildAtomUnique {
	phrase: number;
	start: number;
	batchNumber: number;
}
export interface ReturnBuildAtomUniqueRet {
	batchDone: number;
	lastId: number;
}
export interface ReturnBuildAtomUniqueDupTable {
	unique: number;
	i: number;
	x: string;
	atom: number;
}
export interface ResultBuildAtomUnique {
	ret: ReturnBuildAtomUniqueRet[];
	DupTable: ReturnBuildAtomUniqueDupTable[];
}



export interface ParamActs {
	$phrase?: $phraseInActs[];
	sumFormula?: SumFormulaInActs[];
	ixBud?: IxBud[];
	bud?: BudInActs[];
	history?: HistoryInActs[];
	atom?: AtomInActs[];
	spec?: SpecInActs[];
	duo?: DuoInActs[];
	sheet?: SheetInActs[];
	detail?: DetailInActs[];
	pend?: PendInActs[];
}


export interface UqExt extends Uq {
	Acts(param:ParamActs): Promise<any>;
	SQL: Uq;
    Role: { [key: string]: string[] };

	$phrase: UqID<any>;
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
	SaveAtom: UqAction<ParamSaveAtom, ResultSaveAtom>;
	SaveBudValue: UqAction<ParamSaveBudValue, ResultSaveBudValue>;
	SaveBudCheck: UqAction<ParamSaveBudCheck, ResultSaveBudCheck>;
	SaveBudRadio: UqAction<ParamSaveBudRadio, ResultSaveBudRadio>;
	DelAtom: UqAction<ParamDelAtom, ResultDelAtom>;
	SaveSpec: UqAction<ParamSaveSpec, ResultSaveSpec>;
	GetSpec: UqQuery<ParamGetSpec, ResultGetSpec>;
	SaveSheet: UqAction<ParamSaveSheet, ResultSaveSheet>;
	SaveDetail: UqAction<ParamSaveDetail, ResultSaveDetail>;
	DeleteBin: UqAction<ParamDeleteBin, ResultDeleteBin>;
	SubmitSheet: UqAction<ParamSubmitSheet, ResultSubmitSheet>;
	DoQuery: UqAction<ParamDoQuery, ResultDoQuery>;
	GetReport: UqQuery<ParamGetReport, ResultGetReport>;
	GetHistory: UqQuery<ParamGetHistory, ResultGetHistory>;
	RemoveDraft: UqAction<ParamRemoveDraft, ResultRemoveDraft>;
	GetMyDrafts: UqQuery<ParamGetMyDrafts, ResultGetMyDrafts>;
	DeleteMyDrafts: UqAction<ParamDeleteMyDrafts, ResultDeleteMyDrafts>;
	SearchAtom: UqQuery<ParamSearchAtom, ResultSearchAtom>;
	GetAssigns: UqQuery<ParamGetAssigns, ResultGetAssigns>;
	GetTies: UqQuery<ParamGetTies, ResultGetTies>;
	SaveTie: UqAction<ParamSaveTie, ResultSaveTie>;
	DeleteTie: UqAction<ParamDeleteTie, ResultDeleteTie>;
	SearchAtomBuds: UqQuery<ParamSearchAtomBuds, ResultSearchAtomBuds>;
	GetSheet: UqQuery<ParamGetSheet, ResultGetSheet>;
	GetAtom: UqQuery<ParamGetAtom, ResultGetAtom>;
	GetSpecsFromBase: UqQuery<ParamGetSpecsFromBase, ResultGetSpecsFromBase>;
	SaveDuoOuterApp: UqAction<ParamSaveDuoOuterApp, ResultSaveDuoOuterApp>;
	DelDuoOuterApp: UqAction<ParamDelDuoOuterApp, ResultDelDuoOuterApp>;
	GetDuos: UqQuery<ParamGetDuos, ResultGetDuos>;
	ClearCode: UqAction<ParamClearCode, ResultClearCode>;
	ClearPend: UqAction<ParamClearPend, ResultClearPend>;
	GetPend: UqQuery<ParamGetPend, ResultGetPend>;
	GetPendsNotify: UqQuery<ParamGetPendsNotify, ResultGetPendsNotify>;
	GetPendSheetFromNo: UqQuery<ParamGetPendSheetFromNo, ResultGetPendSheetFromNo>;
	GetPendSheetFromTarget: UqQuery<ParamGetPendSheetFromTarget, ResultGetPendSheetFromTarget>;
	GetSiteSheets: UqQuery<ParamGetSiteSheets, ResultGetSiteSheets>;
	GetSiteSheetList: UqQuery<ParamGetSiteSheetList, ResultGetSiteSheetList>;
	SearchAllSheets: UqQuery<ParamSearchAllSheets, ResultSearchAllSheets>;
	GetEntityCode: UqQuery<ParamGetEntityCode, ResultGetEntityCode>;
	CreateSiteForUser: UqAction<ParamCreateSiteForUser, ResultCreateSiteForUser>;
	SumFormula: UqID<any>;
	SearchGroupPersons: UqQuery<ParamSearchGroupPersons, ResultSearchGroupPersons>;
	SaveSumFormula: UqAction<ParamSaveSumFormula, ResultSaveSumFormula>;
	ChangeSumFormulaCaption: UqAction<ParamChangeSumFormulaCaption, ResultChangeSumFormulaCaption>;
	ChangeSumFormula: UqAction<ParamChangeSumFormula, ResultChangeSumFormula>;
	UserSiteFromTonwaUser: UqAction<ParamUserSiteFromTonwaUser, ResultUserSiteFromTonwaUser>;
	ChangeIxMySum: UqAction<ParamChangeIxMySum, ResultChangeIxMySum>;
	GetIxMySum: UqQuery<ParamGetIxMySum, ResultGetIxMySum>;
	GetAllFormula: UqQuery<ParamGetAllFormula, ResultGetAllFormula>;
	SetSumGroupPerson: UqAction<ParamSetSumGroupPerson, ResultSetSumGroupPerson>;
	GetMySums: UqQuery<ParamGetMySums, ResultGetMySums>;
	GetMyBalance: UqQuery<ParamGetMyBalance, ResultGetMyBalance>;
	IxBud: UqIX<any>;
	Bud: UqID<any>;
	History: UqID<any>;
	Atom: UqID<any>;
	Spec: UqID<any>;
	Duo: UqID<any>;
	Sheet: UqID<any>;
	Detail: UqID<any>;
	Pend: UqID<any>;
	GetSiteSetting: UqQuery<ParamGetSiteSetting, ResultGetSiteSetting>;
	GetIOSiteAtoms: UqQuery<ParamGetIOSiteAtoms, ResultGetIOSiteAtoms>;
	GetIOAtomApps: UqQuery<ParamGetIOAtomApps, ResultGetIOAtomApps>;
	SetIOSiteAtomAppOut: UqAction<ParamSetIOSiteAtomAppOut, ResultSetIOSiteAtomAppOut>;
	SaveIOAtom: UqAction<ParamSaveIOAtom, ResultSaveIOAtom>;
	GetIOAtoms: UqQuery<ParamGetIOAtoms, ResultGetIOAtoms>;
	GetIOErrorCounts: UqQuery<ParamGetIOErrorCounts, ResultGetIOErrorCounts>;
	GetIOError: UqQuery<ParamGetIOError, ResultGetIOError>;
	IORetry: UqAction<ParamIORetry, ResultIORetry>;
	BuildAtomUnique: UqAction<ParamBuildAtomUnique, ResultBuildAtomUnique>;
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
            },
            {
                "name": "index",
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
    "saveatom": {
        "name": "SaveAtom",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "atomPhrase",
                "type": "id"
            },
            {
                "name": "base",
                "type": "bigint"
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
    "savebudvalue": {
        "name": "SaveBudValue",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "phraseId",
                "type": "id"
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
    "savebudcheck": {
        "name": "SaveBudCheck",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "budPhrase",
                "type": "id"
            },
            {
                "name": "id",
                "type": "id"
            },
            {
                "name": "optionsItemPhrase",
                "type": "id"
            },
            {
                "name": "checked",
                "type": "tinyint"
            }
        ],
        "returns": [] as any
    },
    "savebudradio": {
        "name": "SaveBudRadio",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "budPhrase",
                "type": "id"
            },
            {
                "name": "id",
                "type": "id"
            },
            {
                "name": "optionsItemPhrase",
                "type": "id"
            }
        ],
        "returns": [] as any
    },
    "delatom": {
        "name": "DelAtom",
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
    "savespec": {
        "name": "SaveSpec",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "spec",
                "type": "id"
            },
            {
                "name": "base",
                "type": "id"
            },
            {
                "name": "keys",
                "type": "json"
            },
            {
                "name": "props",
                "type": "json"
            }
        ],
        "jsoned": true,
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
    "getspec": {
        "name": "GetSpec",
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
                "name": "props",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "phrase",
                        "type": "id"
                    },
                    {
                        "name": "value",
                        "type": "json"
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
                "name": "phrase",
                "type": "id"
            },
            {
                "name": "no",
                "type": "char",
                "size": 30
            },
            {
                "name": "i",
                "type": "id"
            },
            {
                "name": "x",
                "type": "id"
            },
            {
                "name": "value",
                "type": "dec",
                "scale": 6,
                "precision": 18
            },
            {
                "name": "price",
                "type": "dec",
                "scale": 6,
                "precision": 18
            },
            {
                "name": "amount",
                "type": "dec",
                "scale": 6,
                "precision": 18
            },
            {
                "name": "props",
                "type": "json"
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
                        "name": "no",
                        "type": "char",
                        "size": 30
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
                "name": "phrase",
                "type": "id"
            },
            {
                "name": "id",
                "type": "id"
            },
            {
                "name": "i",
                "type": "id"
            },
            {
                "name": "x",
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
                "name": "price",
                "type": "dec",
                "scale": 6,
                "precision": 18
            },
            {
                "name": "amount",
                "type": "dec",
                "scale": 6,
                "precision": 18
            },
            {
                "name": "pend",
                "type": "id"
            },
            {
                "name": "props",
                "type": "json"
            }
        ],
        "jsoned": true,
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
    "deletebin": {
        "name": "DeleteBin",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id"
            }
        ],
        "jsoned": true,
        "returns": [] as any
    },
    "submitsheet": {
        "name": "SubmitSheet",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id"
            }
        ],
        "jsoned": true,
        "returns": [
            {
                "name": "checkPend",
                "fields": [
                    {
                        "name": "pend",
                        "type": "id"
                    },
                    {
                        "name": "value",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "overValue",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    }
                ]
            },
            {
                "name": "checkBin",
                "fields": [
                    {
                        "name": "bin",
                        "type": "id"
                    },
                    {
                        "name": "message",
                        "type": "char",
                        "size": 200
                    }
                ]
            }
        ]
    },
    "doquery": {
        "name": "DoQuery",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "query",
                "type": "id"
            },
            {
                "name": "json",
                "type": "json"
            },
            {
                "name": "pageStart",
                "type": "int"
            },
            {
                "name": "pageSize",
                "type": "int"
            }
        ],
        "jsoned": true,
        "returns": [
            {
                "name": "ret",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "ban",
                        "type": "tinyint"
                    },
                    {
                        "name": "json",
                        "type": "json"
                    }
                ]
            }
        ]
    },
    "getreport": {
        "name": "GetReport",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "reportPhrase",
                "type": "id"
            },
            {
                "name": "atomPhrase",
                "type": "id"
            },
            {
                "name": "atomId",
                "type": "id"
            },
            {
                "name": "dateStart",
                "type": "date"
            },
            {
                "name": "dateEnd",
                "type": "date"
            },
            {
                "name": "params",
                "type": "json"
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
                        "name": "phrase",
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
                        "size": 200
                    },
                    {
                        "name": "value",
                        "type": "json"
                    }
                ],
                "order": "asc"
            },
            {
                "name": "specs",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "phrase",
                        "type": "id"
                    },
                    {
                        "name": "base",
                        "type": "id"
                    },
                    {
                        "name": "value",
                        "type": "json"
                    },
                    {
                        "name": "props",
                        "type": "json"
                    }
                ]
            }
        ]
    },
    "gethistory": {
        "name": "GetHistory",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "objId",
                "type": "id"
            },
            {
                "name": "title",
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
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "ref",
                        "type": "id"
                    },
                    {
                        "name": "plusMinus",
                        "type": "tinyint"
                    },
                    {
                        "name": "sheetNo",
                        "type": "char",
                        "size": 30
                    },
                    {
                        "name": "sheetPhrase",
                        "type": "id"
                    },
                    {
                        "name": "binPhrase",
                        "type": "id"
                    }
                ],
                "order": "desc"
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
        "fields": [
            {
                "name": "entitySheet",
                "type": "id"
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
                        "name": "operator",
                        "type": "id"
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
    "deletemydrafts": {
        "name": "DeleteMyDrafts",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [] as any,
        "jsoned": true,
        "returns": [] as any
    },
    "searchatom": {
        "name": "SearchAtom",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "atom",
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
                        "type": "id"
                    }
                ],
                "order": "desc"
            }
        ]
    },
    "getassigns": {
        "name": "GetAssigns",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "assign",
                "type": "id"
            },
            {
                "name": "params",
                "type": "json"
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
                        "size": 30
                    },
                    {
                        "name": "ex",
                        "type": "char",
                        "size": 200
                    },
                    {
                        "name": "values",
                        "type": "json"
                    }
                ],
                "order": "asc"
            }
        ]
    },
    "getties": {
        "name": "GetTies",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "tie",
                "type": "id"
            },
            {
                "name": "params",
                "type": "json"
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
                        "size": 30
                    },
                    {
                        "name": "ex",
                        "type": "char",
                        "size": 200
                    },
                    {
                        "name": "values",
                        "type": "json"
                    }
                ],
                "order": "asc"
            }
        ]
    },
    "savetie": {
        "name": "SaveTie",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "tie",
                "type": "id"
            },
            {
                "name": "i",
                "type": "id"
            },
            {
                "name": "x",
                "type": "id"
            }
        ],
        "jsoned": true,
        "returns": [] as any
    },
    "deletetie": {
        "name": "DeleteTie",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "tie",
                "type": "id"
            },
            {
                "name": "i",
                "type": "id"
            },
            {
                "name": "x",
                "type": "id"
            }
        ],
        "jsoned": true,
        "returns": [] as any
    },
    "searchatombuds": {
        "name": "SearchAtomBuds",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "phrase",
                "type": "id"
            },
            {
                "name": "key",
                "type": "char",
                "size": 50
            },
            {
                "name": "buds",
                "type": "json"
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
                        "type": "id"
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
                        "name": "operator",
                        "type": "id"
                    },
                    {
                        "name": "origin",
                        "type": "id"
                    },
                    {
                        "name": "i",
                        "type": "id"
                    },
                    {
                        "name": "x",
                        "type": "id"
                    },
                    {
                        "name": "value",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "amount",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "price",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "phrase",
                        "type": "id"
                    }
                ]
            },
            {
                "name": "details",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "origin",
                        "type": "id"
                    },
                    {
                        "name": "i",
                        "type": "id"
                    },
                    {
                        "name": "x",
                        "type": "id"
                    },
                    {
                        "name": "value",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "amount",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "price",
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
                        "name": "phrase",
                        "type": "id"
                    }
                ]
            },
            {
                "name": "origins",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "origin",
                        "type": "id"
                    },
                    {
                        "name": "i",
                        "type": "id"
                    },
                    {
                        "name": "x",
                        "type": "id"
                    },
                    {
                        "name": "value",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "amount",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "price",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    }
                ]
            },
            {
                "name": "props",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "phrase",
                        "type": "id"
                    },
                    {
                        "name": "value",
                        "type": "json"
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
                "name": "props",
                "fields": [
                    {
                        "name": "phrase",
                        "type": "id"
                    },
                    {
                        "name": "value",
                        "type": "json"
                    }
                ]
            }
        ]
    },
    "getspecsfrombase": {
        "name": "GetSpecsFromBase",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "base",
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
                        "name": "keys",
                        "type": "json"
                    },
                    {
                        "name": "props",
                        "type": "json"
                    }
                ]
            }
        ]
    },
    "saveduoouterapp": {
        "name": "SaveDuoOuterApp",
        "type": "action",
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
        "jsoned": true,
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
    "delduoouterapp": {
        "name": "DelDuoOuterApp",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id"
            },
            {
                "name": "i",
                "type": "id"
            },
            {
                "name": "x",
                "type": "id"
            }
        ],
        "jsoned": true,
        "returns": [] as any
    },
    "getduos": {
        "name": "GetDuos",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "i",
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
                        "name": "x",
                        "type": "id"
                    },
                    {
                        "name": "props",
                        "type": "json"
                    }
                ]
            }
        ]
    },
    "clearcode": {
        "name": "ClearCode",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [] as any,
        "jsoned": true,
        "returns": [] as any
    },
    "clearpend": {
        "name": "ClearPend",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [] as any,
        "jsoned": true,
        "returns": [] as any
    },
    "getpend": {
        "name": "GetPend",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "pendEntity",
                "type": "id"
            },
            {
                "name": "params",
                "type": "json"
            },
            {
                "name": "pendId",
                "type": "id"
            }
        ],
        "returns": [
            {
                "name": "$page",
                "fields": [
                    {
                        "name": "pend",
                        "type": "id"
                    },
                    {
                        "name": "sheet",
                        "type": "id"
                    },
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "i",
                        "type": "id"
                    },
                    {
                        "name": "x",
                        "type": "id"
                    },
                    {
                        "name": "value",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "price",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "amount",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "pendValue",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "mid",
                        "type": "json"
                    },
                    {
                        "name": "cols",
                        "type": "json"
                    }
                ],
                "order": "asc"
            },
            {
                "name": "retSheet",
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
                        "name": "i",
                        "type": "id"
                    },
                    {
                        "name": "x",
                        "type": "id"
                    },
                    {
                        "name": "value",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "price",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "amount",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    }
                ]
            },
            {
                "name": "props",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "phrase",
                        "type": "id"
                    },
                    {
                        "name": "value",
                        "type": "json"
                    }
                ]
            }
        ]
    },
    "getpendsnotify": {
        "name": "GetPendsNotify",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [] as any,
        "returns": [
            {
                "name": "ret",
                "fields": [
                    {
                        "name": "phrase",
                        "type": "id"
                    },
                    {
                        "name": "count",
                        "type": "int"
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
                        "name": "operator",
                        "type": "id"
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
                        "name": "operator",
                        "type": "id"
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
    "getsitesheets": {
        "name": "GetSiteSheets",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "from",
                "type": "date"
            },
            {
                "name": "to",
                "type": "date"
            },
            {
                "name": "timeZone",
                "type": "tinyint"
            }
        ],
        "returns": [
            {
                "name": "ret",
                "fields": [
                    {
                        "name": "phrase",
                        "type": "id"
                    },
                    {
                        "name": "count",
                        "type": "int"
                    }
                ]
            }
        ]
    },
    "getsitesheetlist": {
        "name": "GetSiteSheetList",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "phrase",
                "type": "id"
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
                        "name": "operator",
                        "type": "id"
                    },
                    {
                        "name": "origin",
                        "type": "id"
                    },
                    {
                        "name": "i",
                        "type": "id"
                    },
                    {
                        "name": "x",
                        "type": "id"
                    },
                    {
                        "name": "value",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "amount",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "price",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    }
                ],
                "order": "asc"
            }
        ]
    },
    "searchallsheets": {
        "name": "SearchAllSheets",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "no",
                "type": "char",
                "size": 30
            },
            {
                "name": "phrase",
                "type": "id"
            },
            {
                "name": "paramMain",
                "type": "json"
            },
            {
                "name": "paramDetail",
                "type": "json"
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
                        "size": 30
                    },
                    {
                        "name": "phrase",
                        "type": "id"
                    },
                    {
                        "name": "operator",
                        "type": "id"
                    },
                    {
                        "name": "buds",
                        "type": "json"
                    }
                ],
                "order": "desc"
            }
        ]
    },
    "bizphrasetype": {
        "name": "BizPhraseType",
        "type": "enum",
        "private": false,
        "sys": true,
        "values": {
            "any": 0,
            "atom": 11,
            "spec": 12,
            "bud": 13,
            "budGroup": 14,
            "duo": 15,
            "sheet": 101,
            "main": 102,
            "detail": 103,
            "pend": 104,
            "detailAct": 111,
            "query": 151,
            "pick": 161,
            "role": 201,
            "permit": 202,
            "options": 301,
            "tree": 401,
            "tie": 501,
            "report": 601,
            "in": 701,
            "out": 700,
            "ioApp": 710,
            "ioSite": 711,
            "title": 901,
            "assign": 902,
            "key": 1001,
            "prop": 1011,
            "optionsitem": 1031,
            "console": 6001
        }
    },
    "buddatatype": {
        "name": "BudDataType",
        "type": "enum",
        "private": false,
        "sys": true,
        "values": {
            "none": 0,
            "int": 11,
            "atom": 12,
            "radio": 13,
            "check": 14,
            "ID": 19,
            "dec": 21,
            "char": 31,
            "str": 32,
            "date": 41,
            "datetime": 42,
            "optionItem": 81,
            "arr": 99
        }
    },
    "bizbudflag": {
        "name": "BizBudFlag",
        "type": "enum",
        "private": false,
        "sys": true,
        "values": {
            "index": 1
        }
    },
    "getentitycode": {
        "name": "GetEntityCode",
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
                        "name": "code",
                        "type": "text"
                    },
                    {
                        "name": "schema",
                        "type": "text"
                    }
                ]
            }
        ]
    },
    "createsiteforuser": {
        "name": "CreateSiteForUser",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "no",
                "type": "char",
                "size": 30
            },
            {
                "name": "ex",
                "type": "char",
                "size": 200
            },
            {
                "name": "tonwaUser",
                "type": "id"
            }
        ],
        "jsoned": true,
        "returns": [
            {
                "name": "ret",
                "fields": [
                    {
                        "name": "site",
                        "type": "id"
                    },
                    {
                        "name": "userSite",
                        "type": "id"
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
            },
            {
                "name": "valid",
                "type": "tinyint"
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
    "savesumformula": {
        "name": "SaveSumFormula",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id"
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
    "changesumformulacaption": {
        "name": "ChangeSumFormulaCaption",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id"
            },
            {
                "name": "caption",
                "type": "char",
                "size": 100
            }
        ],
        "returns": [] as any
    },
    "changesumformula": {
        "name": "ChangeSumFormula",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id"
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
    "usersitefromtonwauser": {
        "name": "UserSiteFromTonwaUser",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "tonwaUser",
                "type": "id"
            }
        ],
        "returns": [
            {
                "name": "ret",
                "fields": [
                    {
                        "name": "userSite",
                        "type": "id"
                    }
                ]
            }
        ]
    },
    "changeixmysum": {
        "name": "ChangeIxMySum",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "userSite",
                "type": "id"
            }
        ],
        "arrs": [
            {
                "name": "added",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    }
                ]
            },
            {
                "name": "removed",
                "fields": [
                    {
                        "name": "idDel",
                        "type": "id"
                    }
                ]
            }
        ],
        "returns": [] as any
    },
    "getixmysum": {
        "name": "GetIxMySum",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "userSite",
                "type": "id"
            }
        ],
        "returns": [
            {
                "name": "users",
                "fields": [
                    {
                        "name": "tonwaUser",
                        "type": "id"
                    },
                    {
                        "name": "userSite",
                        "type": "id"
                    }
                ]
            },
            {
                "name": "atoms",
                "fields": [
                    {
                        "name": "userSite",
                        "type": "id"
                    },
                    {
                        "name": "atom",
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
                        "size": 30
                    },
                    {
                        "name": "ex",
                        "type": "char",
                        "size": 200
                    }
                ]
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
                    },
                    {
                        "name": "valid",
                        "type": "tinyint"
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
    "getmysums": {
        "name": "GetMySums",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "start",
                "type": "date"
            },
            {
                "name": "end",
                "type": "date"
            }
        ],
        "returns": [
            {
                "name": "ret",
                "fields": [
                    {
                        "name": "obj",
                        "type": "id"
                    },
                    {
                        "name": "post",
                        "type": "id"
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
                    }
                ]
            }
        ]
    },
    "getmybalance": {
        "name": "GetMyBalance",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [] as any,
        "returns": [
            {
                "name": "ret",
                "fields": [
                    {
                        "name": "obj",
                        "type": "id"
                    },
                    {
                        "name": "post",
                        "type": "id"
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
                    }
                ]
            }
        ]
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
        "ii": false,
        "hasSort": false,
        "xType": 0
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
                "name": "ext",
                "type": "id"
            }
        ],
        "keys": [
            {
                "name": "base",
                "type": "id"
            },
            {
                "name": "ext",
                "type": "id"
            }
        ],
        "global": false,
        "idType": 3,
        "isMinute": true
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
                "name": "bud",
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
                "name": "plusMinus",
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
                "size": 30
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
            }
        ],
        "global": false,
        "idType": 3,
        "isMinute": false
    },
    "spec": {
        "name": "Spec",
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
            }
        ],
        "keys": [
            {
                "name": "base",
                "type": "id"
            }
        ],
        "global": false,
        "idType": 3,
        "isMinute": false
    },
    "duo": {
        "name": "Duo",
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
                "name": "i",
                "type": "id"
            },
            {
                "name": "x",
                "type": "id"
            },
            {
                "name": "valid",
                "type": "tinyint"
            }
        ],
        "keys": [
            {
                "name": "i",
                "type": "id"
            },
            {
                "name": "x",
                "type": "id"
            }
        ],
        "global": false,
        "idType": 3,
        "isMinute": true
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
                "name": "operator",
                "type": "id"
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
            }
        ],
        "keys": [
            {
                "name": "base",
                "type": "id"
            }
        ],
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
                "name": "bin",
                "type": "id"
            },
            {
                "name": "mid",
                "type": "json"
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
            }
        ],
        "global": false,
        "idType": 3,
        "isMinute": true
    },
    "getsitesetting": {
        "name": "GetSiteSetting",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [] as any,
        "returns": [
            {
                "name": "budsInt",
                "fields": [
                    {
                        "name": "bud",
                        "type": "id"
                    },
                    {
                        "name": "value",
                        "type": "bigint"
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
                        "name": "value",
                        "type": "char",
                        "size": 200
                    }
                ]
            },
            {
                "name": "budsCheck",
                "fields": [
                    {
                        "name": "bud",
                        "type": "id"
                    },
                    {
                        "name": "item",
                        "type": "id"
                    }
                ]
            }
        ]
    },
    "getiositeatoms": {
        "name": "GetIOSiteAtoms",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "ioSite",
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
                        "name": "no",
                        "type": "char",
                        "size": 30
                    },
                    {
                        "name": "ex",
                        "type": "char",
                        "size": 200
                    },
                    {
                        "name": "ioSiteAtom",
                        "type": "id"
                    },
                    {
                        "name": "errorCount",
                        "type": "int"
                    }
                ],
                "order": "asc"
            }
        ]
    },
    "getioatomapps": {
        "name": "GetIOAtomApps",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "ioSite",
                "type": "id"
            },
            {
                "name": "atom",
                "type": "id"
            }
        ],
        "returns": [
            {
                "name": "ret",
                "fields": [
                    {
                        "name": "ioSite",
                        "type": "id"
                    },
                    {
                        "name": "atom",
                        "type": "id"
                    },
                    {
                        "name": "ioApp",
                        "type": "id"
                    },
                    {
                        "name": "siteAtomApp",
                        "type": "id"
                    },
                    {
                        "name": "inKey",
                        "type": "char",
                        "size": 400
                    },
                    {
                        "name": "inPassword",
                        "type": "char",
                        "size": 50
                    },
                    {
                        "name": "outUrl",
                        "type": "char",
                        "size": 200
                    },
                    {
                        "name": "outKey",
                        "type": "char",
                        "size": 400
                    },
                    {
                        "name": "outPassword",
                        "type": "char",
                        "size": 30
                    },
                    {
                        "name": "valid",
                        "type": "tinyint"
                    }
                ]
            }
        ]
    },
    "setiositeatomappout": {
        "name": "SetIOSiteAtomAppOut",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "ioSiteAtomApp",
                "type": "id"
            },
            {
                "name": "outUrl",
                "type": "char",
                "size": 200
            },
            {
                "name": "outKey",
                "type": "char",
                "size": 400
            },
            {
                "name": "outPassword",
                "type": "char",
                "size": 30
            }
        ],
        "jsoned": true,
        "returns": [] as any
    },
    "saveioatom": {
        "name": "SaveIOAtom",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id"
            },
            {
                "name": "ioSite",
                "type": "id"
            },
            {
                "name": "siteAtom",
                "type": "id"
            },
            {
                "name": "ioApp",
                "type": "id"
            },
            {
                "name": "ioAppID",
                "type": "id"
            },
            {
                "name": "atom",
                "type": "id"
            },
            {
                "name": "no",
                "type": "char",
                "size": 30
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
    "getioatoms": {
        "name": "GetIOAtoms",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "ioSite",
                "type": "id"
            },
            {
                "name": "siteAtom",
                "type": "id"
            },
            {
                "name": "ioApp",
                "type": "id"
            },
            {
                "name": "ioAppID",
                "type": "id"
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
                        "name": "no",
                        "type": "char",
                        "size": 30
                    }
                ],
                "order": "asc"
            }
        ]
    },
    "getioerrorcounts": {
        "name": "GetIOErrorCounts",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [] as any,
        "returns": [
            {
                "name": "ret",
                "fields": [
                    {
                        "name": "siteAtomApp",
                        "type": "id"
                    },
                    {
                        "name": "ioSite",
                        "type": "id"
                    },
                    {
                        "name": "ioAtom",
                        "type": "id"
                    },
                    {
                        "name": "ioApp",
                        "type": "id"
                    },
                    {
                        "name": "errorCount",
                        "type": "int"
                    }
                ]
            }
        ]
    },
    "getioerror": {
        "name": "GetIOError",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "siteAtomApp",
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
                        "name": "siteAtomApp",
                        "type": "id"
                    },
                    {
                        "name": "appIO",
                        "type": "id"
                    },
                    {
                        "name": "result",
                        "type": "json"
                    },
                    {
                        "name": "times",
                        "type": "smallint"
                    },
                    {
                        "name": "done",
                        "type": "enum"
                    }
                ],
                "order": "desc"
            }
        ]
    },
    "ioretry": {
        "name": "IORetry",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id"
            }
        ],
        "jsoned": true,
        "returns": [] as any
    },
    "buildatomunique": {
        "name": "BuildAtomUnique",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "phrase",
                "type": "id"
            },
            {
                "name": "start",
                "type": "id"
            },
            {
                "name": "batchNumber",
                "type": "int"
            }
        ],
        "jsoned": true,
        "returns": [
            {
                "name": "ret",
                "fields": [
                    {
                        "name": "batchDone",
                        "type": "int"
                    },
                    {
                        "name": "lastId",
                        "type": "id"
                    }
                ]
            },
            {
                "name": "DupTable",
                "fields": [
                    {
                        "name": "unique",
                        "type": "id"
                    },
                    {
                        "name": "i",
                        "type": "id"
                    },
                    {
                        "name": "x",
                        "type": "char",
                        "size": 30
                    },
                    {
                        "name": "atom",
                        "type": "id"
                    }
                ]
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
        "sum": {
            "name": "sum",
            "jName": "Sum",
            "type": "moniker",
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
                }
            ]
        },
        "subject": {
            "name": "subject",
            "jName": "Subject",
            "type": "atom",
            "caption": "科目",
            "props": [
                {
                    "name": "balance",
                    "type": "prop",
                    "caption": "结余",
                    "dataType": "radio",
                    "items": [
                        [
                            "none",
                            "无",
                            0
                        ],
                        [
                            "yes",
                            "有",
                            1
                        ]
                    ]
                }
            ],
            "uom": true
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
        },
        "sitesetting": {
            "name": "sitesetting",
            "jName": "SiteSetting",
            "type": "moniker",
            "caption": "SiteSetting",
            "assigns": [
                {
                    "name": "currency",
                    "type": "assign",
                    "caption": "默认货币",
                    "dataType": "ID"
                },
                {
                    "name": "startsummonth",
                    "type": "assign",
                    "caption": "汇总开始月",
                    "dataType": "int"
                },
                {
                    "name": "startfiscalmonth",
                    "type": "assign",
                    "caption": "财年开始月",
                    "dataType": "int"
                },
                {
                    "name": "startfiscalday",
                    "type": "assign",
                    "caption": "财年开始日",
                    "dataType": "int"
                }
            ]
        }
    }
}

export enum EnumAtom {
	Subject = 'subject',
	SumPersonPost = 'sumpersonpost',
	SumGroupPost = 'sumgrouppost',
	SumGroup = 'sumgroup',
}