import { JSX } from "react";
import { EntityID, EntityTie } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { useParams } from "react-router-dom";
import { FA, from62, to62 } from "tonwa-com";
import { PageQueryMore } from "app/coms";
import { useCallback, useState } from "react";
import { ReturnGetTies$page } from "uqs/UqDefault";
import { usePickID } from "../BizPick";
import { IxField } from "app/Biz/BizBase";

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
            let ret = await uq.GetTies.page(searchParam, pageStart, pageSize);
            return ret.$page;
        }, []);

        function ViewItem({ value }: { value: ReturnGetTies$page }) {
            return <ViewItemCom value={value} tie={entity} />;
        }
        function ViewAtomCaptions({ ixField }: { ixField: IxField }) {
            let content: any;
            const { atoms } = ixField;
            if (atoms === undefined) {
                content = <div>用户</div>;
            }
            else {
                content = atoms.map(v => v.caption);
            }
            return <div className="px-3 py-2">
                {content}
            </div>;
        }
        return <PageQueryMore header={caption}
            query={query}
            param={searchParam}
            sortField="id"
            ViewItem={ViewItem}
        >
            <div className="d-flex align-items-center border-bottom py-2 tonwa-bg-gray-2">
                <ViewAtomCaptions ixField={i} />
                <div className="mx-5">&lt;-&gt;</div>
                <ViewAtomCaptions ixField={x} />
            </div>
        </PageQueryMore>;
    }
}

export function pathTie(phrase: number | string) {
    return `tie/${tieInPath(phrase)}`;
}

function ViewItemCom({ value: { id: iId, no, ex, values }, tie }: { value: ReturnGetTies$page; tie: EntityTie; }) {
    const { uq } = useUqApp();
    const { i, x } = tie;
    const pickID = usePickID();
    const [xArr, setXArr] = useState<[number, string, string][]>(values ?? []);
    async function onAdd() {
        let { retID } = await pickID(x.atoms[0] as EntityID, undefined);
        let { id, no, ex } = retID;
        if (xArr.findIndex(v => v[0] === id) >= 0) return;
        await uq.SaveTie.submit({ tie: tie.id, i: iId, x: id });
        let arr: [number, string, string][] = [...xArr, [id, no, ex]];
        setXArr(arr);
    }

    async function onDeleteX(x: number) {
        await uq.DeleteTie.submit({ tie: tie.id, i: iId, x });
        let index = xArr.findIndex(v => v[0] === x);
        if (index >= 0) {
            xArr.splice(index, 1);
            setXArr([...xArr]);
        }
    }

    if (i.atoms === undefined) {
        let [assigned, nick] = ex.split('|');
        if (assigned === '') {
            if (nick === '') {
                ex = undefined;
            }
            else {
                ex = nick;
            }
        }
        else {
            ex = assigned;
        }
    }

    function ViewI() {
        if (ex === undefined) {
            return <div className="fw-bold flex-grow-1">{no}</div>;
        }
        return <>
            <div className="fw-bold">{ex}</div>
            <small className="ms-3 text-secondary flex-grow-1">{no}</small>
        </>;
    }

    let vx: any;
    if (xArr.length === 0) {
        vx = <div className="small text-secondary ms-3 mt-2">[无]</div>;
    }
    else {
        vx = <>{xArr.map(x => <ViewX key={x[0]} x={x} onDeleteX={onDeleteX} />)}</>;
    }
    return <div className="">
        <div className="d-flex tonwa-bg-gray-1 border-bottom pb-2 pt-1 ps-3 border-light-subtle align-items-end">
            <ViewI />
            <button className="btn btn-link pb-0" onClick={onAdd}>
                <FA name="plus" />
            </button>
        </div>
        <div className="d-flex flex-wrap ps-3 pt-1 pb-3">{vx}</div>
    </div>;
}

function ViewX({ x: [id, no, ex], onDeleteX }: { x: [number, string, string], onDeleteX: (x: number) => Promise<void> }) {
    const [acting, setActing] = useState(false);
    async function onDel() {
        setActing(true);
        await onDeleteX(id);
        setActing(false);
    }
    let right = acting === true ?
        {
            cn: '',
            onClick: undefined as any,
            fa: 'spinner',
            faColor: 'text-info',
        }
        :
        {
            cn: 'cursor-pointer ',
            onClick: onDel,
            fa: 'times',
            faColor: 'text-secondary',
        };

    return <div className="w-16c border ps-3 rounded mx-2 my-1 d-flex">
        <div className="flex-grow-1 py-1">
            <div>{ex}</div>
            <div><small>{no}</small></div>
        </div>
        <div className={right.cn + ' ps-1 pe-2'} onClick={right.onClick}>
            <FA name={right.fa} className={right.faColor} />
        </div>
    </div >
}
