export interface Client {
    GetUserBuds(userId: number): Promise<{
        bud: number;
        value: any;
    }[]>;
    GetAtom(id: number): Promise<{
        phrase: number;
        value: any;
    }[]>;
    ActIDProp(id: number, name: string, value: string | number): Promise<void>;

    SaveBudValue(param: { id: number, phraseId: number, int: number, dec: number, str: string }): Promise<void>;
    GetIDListCount(phrase: number): Promise<number>;
    SetIDBase(id: number, base: number): Promise<void>;
    SaveAtomAndProps(rootPhrase: number, phrase: number
        , no: string, ex: string, props: any[][]
    ): Promise<void>;
    GetAtomIds(entity: number, arrNo: string[]): Promise<{
        no: string;
        id: number;
    }[]>;
    SearchAtomBuds(param: {
        phrase: number;
        key: string;
        buds: any;
    }, pageStart: number, pageSize: number): Promise<{
        $page: ReturnSearchAtomBuds$page[];
        meds: ReturnSearchAtomBudsMeds[];
        budsInt: ReturnSearchAtomBudsBudsInt[];
        budsDec: ReturnSearchAtomBudsBudsDec[];
        budsStr: ReturnSearchAtomBudsBudsStr[];
    }>;
    GetIDList(param: {
        phrase: number;
        tie: number;
        i: number;
        searchKey: string;
    }, pageStart: number, pageSize: number): Promise<{
        $page: ReturnGetIDList[];
        props: ReturnProps[];
        atoms: ReturnAtoms[];
        forks: ReturnForks[];
    }>;

    SaveFork(param: {
        id: number;
        fork: number;
        base: number;
        values: any;
    }): Promise<{ id: number; }>;
    GetSpecListFromBase(base: number, phrase: number): Promise<{
        id: number;
        keys: any;
        props: any;
    }[]>;
    GetSpecsFromBase(base: number): Promise<{
        id: number;
        keys: any;
        props: any;
    }[]>;

    SaveDetails(base: number,
        phrase: number,
        inDetails: {
            id: number;
            i: number;
            x: number;
            origin: number;
            value: number;
            price: number;
            amount: number;
            pend: number;
            props: any;
        }[]
    ): Promise<{
        main: ReturnSheetMain[];
        details: ReturnSheetDetails[];
        origins: ReturnOrigins[];
        props: ReturnProps[];
        atoms: ReturnAtoms[];
        forks: ReturnForks[];
    }>;
    GetSheet(id: number): Promise<{
        main: ReturnSheetMain[];
        details: ReturnSheetDetails[];
        origins: ReturnOrigins[];
        props: ReturnProps[];
        atoms: ReturnAtoms[];
        forks: ReturnForks[];
    }>;
    GetMySheetList(param: {
        phrase: number;
        mainPhrase: number;
        from: any;
        to: any;
        timeZone: number;
    }, pageStart: number, pageSize: number): Promise<{
        $page: ReturnSheetList$page[];
        props: ReturnProps[];
        atoms: ReturnAtoms[];
        forks: ReturnForks[];
    }>;
    SaveSheet(param: {
        phrase: number;
        mainPhrase: number;
        no: string;
        i: number;
        x: number;
        value: number;
        price: number;
        amount: number;
        props: any;
    }): Promise<{
        id: number;
        no: string;
    }>;
    SetSheetPreToDraft(id: number): Promise<void>;
    SubmitSheet(id: number): Promise<{
        checkPend: ReturnSubmitSheetCheckPend[];
        checkBin: ReturnSubmitSheetCheckBin[];
    }>;
    SubmitSheetDebug(id: number): Promise<{
        logs: ReturnSubmitSheetDebugLogs[];
        checkPend: ReturnSubmitSheetCheckPend[];
        checkBin: ReturnSubmitSheetCheckBin[];
    }>;
    GetPend(param: {
        pendEntity: number;
        params: any;
        pendId: number;
    }, pageStart: number, pageSize: number): Promise<{
        $page: ReturnGetPend$page[];
        retSheet: ReturnGetPendRetSheet[];
        props: ReturnProps[];
        atoms: ReturnAtoms[];
        forks: ReturnForks[];
    }>;
    GetMyDrafts(param: {
        entitySheet: number;
        entityMain: number;
    }, pageStart: number, pageSize: number): Promise<{
        $page: ReturnSheetList$page[];
        props: ReturnProps[];
        atoms: ReturnAtoms[];
        forks: ReturnForks[];
    }>;
    RemoveDraft(id: number): Promise<void>;
    DeleteMyDrafts(entitySheet: number): Promise<void>;
    DeleteBin(ids: number[]): Promise<void>;

    ExecQuery(param: {
        query: number;
        json: any;
        pageStart: number;
        pageSize: number;
    }): Promise<{
        main: ReturnExecQueryMain[];
        detail: ReturnExecQueryDetail[];
        props: ReturnProps[];
        atoms: ReturnAtoms[];
        forks: ReturnForks[];
    }>;

    GetReport(param: {
        reportPhrase: number;
        atomPhrase: number;
        atomId: number;
        dateStart: any;
        dateEnd: any;
        params: any;
    }, pageStart: number, pageSize: number): Promise<{
        $page: ReturnGetReport$page[];
        forks: ReturnGetReportForks[];
    }>;

    GetEntityCode(entity: number): Promise<{ code: string, schema: string; }>;

    GetAdminBook(param: {
        i: number;
        bud: number;
        keys: any;
    }, pageStart: number, pageSize: number): Promise<{
        $page: ReturnGetAdminBook$page[];
        props: ReturnProps[];
        atoms: ReturnAtoms[];
        forks: ReturnForks[];
    }>;
}

export interface ReturnGetIDList {
    id: number;
    phrase: number;
    seed: number;
}
export interface ReturnProps {
    id: number;
    bud: number;
    value: any;
}
export interface ReturnAtoms {
    id: number;
    phrase: number;
    no: string;
    ex: string;
}
export interface ReturnForks {
    id: number;
    phrase: number;
    seed: number;
}
export interface ReturnSheetMainBase {
    id: number;
    base: number;
    no: string;
    operator: number;
    sheet: number;
    origin: number;
    i: number;
    x: number;
    value: number;
    amount: number;
    price: number;
}
export interface ReturnSheetMain extends ReturnSheetMainBase {
    phrase: number;
}
export interface ReturnSheetList$page extends ReturnSheetMainBase {
    rowCount: number;
}
export interface ReturnSheetDetails {
    id: number;
    sheet: number;
    base: number;
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
export interface ReturnOrigins {
    id: number;
    sheet: number;
    base: number;
    origin: number;
    i: number;
    x: number;
    value: number;
    amount: number;
    price: number;
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
export interface ReturnSubmitSheetDebugLogs {
    id: number;
    value: any;
}
export interface ReturnSubmitSheetCheckPend {
    pend: number;
    overValue: number;
}
export interface ReturnSubmitSheetCheckBin {
    bin: number;
    message: string;
}
export interface ReturnGetReport$page {
    id: number;
    phrase: number;
    no: string;
    ex: string;
    value: any;
}
export interface ReturnGetReportForks {
    id: number;
    phrase: number;
    base: number;
    value: any;
    props: any;
}
export interface ReturnExecQueryMain {
    rowId: number;
    ban: number;
    ids: any;
    values: any;
}
export interface ReturnExecQueryDetail {
    mainId: number;
    rowId: number;
    ban: number;
    ids: any;
    values: any;
    cols: any;
}
export interface ReturnGetAdminBook$page {
    i: number;
    phrase: number;
    value: number;
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
