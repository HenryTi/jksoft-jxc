import { EntityTie, TieField } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { useParams } from "react-router-dom";
import { from62, to62 } from "tonwa-com";
import { PageQueryMore } from "app/coms";
import { ViewAtom } from "../BizAtom";
import { useCallback, useState } from "react";
import { ReturnGetAssigns$page } from "uqs/UqDefault";

function tieInPath(phrase: number | string) {
    if (typeof phrase === 'string') {
        if (phrase !== ':tie') debugger;
        return phrase;
    }
    return to62(phrase);
}

interface UseBizTieReturn {
    page: JSX.Element;
}

export function useBizTie(): UseBizTieReturn {
    const { tie } = useParams();
    let phraseId = from62(tie);
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const entity = biz.entityFromId<EntityTie>(phraseId);
    const { i, x } = entity;

    return {
        page: <PageTie />
    }
    function PageTie() {
        const { id, name, caption } = entity;
        const [searchParam, setSearchParam] = useState({ tie: id, params: {} });

        const query = useCallback(async function (param: any, pageStart: any, pageSize: number) {
            //let ret = await uq.GetAssigns.page(searchParam, pageStart, pageSize);
            //return ret.$page;
            return [];
        }, []);

        function ViewItem({ value }: { value: ReturnGetAssigns$page }) {
            return <div className="px-3 py-2 d-flex">
                <div className="flex-grow-1">
                    <ViewAtom value={value as any} />
                </div>
            </div>;
        }
        function ViewAtomCaptions({ tieField }: { tieField: TieField }) {
            const captions = tieField.atoms.map(v => v.caption ?? v.name);
            return <div className="px-3 py-2">
                {
                    captions.map((v, index) => {
                        return <div key={index} className="">{v}</div>;
                    })
                }
            </div>;
        }
        return <PageQueryMore header={caption ?? name}
            query={query}
            param={searchParam}
            sortField="id"
            ViewItem={ViewItem}
        >
            <div className="d-flex align-items-center">
                <ViewAtomCaptions tieField={i} />
                <div className="mx-5">&lt;-&gt;</div>
                <ViewAtomCaptions tieField={x} />
            </div>
        </PageQueryMore>;
    }
}

export function pathTie(phrase: number | string) {
    return `tie/${tieInPath(phrase)}`;
}
