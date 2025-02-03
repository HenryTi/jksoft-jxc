import { BinPick, BinRow, BizPhraseType, EntityBin, PickAtom, PickPend, PickQuery } from "../../Biz";
import { AtomData, BinStore, StoreSheet } from "../../Store";
import { PageIDSelect } from "../../Pages";
import { PickResult, RearPickResultType, ReturnUseBinPicks } from "../../Store/PickResult";
import { ControllerBiz } from "../ControllerBiz";
import { ControllerBuds } from "./ControllerBuds";
import { BinBudsEditing, FormBudsStore } from "./BinEditing";
import { pickFromQuery, pickFromQueryScalar } from "tonwa/Pages/Query";
import { pickFromPend } from "tonwa/Pages/Sheet/pickFromPend";

export class ControllerBinPicks extends ControllerBuds {
    protected readonly binPicks: BinPick[];
    protected readonly rearPick: BinPick;
    protected readonly storeSheet: StoreSheet;
    protected readonly editing: BinBudsEditing;
    protected readonly bin: EntityBin;
    protected readonly storeBin: BinStore;
    readonly formBudsStore: FormBudsStore;

    constructor(controllerBiz: ControllerBiz, storeSheet: StoreSheet, bin: EntityBin, initBinRow?: BinRow) {
        const { binPicks, rearPick } = bin;
        super(controllerBiz, [...binPicks, rearPick]);
        this.binPicks = binPicks;
        this.rearPick = rearPick;
        this.bin = bin;
        this.storeSheet = storeSheet;
        this.editing = new BinBudsEditing(storeSheet, bin, bin.buds, initBinRow);
        this.formBudsStore = new FormBudsStore(this.modal, new BinBudsEditing(this.storeSheet, bin, []));
        const { mainBinStore, binStore } = storeSheet;
        this.storeBin = bin === mainBinStore.entity ? mainBinStore : binStore;
    }

    async pick(rearPickResultType: RearPickResultType = RearPickResultType.array) {
        for (const binPick of this.binPicks) {
            await this.doBinPick(binPick);
        }

        let ret: ReturnUseBinPicks = {
            editing: this.formBudsStore,
            rearBinPick: this.rearPick,           // endmost pick
            rearResult: undefined,
            rearPickResultType,
        };

        let rearPickResult = await this.doBinPickRear(rearPickResultType);
        if (rearPickResult === undefined) return undefined;

        let rearResult: PickResult[] = Array.isArray(rearPickResult) === false ?
            [rearPickResult as PickResult] : rearPickResult as PickResult[];

        ret.rearResult = rearResult;
        return ret;
    }

    async doBinPick(binPick: BinPick) {
        const { name, fromPhraseType } = binPick;
        if (fromPhraseType === undefined) return; // break;
        let pickResult: PickResult = await this.switchPhraseType(binPick);
        if (pickResult === undefined) return;
        this.formBudsStore.setNamedValues(name, pickResult);
        return pickResult;
    }

    async doBinPickRear(rearPickResultType: RearPickResultType): Promise<PickResult | PickResult[]> {
        const { name, fromPhraseType } = this.rearPick;
        switch (fromPhraseType) {
            default: break;
            case BizPhraseType.query:
                if (rearPickResultType === RearPickResultType.array) {
                    return await this.pickFromQuery(this.rearPick as PickQuery, rearPickResultType);
                }
                break;
            case BizPhraseType.pend:
                return await this.pickFromPend(this.rearPick as PickPend);
        }
        let pickResult = await this.switchPhraseType(this.rearPick);
        if (pickResult !== undefined) {
            this.formBudsStore.setNamedValues(name, pickResult);
            return pickResult;
        }
        return undefined;
    }

    private async switchPhraseType(pick: BinPick) {
        let pickResult: PickResult;
        switch (pick.fromPhraseType) {
            default: break;
            case BizPhraseType.atom:
                pickResult = await this.pickFromAtom(pick as PickAtom);
                break;
            case BizPhraseType.fork:
                // pickResult = await pickFromSpec(this, pick as PickSpec);
                break;
            case BizPhraseType.query:
                pickResult = await this.pickFromQueryScalar(pick as PickQuery);
                break;
            case BizPhraseType.options:
                // pickResult = await pickFromOptions(this.modal, pick as PickOptions);
                break;
        }
        return pickResult;
    }

    private async pickFromAtom(pick: PickAtom) {
        let ret = await this.openModal<AtomData>(this.PageAtomSelect(pick));
        // this.editing.store.cacheAtom(ret);
        this.storeSheet.cacheAtom(ret);
        return ret as any as PickResult;
    }

    protected PageAtomSelect(pick: PickAtom) {
        let { caption, from } = pick;
        return <PageIDSelect entity={from[0]} caption={caption} />
    }

    private async pickFromQueryScalar(pick: PickQuery) {
        let ret = await pickFromQueryScalar(this.formBudsStore, pick);
        return ret;
        /*
        let ret = await this.openModal<AtomData>(this.PageAtomSelect(pick));
        this.editing.store.cacheAtom(ret);
        return ret as any as PickResult;
        */
    }

    private async pickFromQuery(pick: PickQuery, rearPickResultType: RearPickResultType) {
        let ret = await pickFromQuery(this.formBudsStore, pick, rearPickResultType);
        return ret;
    }

    private async pickFromPend(pick: PickPend) {
        let ret = await pickFromPend(this.storeBin, this.formBudsStore, pick);
        return ret;
    }
}
