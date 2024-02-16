import { BinPick, EntityBin } from "app/Biz";
import { BizPhraseType } from "uqs/UqDefault";
import { useCallback, useRef, useState } from "react";
import { usePickFromAtom } from "./fromAtom";
import { usePickFromSpec } from "./fromSpec";
import { usePickFromPend } from "./fromPend";
import { usePickFromQuery } from "./fromQuery";
import { SheetStore } from "../store";
import { NamedResults, PickResult } from "../NamedResults";
import { Page, useModal } from "tonwa-app";
import { FA, Sep, useEffectOnce } from "tonwa-com";
import { RearPickResultType, ReturnUseBinPicks } from "./useBinPicks";

interface Props {
    sheetStore: SheetStore;
    rearPickResultType: RearPickResultType;
    onPicked: (results: ReturnUseBinPicks) => Promise<void>;
}

export function PageBinPicks({ sheetStore, rearPickResultType, onPicked }: Props) {
    const modal = useModal();
    const pickFromAtom = usePickFromAtom();
    const pickFromSpec = usePickFromSpec();
    const pickFromPend = usePickFromPend();
    const [pickFromQueryScalar, pickFromQuery] = usePickFromQuery();
    const { main, entitySheet, divStore } = sheetStore;
    const { binPicks, rearPick } = main.entityMain;
    const { caption, name } = entitySheet;
    const header = caption ?? name;
    const [namedResults, setNamedResult] = useState<{ [name: string]: any }>({
        '%sheet': new Proxy(main.valRow, main.entityMain.proxyHandler()),
    });
    let [rearPickResult, setRearPickResult] = useState(undefined);

    async function onPick(binPick: BinPick) {
        let pickResult: any;
        const { name, pick } = binPick;
        const { bizPhraseType } = pick;
        if (bizPhraseType === undefined) return;
        switch (bizPhraseType) {
            default: debugger; break;
            case BizPhraseType.atom:
                pickResult = await pickFromAtom(divStore, namedResults, binPick);
                break;
            case BizPhraseType.spec:
                pickResult = await pickFromSpec(divStore, namedResults, binPick);
                break;
            case BizPhraseType.query:
                pickResult = await pickFromQueryScalar(namedResults, binPick);
                break;
        }
        if (pickResult === undefined) return;
        setNamedResult({ ...namedResults, [name]: pickResult });
        namedResults[name] = pickResult;
    }
    async function onPickRear(binPick: BinPick) {
        if (sheetStore === undefined) debugger;
        const { divStore } = sheetStore;
        let pickResult: PickResult[] | PickResult;
        const { pick } = rearPick;
        switch (pick.bizPhraseType) {
            default: debugger; break;
            case BizPhraseType.atom:
                pickResult = await pickFromAtom(divStore, namedResults, rearPick);
                break;
            case BizPhraseType.spec:
                pickResult = await pickFromSpec(divStore, namedResults, rearPick);
                break;
            case BizPhraseType.query:
                pickResult = await pickFromQuery(namedResults, rearPick, rearPickResultType);
                break;
            case BizPhraseType.pend:
                pickResult = await pickFromPend(divStore, namedResults, rearPick);
        }
        setRearPickResult(pickResult);
    }

    function ViewBinPick({ binPick, onPick }: { binPick: BinPick; onPick: (binPick: BinPick) => Promise<void> }) {
        return <>
            <div className="container">
                <div className="row">
                    <div className="col-3 py-2 tonwa-bg-gray-1">
                        <FA name="angle-double-right" fixWidth={true} className="small me-2 text-warning" />
                        <span className="text-secondary">{binPick.name}</span>
                    </div>
                    <div className="col py-2 cursor-pointer" onClick={async () => await onPick(binPick)}>
                        <div className="d-flex">
                            <div className="text-secondary flex-fill">
                                {JSON.stringify(namedResults[binPick.name]) ?? <span className="text-secondary">-</span>}
                            </div>
                            <div className="ms-3">
                                <FA name="pencil" fixWidth={true} className="small text-info" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Sep />
        </>;
    }
    async function onStart() {
        if (rearPickResult === undefined) return;
        let rearResult: PickResult[] = Array.isArray(rearPickResult) === false ?
            [rearPickResult as PickResult] : rearPickResult as PickResult[];

        let ret: ReturnUseBinPicks = {
            namedResults,
            rearBinPick: rearPick,           // endmost pick
            rearResult,
            rearPickResultType: rearPickResultType,
        };
        await onPicked(ret);
    }
    return <Page header={header}>
        <div className="p-3 tonwa-bg-gray-2">选择待处理业务</div>
        <Sep />
        {binPicks.map(v => {
            const { name } = v;
            return <ViewBinPick key={name} binPick={v} onPick={onPick} />;
        })}
        <ViewBinPick binPick={rearPick} onPick={onPickRear} />
        <div className="p-3">
            <button className="btn btn-primary" onClick={onStart} disabled={rearPickResult === undefined}>开始</button>
        </div>
    </Page>;
}
