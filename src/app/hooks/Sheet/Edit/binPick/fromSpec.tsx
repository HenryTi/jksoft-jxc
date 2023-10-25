import { BinPick, PickSpec } from "app/Biz";
import { usePickSpec } from "app/hooks/BizPick/userPickSpec";
import { ViewAtom } from "app/hooks/BizAtom";
import { Atom } from "uqs/UqDefault";
import { useCallback } from "react";
import { PickResults } from "./useBinPicks";

export function usePickFromSpec() {
    const returnUsePickSpec = usePickSpec();
    return useCallback(async function pickFromSpec(results: PickResults, binPick: BinPick): Promise<any> {
        let { name, caption, param, pick } = binPick;
        let pickBase = pick as PickSpec;
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
    }, []);
}
