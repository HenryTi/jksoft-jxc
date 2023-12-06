import { BinPick, PickSpec } from "app/Biz";
import { usePickSpec } from "app/hooks/BizPick";
import { ViewAtom } from "app/hooks/BizAtom";
import { Atom } from "uqs/UqDefault";
import { useCallback } from "react";
import { NamedResults, PickResult } from "../NamedResults";

export function usePickFromSpec() {
    const returnUsePickSpec = usePickSpec();
    return useCallback(async function pickFromSpec(namedResults: NamedResults, binPick: BinPick): Promise<PickResult> {
        let { pickParams, pick } = binPick;
        let pickBase = pick as PickSpec;
        let { from } = pickBase;
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
