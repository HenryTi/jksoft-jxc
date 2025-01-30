import { EntityAssign } from "tonwa";
import { useUqApp } from "app/UqApp";
import { useParams } from "react-router-dom";
import { from62, to62 } from "tonwa-com";
import { PageQueryMore } from "app/coms";
import { ViewAtom } from "../BizAtom";
import { FocusEvent, useCallback, useState, JSX } from "react";
import { ReturnGetAssigns$page } from "uqs/UqDefault";

function assignInPath(phrase: number | string) {
    if (typeof phrase === 'string') {
        if (phrase !== ':assign') debugger;
        return phrase;
    }
    return to62(phrase);
}

interface UseBizAssingReturn {
    page: JSX.Element;
}

export function useBizAssign(): UseBizAssingReturn {
    const { assign } = useParams();
    let phraseId = from62(assign);
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const entity = biz.entityFromId<EntityAssign>(phraseId);

    return {
        page: <PageAssign />
    }
    function PageAssign() {
        const { id, name, caption } = entity;
        const [searchParam, setSearchParam] = useState({ assign: id, params: {} });

        const query = useCallback(async function (param: any, pageStart: any, pageSize: number) {
            let ret = await uq.GetAssigns.page(searchParam, pageStart, pageSize);
            return ret.$page;
        }, []);

        function ViewItem({ value }: { value: ReturnGetAssigns$page }) {
            return <div className="px-3 py-2 d-flex">
                <div className="flex-grow-1">
                    <ViewAtom value={value as any} />
                </div>
                {entity.titles.map((bud, index) => {
                    async function onBlur(evt: FocusEvent<HTMLInputElement>) {
                        let { value: inputValue } = evt.currentTarget;
                        let v = Number(inputValue);
                        if (Number.isNaN(v) === true) return;
                        await uq.SaveBudValue.submit({
                            phraseId: bud.id,
                            id: value.id,
                            int: undefined,
                            dec: v,
                            str: undefined
                        });
                    }
                    return <input key={index} onBlur={onBlur} defaultValue={value.values[index]}
                        className="w-8c form-control ms-3 text-end align-self-start" type="number" />;
                })}
            </div>;
        }
        const titleCaptions = entity.titles.map(v => v.caption);
        return <PageQueryMore header={caption}
            query={query}
            param={searchParam}
            sortField="id"
            ViewItem={ViewItem}
        >
            <div className="px-3 my-3">{entity.atoms.map(v => (v.caption)).join(', ')}</div>
            <div className="d-flex px-3">
                <div className="flex-grow-1"></div>
                {titleCaptions.map((v, index) => <div key={index} className="w-8c text-end ms-3 me-2 small">{v}</div>)}
            </div>
        </PageQueryMore>;
    }
}

export function pathAssign(phrase: number | string) {
    return `assign/${assignInPath(phrase)}`;
}
