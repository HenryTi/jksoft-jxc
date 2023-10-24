import { BinPick, EntityBin, PickAtom, PickPend, PickQuery, PickSpec } from "app/Biz";
import { Page, useModal } from "tonwa-app";
import { usePickSpec } from "app/hooks/BizPick/userPickSpec";
import { PageAtomSelect, ViewAtom } from "app/hooks/BizAtom";
import { Atom, BizPhraseType } from "uqs/UqDefault";
import { AtomPhrase } from "app/tool";
import { useCallback } from "react";

export type PickResult = { [prop: string]: any };
export interface PickResults {
    [name: string]: PickResult;
}

export function useBinPicks(bin: EntityBin) {
    const { picks: binPicks } = bin;
    const returnUsePickSpec = usePickSpec();
    const { openModal, closeModal } = useModal();

    // if no detailSection add new, else edit
    return useCallback(async function pick() {
        let results: { [pick: string]: PickResult } = {};
        async function pickFromAtom(binPick: BinPick, pickBase: PickAtom): Promise<any> {
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
            return results[name] = ret;
        }
        async function pickFromSpec(binPick: BinPick, pickBase: PickSpec): Promise<any> {
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
            return results[name] = retSpec;
        }
        async function pickFromQuery(binPick: BinPick, pickBase: PickQuery): Promise<any> {
            let { name, caption } = binPick;
            function onPick() {
                closeModal({ name, caption });
            }
            let ret = await openModal(<Page header={caption ?? name} >
                <div className="p-3">
                    <button className="btn btn-primary" onClick={onPick}>选择</button>
                </div>
            </Page>);
            return results[name] = ret;
        }
        async function pickFromPend(binPick: BinPick, pickBase: PickPend): Promise<any> {
            let { name, caption } = binPick;
            function onPick() {
                closeModal({ name, caption });
            }
            let ret = await openModal(<Page header={caption ?? name} >
                <div className="p-3">
                    <button className="btn btn-primary" onClick={onPick}>选择</button>
                </div>
            </Page>);
            return results[name] = ret;
        }

        if (binPicks !== undefined) {
            for (const binPick of binPicks) {
                const { pick } = binPick;
                const { bizPhraseType } = pick;
                let picked: any;
                switch (bizPhraseType) {
                    default: debugger;
                    case BizPhraseType.atom: picked = await pickFromAtom(binPick, pick as PickAtom); break;
                    case BizPhraseType.spec: picked = await pickFromSpec(binPick, pick as PickSpec); break;
                    case BizPhraseType.atom: picked = await pickFromQuery(binPick, pick as PickQuery); break;
                    case BizPhraseType.atom: picked = await pickFromPend(binPick, pick as PickPend); break;
                }
                if (picked === undefined) return undefined;
            }
        }
        return results;
    }, []);
}
