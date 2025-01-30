import { Client, ReturnAtoms, ReturnForks, ReturnGetIDList, ReturnSheetList$page, ReturnGetPend$page, ReturnGetPendRetSheet, ReturnGetReport$page, ReturnGetReportForks, ReturnOrigins, ReturnProps, ReturnSheetDetails, ReturnSheetMain, ReturnSubmitSheetCheckBin, ReturnSubmitSheetCheckPend, ReturnSubmitSheetDebugLogs, ReturnExecQueryDetail, ReturnExecQueryMain, ReturnGetAdminBook$page, ReturnSearchAtomBuds$page, ReturnSearchAtomBudsMeds, ReturnSearchAtomBudsBudsInt, ReturnSearchAtomBudsBudsDec, ReturnSearchAtomBudsBudsStr } from "tonwa";
import { UqExt } from "uqs/UqDefault";

export class UqClient implements Client {
    private readonly uq: UqExt;
    constructor(uq: UqExt) {
        this.uq = uq;
    }

    async GetUserBuds(userId: number): Promise<{ bud: number; value: any; }[]> {
        let { buds } = await this.uq.GetUserBuds.query({ userId });
        return buds;
    }
    async GetAtom(id: number): Promise<{ phrase: number; value: any; }[]> {
        const { props } = await this.uq.GetAtom.query({ id });
        return props;
    }
    async ActIDProp(id: number, name: string, value: string | number): Promise<void> {
        await this.uq.ActIDProp(this.uq.Atom, id, name, value);
    }

    async SaveBudValue(param: {
        id: number, phraseId: number, int: number, dec: number, str: string
    }): Promise<void> {
        await this.uq.SaveBudValue.submit(param);
    }

    async GetIDListCount(phrase: number): Promise<number> {
        let ret = await this.uq.GetIDListCount.query({ phrase });
        return ret.ret[0].count;
    }

    async SetIDBase(id: number, base: number): Promise<void> {
        await this.uq.SetIDBase.submit({ id, base });
    }

    async SaveAtomAndProps(rootPhrase: number, phrase: number
        , no: string, ex: string, props: any[][]
    ): Promise<void> {
        return await this.uq.SaveAtomAndProps.submit({
            rootPhrase,
            phrase,
            no,
            ex,
            props
        });
    }
    async GetAtomIds(entity: number, arrNo: string[]): Promise<{
        no: string;
        id: number;
    }[]> {
        let ret = await this.uq.GetAtomIds.submitReturns({
            entity,
            arrNo,
        });
        return ret.ret;
    }

    async SearchAtomBuds(param: {
        phrase: number;
        key: string;
        buds: any;
    }, pageStart: number, pageSize: number): Promise<{
        $page: ReturnSearchAtomBuds$page[];
        meds: ReturnSearchAtomBudsMeds[];
        budsInt: ReturnSearchAtomBudsBudsInt[];
        budsDec: ReturnSearchAtomBudsBudsDec[];
        budsStr: ReturnSearchAtomBudsBudsStr[];
    }> {
        let ret = this.uq.SearchAtomBuds.page(param, pageStart, pageSize);
        return ret;
    }

    async GetIDList(param: {
        phrase: number;
        tie: number;
        i: number;
        searchKey: string;
    }, pageStart: number, pageSize: number): Promise<{
        $page: ReturnGetIDList[];
        props: ReturnProps[];
        atoms: ReturnAtoms[];
        forks: ReturnForks[];
    }> {
        let ret = await this.uq.GetIDList.page(param, pageStart, pageSize);
        return ret;
    }

    async SaveFork(param: {
        id: number;
        fork: number;
        base: number;
        values: any;
    }): Promise<{ id: number; }> {
        let ret = await this.uq.SaveFork.submit(param);
        return ret;
    }
    async GetSpecListFromBase(base: number, phrase: number): Promise<{
        id: number;
        keys: any;
        props: any;
    }[]> {
        let ret = await this.uq.GetSpecListFromBase.query({ base, phrase });
        return ret.ret;
    }
    async GetSpecsFromBase(base: number): Promise<{
        id: number;
        keys: any;
        props: any;
    }[]> {
        let ret = await this.uq.GetSpecsFromBase.query({ base });
        return ret.ret;
    }

