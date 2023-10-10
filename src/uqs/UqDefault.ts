//=== UqApp builder created on Mon Oct 09 2023 10:05:22 GMT-0400 (Eastern Daylight Time) ===//
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
	Bud = 'bud',
	History = 'history',
	Atom = 'atom',
	Spec = 'spec',
	Sheet = 'sheet',
	Bin = 'bin',
	Pend = 'pend',
	SumFormula = 'sumformula',
	AtomUom = 'atomuom',
	AtomSpec = 'atomspec',
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
	pendFrom: number;
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
export interface ResultSubmitSheet {
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
	value: number;
}
export interface ReturnGetReportSpecs {
	id: number;
	phrase: number;
	base: number;
	value: number;
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

export interface ParamSearchAtomUomBuds {
	phrase: string;
	key: string;
	budNames: string;
}
export interface ReturnSearchAtomUomBuds$page {
	id: number;
	no: string;
	ex: string;
	phrase: string;
}
export interface ReturnSearchAtomUomBudsUoms {
	id: number;
	atom: number;
	uom: number;
}
export interface ReturnSearchAtomUomBudsBudsInt {
	id: number;
	bud: number;
	phrase: string;
	value: number;
}
export interface ReturnSearchAtomUomBudsBudsDec {
	id: number;
	bud: number;
	phrase: string;
	value: number;
}
export interface ReturnSearchAtomUomBudsBudsStr {
	id: number;
	bud: number;
	phrase: string;
	value: string;
}
export interface ResultSearchAtomUomBuds {
	$page: ReturnSearchAtomUomBuds$page[];
	uoms: ReturnSearchAtomUomBudsUoms[];
	budsInt: ReturnSearchAtomUomBudsBudsInt[];
	budsDec: ReturnSearchAtomUomBudsBudsDec[];
	budsStr: ReturnSearchAtomUomBudsBudsStr[];
}

export interface ParamGetSheet {
	id: number;
	detail: number;
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
	base: number;
	origin: number;
	i: number;
	x: number;
	value: number;
	amount: number;
	price: number;
	pendFrom: number;
	pendValue: number;
	phrase: number;
}
export interface ReturnGetSheetOrigins {
	id: number;
	base: number;
	origin: number;
	i: number;
	x: number;
	value: number;
	amount: number;
	price: number;
}
export interface ResultGetSheet {
	main: ReturnGetSheetMain[];
	details: ReturnGetSheetDetails[];
	origins: ReturnGetSheetOrigins[];
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

export enum BizPhraseType {
	any = 0,
	atom = 11,
	spec = 12,
	bud = 13,
	sheet = 101,
	main = 102,
	detail = 103,
	pend = 104,
	detailAct = 111,
	with = 151,
	pick = 161,
	role = 201,
	permit = 202,
	options = 301,
	tree = 401,
	tie = 501,
	report = 601,
	title = 901,
	key = 1001,
	prop = 1011,
	optionsitem = 1031
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
	date = 41
}

export enum BizBudFlag {
	index = 1
}

export interface ParamGetBizObjects {
	lang: string;
	culture: string;
}
export interface ReturnGetBizObjectsObjs {
	id: number;
	phrase: string;
	source: string;
	caption: string;
}
export interface ReturnGetBizObjectsBuds {
	id: number;
	base: number;
	phrase: string;
	caption: string;
	ex: any;
}
export interface ResultGetBizObjects {
	objs: ReturnGetBizObjectsObjs[];
	buds: ReturnGetBizObjectsBuds[];
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

export interface ParamReportStorage {
	key: string;
	subject: string;
}
export interface ReturnReportStorage$page {
	atom: number;
	uom: number;
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

export interface ParamGetPend {
	pend: number;
	key: string;
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
	mid: any;
	pendValue: number;
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
export interface ReturnGetPendRetAtom {
	atom: number;
	value: any;
}
export interface ResultGetPend {
	$page: ReturnGetPend$page[];
	retSheet: ReturnGetPendRetSheet[];
	retAtom: ReturnGetPendRetAtom[];
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

export interface ParamGetPendDetailFromItem {
	pend: string;
	key: string;
}
export interface ReturnGetPendDetailFromItem$page {
	id: number;
	base: number;
	origin: number;
	i: number;
	x: number;
	value: number;
	amount: number;
	price: number;
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
	origin: number;
	i: number;
	x: number;
	value: number;
	amount: number;
	price: number;
	pend: number;
	pendValue: number;
	sheet: string;
	no: string;
}
export interface ResultGetPendDetailFromSheetId {
	ret: ReturnGetPendDetailFromSheetIdRet[];
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

export interface Bin extends ID {
	base: number;
	origin: number;
	i: number;
	x: number;
	value: number;
	amount: number;
	price: number;
}

export interface BinInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
	origin: number | ID;
	i: number | ID;
	x: number | ID;
	value: number;
	amount: number;
	price: number;
}

export interface Pend extends ID {
	base: number;
	detail: number;
	mid: any;
	value: number;
}

export interface PendInActs extends ID {
	ID?: UqID<any>;
	base: number | ID;
	detail: number | ID;
	mid: any;
	value: number;
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

export interface AtomUom extends ID {
	atom: number;
	uom: number;
	visible: number;
}

export interface AtomUomInActs extends ID {
	ID?: UqID<any>;
	atom: number | ID;
	uom: number | ID;
	visible: number;
}

export interface AtomSpec extends ID {
	atomUom: number;
	spec: number;
}

export interface AtomSpecInActs extends ID {
	ID?: UqID<any>;
	atomUom: number | ID;
	spec: number | ID;
}

export interface ParamSaveUomType {
	id: number;
	type: number;
}
export interface ResultSaveUomType {
}

export interface ParamSaveUomIUom {
	id: number;
	type: number;
}
export interface ResultSaveUomIUom {
}

export interface ParamGetUomFromType {
	id: number;
}
export interface ReturnGetUomFromTypeUom {
	id: number;
	no: string;
	ex: string;
	discription: string;
}
export interface ResultGetUomFromType {
	uom: ReturnGetUomFromTypeUom[];
}

export interface ParamGetUomIListOfUom {
	uom: number;
}
export interface ReturnGetUomIListOfUom$page {
	id: number;
	no: string;
	ex: string;
	phrase: string;
}
export interface ResultGetUomIListOfUom {
	$page: ReturnGetUomIListOfUom$page[];
}

export interface ParamGetAtomUomI {
	id: number;
}
export interface ReturnGetAtomUomIUomI {
	id: number;
	no: string;
	ex: string;
}
export interface ReturnGetAtomUomIUomX {
	id: number;
	no: string;
	ex: string;
	ratio: number;
	prevEx: string;
	prevRatio: number;
	atomUom: number;
}
export interface ResultGetAtomUomI {
	uomI: ReturnGetAtomUomIUomI[];
	uomX: ReturnGetAtomUomIUomX[];
}

export interface ParamSaveUomX {
	i: number;
	no: string;
	ex: string;
	ratio: number;
}
export interface ReturnSaveUomXRet {
	id: number;
}
export interface ResultSaveUomX {
	ret: ReturnSaveUomXRet[];
}

export interface ParamDelUomX {
	uomI: number;
	uomX: number;
}
export interface ResultDelUomX {
}

export interface ParamSaveAtomUom {
	atom: number;
	uom: number;
}
export interface ReturnSaveAtomUomRet {
	id: number;
}
export interface ResultSaveAtomUom {
	ret: ReturnSaveAtomUomRet[];
}

export interface ParamHideAtomUomX {
	id: number;
}
export interface ResultHideAtomUomX {
}

export interface ParamDeleteAtomUomI {
	atom: number;
	uomI: number;
}
export interface ResultDeleteAtomUomI {
}

export interface ParamSaveAtomSpec {
	atomUom: number;
	spec: number;
}
export interface ReturnSaveAtomSpecRet {
	id: number;
}
export interface ResultSaveAtomSpec {
	ret: ReturnSaveAtomSpecRet[];
}

export interface ParamGetUomI {
	id: number;
}
export interface ReturnGetUomIUomI {
	id: number;
	base: number;
	no: string;
	ex: string;
	discription: string;
	ratio: number;
	uom: number;
	uomNo: string;
	uomEx: string;
	uomDiscription: string;
}
export interface ReturnGetUomIUomX {
	id: number;
	base: number;
	no: string;
	ex: string;
	ratio: number;
}
export interface ResultGetUomI {
	UomI: ReturnGetUomIUomI[];
	UomX: ReturnGetUomIUomX[];
}



export interface ParamActs {
	$phrase?: $phraseInActs[];
	ixBud?: IxBud[];
	bud?: BudInActs[];
	history?: HistoryInActs[];
	atom?: AtomInActs[];
	spec?: SpecInActs[];
	sheet?: SheetInActs[];
	bin?: BinInActs[];
	pend?: PendInActs[];
	sumFormula?: SumFormulaInActs[];
	atomUom?: AtomUomInActs[];
	atomSpec?: AtomSpecInActs[];
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
	$AllPhrases: UqQuery<Param$AllPhrases, Result$AllPhrases>;
	IxBud: UqIX<any>;
	Bud: UqID<any>;
	History: UqID<any>;
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
	GetReport: UqQuery<ParamGetReport, ResultGetReport>;
	GetHistory: UqQuery<ParamGetHistory, ResultGetHistory>;
	RemoveDraft: UqAction<ParamRemoveDraft, ResultRemoveDraft>;
	GetMyDrafts: UqQuery<ParamGetMyDrafts, ResultGetMyDrafts>;
	SearchAtom: UqQuery<ParamSearchAtom, ResultSearchAtom>;
	SearchAtomBuds: UqQuery<ParamSearchAtomBuds, ResultSearchAtomBuds>;
	SearchAtomUomBuds: UqQuery<ParamSearchAtomUomBuds, ResultSearchAtomUomBuds>;
	GetSheet: UqQuery<ParamGetSheet, ResultGetSheet>;
	GetAtom: UqQuery<ParamGetAtom, ResultGetAtom>;
	GetSpecsFromBase: UqQuery<ParamGetSpecsFromBase, ResultGetSpecsFromBase>;
	GetBizObjects: UqQuery<ParamGetBizObjects, ResultGetBizObjects>;
	GetEntityCode: UqQuery<ParamGetEntityCode, ResultGetEntityCode>;
	CreateSiteForUser: UqAction<ParamCreateSiteForUser, ResultCreateSiteForUser>;
	ReportStorage: UqQuery<ParamReportStorage, ResultReportStorage>;
	ReportStorageAtom: UqQuery<ParamReportStorageAtom, ResultReportStorageAtom>;
	ReportStorageSpec: UqQuery<ParamReportStorageSpec, ResultReportStorageSpec>;
	GetPend: UqQuery<ParamGetPend, ResultGetPend>;
	GetPendsNotify: UqQuery<ParamGetPendsNotify, ResultGetPendsNotify>;
	GetPendSheetFromNo: UqQuery<ParamGetPendSheetFromNo, ResultGetPendSheetFromNo>;
	GetPendSheetFromTarget: UqQuery<ParamGetPendSheetFromTarget, ResultGetPendSheetFromTarget>;
	GetPendDetailFromItem: UqQuery<ParamGetPendDetailFromItem, ResultGetPendDetailFromItem>;
	GetPendDetailFromSheetId: UqQuery<ParamGetPendDetailFromSheetId, ResultGetPendDetailFromSheetId>;
	Atom: UqID<any>;
	Spec: UqID<any>;
	Sheet: UqID<any>;
	Bin: UqID<any>;
	Pend: UqID<any>;
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
	GetSiteSetting: UqQuery<ParamGetSiteSetting, ResultGetSiteSetting>;
	AtomUom: UqID<any>;
	AtomSpec: UqID<any>;
	SaveUomType: UqAction<ParamSaveUomType, ResultSaveUomType>;
	SaveUomIUom: UqAction<ParamSaveUomIUom, ResultSaveUomIUom>;
	GetUomFromType: UqQuery<ParamGetUomFromType, ResultGetUomFromType>;
	GetUomIListOfUom: UqQuery<ParamGetUomIListOfUom, ResultGetUomIListOfUom>;
	GetAtomUomI: UqQuery<ParamGetAtomUomI, ResultGetAtomUomI>;
	SaveUomX: UqAction<ParamSaveUomX, ResultSaveUomX>;
	DelUomX: UqAction<ParamDelUomX, ResultDelUomX>;
	SaveAtomUom: UqAction<ParamSaveAtomUom, ResultSaveAtomUom>;
	HideAtomUomX: UqAction<ParamHideAtomUomX, ResultHideAtomUomX>;
	DeleteAtomUomI: UqAction<ParamDeleteAtomUomI, ResultDeleteAtomUomI>;
	SaveAtomSpec: UqAction<ParamSaveAtomSpec, ResultSaveAtomSpec>;
	GetUomI: UqQuery<ParamGetUomI, ResultGetUomI>;
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
        "returns": [] as any
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
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
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
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
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
    "searchatomuombuds": {
        "name": "SearchAtomUomBuds",
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
                "name": "uoms",
                "fields": [
                    {
                        "name": "id",
                        "type": "id"
                    },
                    {
                        "name": "atom",
                        "type": "id"
                    },
                    {
                        "name": "uom",
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
                "name": "detail",
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
                        "type": "id",
                        "null": false
                    },
                    {
                        "name": "base",
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
                        "type": "id",
                        "null": false
                    },
                    {
                        "name": "base",
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
            "sheet": 101,
            "main": 102,
            "detail": 103,
            "pend": 104,
            "detailAct": 111,
            "with": 151,
            "pick": 161,
            "role": 201,
            "permit": 202,
            "options": 301,
            "tree": 401,
            "tie": 501,
            "report": 601,
            "title": 901,
            "key": 1001,
            "prop": 1011,
            "optionsitem": 1031
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
            "date": 41
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
    "getbizobjects": {
        "name": "GetBizObjects",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "lang",
                "type": "char",
                "size": 10
            },
            {
                "name": "culture",
                "type": "char",
                "size": 10
            }
        ],
        "returns": [
            {
                "name": "objs",
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
                        "name": "source",
                        "type": "text"
                    },
                    {
                        "name": "caption",
                        "type": "char",
                        "size": 100
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
                        "name": "base",
                        "type": "id"
                    },
                    {
                        "name": "phrase",
                        "type": "char",
                        "size": 200
                    },
                    {
                        "name": "caption",
                        "type": "char",
                        "size": 100
                    },
                    {
                        "name": "ex",
                        "type": "json"
                    }
                ]
            }
        ]
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
                        "name": "uom",
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
    "getpend": {
        "name": "GetPend",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "pend",
                "type": "id"
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
                        "name": "mid",
                        "type": "json"
                    },
                    {
                        "name": "pendValue",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
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
                "name": "retAtom",
                "fields": [
                    {
                        "name": "atom",
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
    "bin": {
        "name": "Bin",
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
                "name": "detail",
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
    "atomuom": {
        "name": "AtomUom",
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
                "name": "uom",
                "type": "id",
                "ID": "atom",
                "tuid": "atom"
            },
            {
                "name": "visible",
                "type": "tinyint"
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
                "name": "uom",
                "type": "id",
                "ID": "atom",
                "tuid": "atom"
            }
        ],
        "global": false,
        "idType": 3,
        "isMinute": false,
        "stars": [
            "atom",
            "uom"
        ]
    },
    "atomspec": {
        "name": "AtomSpec",
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
                "name": "atomUom",
                "type": "id",
                "ID": "atomuom",
                "tuid": "atomuom"
            },
            {
                "name": "spec",
                "type": "id"
            }
        ],
        "keys": [
            {
                "name": "atomUom",
                "type": "id",
                "ID": "atomuom",
                "tuid": "atomuom"
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
            "atomUom",
            "spec"
        ]
    },
    "saveuomtype": {
        "name": "SaveUomType",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id"
            },
            {
                "name": "type",
                "type": "id"
            }
        ],
        "returns": [] as any
    },
    "saveuomiuom": {
        "name": "SaveUomIUom",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "id",
                "type": "id"
            },
            {
                "name": "type",
                "type": "id"
            }
        ],
        "returns": [] as any
    },
    "getuomfromtype": {
        "name": "GetUomFromType",
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
                "name": "uom",
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
                        "name": "discription",
                        "type": "char",
                        "size": 100
                    }
                ]
            }
        ]
    },
    "getuomilistofuom": {
        "name": "GetUomIListOfUom",
        "type": "query",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "uom",
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
    "getatomuomi": {
        "name": "GetAtomUomI",
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
                "name": "uomI",
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
                    }
                ]
            },
            {
                "name": "uomX",
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
                        "name": "ratio",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "prevEx",
                        "type": "char",
                        "size": 200
                    },
                    {
                        "name": "prevRatio",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "atomUom",
                        "type": "id"
                    }
                ]
            }
        ]
    },
    "saveuomx": {
        "name": "SaveUomX",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "i",
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
                "size": 100
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
    "deluomx": {
        "name": "DelUomX",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "uomI",
                "type": "id"
            },
            {
                "name": "uomX",
                "type": "id"
            }
        ],
        "returns": [] as any
    },
    "saveatomuom": {
        "name": "SaveAtomUom",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "atom",
                "type": "id"
            },
            {
                "name": "uom",
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
                        "ID": "atomuom",
                        "tuid": "atomuom"
                    }
                ]
            }
        ]
    },
    "hideatomuomx": {
        "name": "HideAtomUomX",
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
    "deleteatomuomi": {
        "name": "DeleteAtomUomI",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "atom",
                "type": "id"
            },
            {
                "name": "uomI",
                "type": "id"
            }
        ],
        "returns": [] as any
    },
    "saveatomspec": {
        "name": "SaveAtomSpec",
        "type": "action",
        "private": false,
        "sys": true,
        "fields": [
            {
                "name": "atomUom",
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
                        "ID": "atomspec",
                        "tuid": "atomspec"
                    }
                ]
            }
        ]
    },
    "getuomi": {
        "name": "GetUomI",
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
                "name": "UomI",
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
                    },
                    {
                        "name": "discription",
                        "type": "char",
                        "size": 100
                    },
                    {
                        "name": "ratio",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
                    },
                    {
                        "name": "uom",
                        "type": "id",
                        "ID": "atom",
                        "tuid": "atom"
                    },
                    {
                        "name": "uomNo",
                        "type": "char",
                        "size": 30
                    },
                    {
                        "name": "uomEx",
                        "type": "char",
                        "size": 100
                    },
                    {
                        "name": "uomDiscription",
                        "type": "char",
                        "size": 100
                    }
                ]
            },
            {
                "name": "UomX",
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
                    },
                    {
                        "name": "ratio",
                        "type": "dec",
                        "scale": 6,
                        "precision": 18
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
        "$": {
            "name": "$",
            "type": "atom",
            "props": [
                {
                    "name": "uom",
                    "type": "prop",
                    "dataType": "ID"
                }
            ]
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
        },
        "uom": {
            "name": "uom",
            "jName": "Uom",
            "type": "atom",
            "caption": "基本单位",
            "props": [
                {
                    "name": "discription",
                    "type": "prop",
                    "caption": "说明",
                    "dataType": "char"
                },
                {
                    "name": "type",
                    "type": "prop",
                    "dataType": "radio",
                    "items": [
                        [
                            "count",
                            "计数",
                            1
                        ],
                        [
                            "length",
                            "长度",
                            2
                        ],
                        [
                            "area",
                            "面积",
                            3
                        ],
                        [
                            "volume",
                            "体积",
                            4
                        ],
                        [
                            "weight",
                            "重量",
                            5
                        ],
                        [
                            "time",
                            "时长",
                            6
                        ],
                        [
                            "currency",
                            "货币",
                            7
                        ]
                    ]
                }
            ]
        },
        "uomi": {
            "name": "uomi",
            "jName": "UomI",
            "type": "atom",
            "caption": "计量单位",
            "props": [
                {
                    "name": "discription",
                    "type": "prop",
                    "caption": "说明",
                    "dataType": "char"
                },
                {
                    "name": "uom",
                    "type": "prop",
                    "caption": "基本单位",
                    "dataType": "atom",
                    "atom": "uom"
                },
                {
                    "name": "ratio",
                    "type": "prop",
                    "caption": "换算率",
                    "dataType": "dec"
                }
            ]
        },
        "uomx": {
            "name": "uomx",
            "jName": "UomX",
            "type": "atom",
            "caption": "换算单位"
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
        "storage": {
            "name": "storage",
            "type": "moniker",
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
            "type": "moniker",
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
            "type": "moniker",
            "caption": "AccountSetting",
            "assigns": [
                {
                    "name": "name",
                    "type": "assign",
                    "caption": "单位名称",
                    "dataType": "char"
                },
                {
                    "name": "库存上限",
                    "type": "assign",
                    "dataType": "dec"
                },
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
            "type": "moniker",
            "caption": "PersonSetting",
            "assigns": [
                {
                    "name": "name",
                    "type": "assign",
                    "caption": "名字",
                    "dataType": "char"
                },
                {
                    "name": "工时上限",
                    "type": "assign",
                    "dataType": "int"
                },
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
            "type": "moniker",
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
        }
    }
}

export enum EnumAtom {
	$ = '$',
	Subject = 'subject',
	SumPersonPost = 'sumpersonpost',
	SumGroupPost = 'sumgrouppost',
	SumGroup = 'sumgroup',
	Uom = 'uom',
	UomI = 'uomi',
	UomX = 'uomx',
}