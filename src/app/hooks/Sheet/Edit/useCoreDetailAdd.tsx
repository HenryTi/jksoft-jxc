import { useCallback } from "react";
import { CoreDetail, Row, Section, BinDetail } from "./SheetStore";
import { Page, useModal } from "tonwa-app";
// import { usePick } from "app/hooks/BizPick";
import { ModalInputRow } from "./ModalInputDirect";
import { ModalInputPend } from "./ModalInputPend";
import { BinPick, PickAtom, PickPend, PickQuery, PickSpec } from "app/Biz";
import { Atom, BizPhraseType } from "uqs/UqDefault";
import { PageAtomSelect, ViewAtom, useSelectAtom } from "app/hooks/BizAtom";
import { AtomPhrase } from "app/tool";
import { usePickSpec } from "app/hooks/BizPick/userPickSpec";

type PickResult = { [prop: string]: any };
interface PickResults {
    [name: string]: PickResult;
}

export function useCoreDetailAdd(coreDetail: CoreDetail) {
    const { openModal, closeModal } = useModal();
    // const pick = usePick();
    const { entityBin } = coreDetail;
    const { picks: binPicks, pend, i, x } = entityBin;
    const returnUsePickSpec = usePickSpec();

    // if no detailSection add new, else edit
    async function addNewFromPend() {
        let inputed = await openModal<BinDetail[]>(<ModalInputPend propPend={pend} />);
        if (inputed === undefined) return;
        let iArr: BinDetail[] = [];
        let iGroup: number[] = [];
        let iColl: { [i: number]: BinDetail[] } = {};
        for (let r of inputed) {
            let { i, x } = r;
            if (x === undefined) {
                iArr.push(r);
            }
            else {
                let group = iColl[i];
                if (group === undefined) {
                    group = [r];
                    iColl[i] = group;
                    iGroup.push(i);
                }
                else {
                    group.push(r);
                }
            }
        }
        await addNewArr();
        await addNewGroup();
        async function addNewArr() {
            for (let rowProps of iArr) {
                let sec = new Section(coreDetail);
                coreDetail.addSection(sec);
                await sec.addRowProps(rowProps);
            }
        }
        async function addNewGroup() {

        }
    }

    async function pickFromAtom(binPick: BinPick, pickBase: PickAtom, results: PickResults) {
        let { name, caption } = binPick;
        let ret = await openModal<AtomPhrase>(<PageAtomSelect atomName={pickBase.from[0].phrase} caption={caption ?? name} />);
        /*
        function onPick() {
            closeModal({ name, caption });
        }
        let ret = await openModal(<Page header={caption ?? name} >
            <div className="p-3">
                <button className="btn btn-primary" onClick={onPick}>选择</button>
            </div>
        </Page>);
        */
        results[name] = ret;
    }
    async function pickFromSpec(binPick: BinPick, pickBase: PickSpec, results: PickResults) {
        let { name, caption, param } = binPick;
        let { from } = pickBase;
        let retAtom = results[param[0]?.bud] as Atom;
        const viewTop = <div>
            <ViewAtom value={retAtom} />
        </div>;
        const buttonCaption = '提交';
        const buttonClassName = 'btn btn-primary';
        let { retSpec, retViewTop } = await returnUsePickSpec({
            base: results[param[0]?.bud]?.id,
            entitySpec: from,
            viewTop,
            buttonCaption,
            buttonClassName,
        });
        /*
        function onPick() {
            closeModal({ name, caption });
        }
        let ret = await openModal(<Page header={caption ?? name} >
            <div className="p-3">
                <button className="btn btn-primary" onClick={onPick}>选择</button>
            </div>
        </Page>);
        */
        results[name] = retSpec;
    }
    async function pickFromQuery(binPick: BinPick, pickBase: PickQuery, results: PickResults) {
        let { name, caption } = binPick;
        function onPick() {
            closeModal({ name, caption });
        }
        let ret = await openModal(<Page header={caption ?? name} >
            <div className="p-3">
                <button className="btn btn-primary" onClick={onPick}>选择</button>
            </div>
        </Page>);
        results[name] = ret;
    }
    async function pickFromPend(binPick: BinPick, pickBase: PickPend, results: PickResults) {
        let { name, caption } = binPick;
        function onPick() {
            closeModal({ name, caption });
        }
        let ret = await openModal(<Page header={caption ?? name} >
            <div className="p-3">
                <button className="btn btn-primary" onClick={onPick}>选择</button>
            </div>
        </Page>);
        results[name] = ret;
    }

    // if no detailSection add new, else edit
    async function addNewDirect() {
        let section = new Section(coreDetail);
        let row = new Row(section);

        let pickResults: { [pick: string]: PickResult } = {};
        if (binPicks !== undefined) {
            for (const binPick of binPicks) {
                const { pick } = binPick;
                const { bizPhraseType } = pick;
                switch (bizPhraseType) {
                    default: debugger;
                    case BizPhraseType.atom: await pickFromAtom(binPick, pick as PickAtom, pickResults); break;
                    case BizPhraseType.spec: await pickFromSpec(binPick, pick as PickSpec, pickResults); break;
                    case BizPhraseType.atom: await pickFromQuery(binPick, pick as PickQuery, pickResults); break;
                    case BizPhraseType.atom: await pickFromPend(binPick, pick as PickPend, pickResults); break;
                }
            }
            // alert(JSON.stringify(pickResults));
        }

        /*
        let retI = await pick(i);
        if (retI === undefined) return;
        let { spec } = retI;
        row.props.i = spec;

        if (x !== undefined) {
            let retX = await pick(x);
            if (retX === undefined) return;
            let { spec } = retX;
            row.props.x = spec;
        }
        */
        // row.props.i = pickResults['pickspec']?.id;

        coreDetail.addSection(section);
        await openModal(<ModalInputRow row={row} picked={pickResults} />);
        await row.addToSection();
    }
    return useCallback(pend !== undefined ? addNewFromPend : addNewDirect, []);
}