    async SaveDetails(base: number,
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
    }> {
        let ret = await this.uq.SaveDetails.submitReturns({
            base, phrase, inDetails
        });
        return ret;
    }
    async GetSheet(id: number): Promise<{
        main: ReturnSheetMain[];
        details: ReturnSheetDetails[];
        origins: ReturnOrigins[];
        props: ReturnProps[];
        atoms: ReturnAtoms[];
        forks: ReturnForks[];
    }> {
        let ret = await this.uq.GetSheet.query({ id });
        return ret;
    }
    async GetMySheetList(param: {
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
    }> {
        let ret = await this.uq.GetMySheetList.page(param, pageStart, pageSize);
        return ret;
    }
    async SaveSheet(param: {
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
    }> {
        let ret = await this.uq.SaveSheet.submit(param);
        return ret
    }
    async GetPend(param: {
        pendEntity: number;
        params: any;
        pendId: number;
    }, pageStart: number, pageSize: number): Promise<{
        $page: ReturnGetPend$page[];
        retSheet: ReturnGetPendRetSheet[];
        props: ReturnProps[];
        atoms: ReturnAtoms[];
        forks: ReturnForks[];
    }> {
        let ret = await this.uq.GetPend.page(param, pageStart, pageSize);
        return ret;
    }
    async SubmitSheet(id: number): Promise<{
        checkPend: ReturnSubmitSheetCheckPend[];
        checkBin: ReturnSubmitSheetCheckBin[];
    }> {
        let ret = await this.uq.SubmitSheet.submit({ id });
        return ret;
    }
    async SubmitSheetDebug(id: number): Promise<{
        logs: ReturnSubmitSheetDebugLogs[];
        checkPend: ReturnSubmitSheetCheckPend[];
        checkBin: ReturnSubmitSheetCheckBin[];
    }> {
        let ret = await this.uq.SubmitSheetDebug.submit({ id });
        return ret;
    }
    async SetSheetPreToDraft(id: number): Promise<void> {
        await this.uq.SetSheetPreToDraft.submit({ id });
    }
    async GetMyDrafts(param: {
        entitySheet: number;
        entityMain: number;
    }, pageStart: number, pageSize: number): Promise<{
        $page: ReturnSheetList$page[];
        props: ReturnProps[];
        atoms: ReturnAtoms[];
        forks: ReturnForks[];
    }> {
        let ret = await this.uq.GetMyDrafts.page(param, pageStart, pageSize);
        return ret;
    }
    async RemoveDraft(id: number): Promise<void> {
        await this.uq.RemoveDraft.submit({ id });
    }
    async DeleteMyDrafts(entitySheet: number): Promise<void> {
        await this.uq.DeleteMyDrafts.submit({ entitySheet });
    }
    async DeleteBin(ids: number[]): Promise<void> {
        await this.uq.DeleteBin.submit({ ids });
    }

    async ExecQuery(param: { query: number; json: any; pageStart: number; pageSize: number; }): Promise<{
        main: ReturnExecQueryMain[];
        detail: ReturnExecQueryDetail[];
        props: ReturnProps[];
        atoms: ReturnAtoms[];
        forks: ReturnForks[];
    }> {
        let ret = await this.uq.ExecQuery.submitReturns(param);
        return ret;
    }

    async GetReport(param: {
        reportPhrase: number;
        atomPhrase: number;
        atomId: number;
        dateStart: any;
        dateEnd: any;
        params: any;
    }, pageStart: number, pageSize: number): Promise<{
        $page: ReturnGetReport$page[];
        forks: ReturnGetReportForks[];
    }> {
        let ret = await this.uq.GetReport.page(param, pageStart, pageSize);
        return ret;
    }

    async GetEntityCode(entity: number): Promise<{ code: string, schema: string; }> {
        let ret = await this.uq.GetEntityCode.query({ id: entity });
        let data = ret.ret[0];
        return data;
    }

    async GetAdminBook(param: {
        i: number;
        bud: number;
        keys: any;
    }, pageStart: number, pageSize: number): Promise<{
        $page: ReturnGetAdminBook$page[];
        props: ReturnProps[];
        atoms: ReturnAtoms[];
        forks: ReturnForks[];
    }> {
        let ret = await this.uq.GetAdminBook.page(param, pageStart, pageSize);
        return ret;
    }
}
