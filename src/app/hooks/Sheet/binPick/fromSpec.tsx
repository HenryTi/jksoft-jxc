import { BinPick, PickSpec } from "app/Biz";
import { usePickSpec } from "app/hooks/BizPick";
import { ViewAtom } from "app/hooks/BizAtom";
import { Atom } from "uqs/UqDefault";
import { useCallback } from "react";
import { NamedResults, PickResult } from "../store";
import { DivStore } from "../store";

export function usePickFromSpec() {
    const returnUsePickSpec = usePickSpec();
    return useCallback(async function pickFromSpec(divStore: DivStore, namedResults: NamedResults, binPick: PickSpec): Promise<PickResult> {
        let { pickParams, from } = binPick;
        let retAtom = namedResults[pickParams[0]?.bud] as Atom;
        const viewTop = <div>
            <ViewAtom value={retAtom} />
        </div>;
        const buttonCaption = '提交';
        const buttonClassName = 'btn btn-primary';
        let ret = await returnUsePickSpec({
            base: retAtom?.id,
            entitySpec: from,
            viewTop,
            buttonCaption,
            buttonClassName,
        });
        return ret;
    }, []);
}
