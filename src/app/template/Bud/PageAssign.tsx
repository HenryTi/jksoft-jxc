import { PageQueryMore } from "app/coms";
import { IDView, Page, useModal } from "tonwa-app";
import { MetricItem } from "uqs/UqDefault";
import { PageAssignEdit } from "./PageAssignEdit";
import { GenAMSBudsSearch, GenBuds, GenBudsSearch, Med, RowMed } from "./GenBuds";
import { List, getAtomValue, setAtomValue } from "tonwa-com";
import { ViewAtomGoods } from "app/views/JXC/Atom";
import { GenProps, useGen } from "app/tool";
import { GenAtom } from "../Atom";
import { Link, useParams } from "react-router-dom";
import { EntityAtom } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { useAtomValue } from "jotai";

interface PageAssignProps extends GenProps<GenAtom> {
    caption: string;
    //genBuds: GenBuds;
    //genBudsSearch: GenBudsSearch;
    entitySetting: string;
    budNames: string[];
}

export function PageAssign(props: PageAssignProps) {
    let { Gen } = props;
    const gen = useGen(Gen);
    const { entity } = gen;
    const { atom: atomName } = useParams();
    let entityAtom = gen.getEntityAtom(atomName) ?? entity;
    const { children } = entityAtom;
    switch (children.length) {
        case 0: break;
        case 1: entityAtom = children[0]; break;
        default:
            return <PageTypes {...props} entityAtom={entityAtom} gen={gen} />;
    }
    return <PageAssignContent {...props} entityAtom={entityAtom} />;
}
/*
function PageList({ entityAtom, gen }: { entityAtom: EntityAtom; gen: GenAtom; }) {
    let { genAtomList, genAtomView, searchAtoms, ViewItemAtom } = gen;
    let { listTop } = genAtomList;
    let { caption } = entityAtom;
    let searchParam = {
        atom: entityAtom.phrase,
        key: undefined as string,
    };
    function ViewItem({ value }: { value: any }) {
        return <Link to={`../${genAtomView.path}/${value.id}`}>
            <div className="px-3 py-2">
                <ViewItemAtom value={value} />
            </div>
        </Link>;
    }
    // pageSize={20}
    // pageMoreSize={1}
    const none = <div className='m-3 small text-muted'>[无{caption}]</div>;
    return <PageQueryMore header={`${caption}列表`}
        query={searchAtoms}
        param={searchParam}
        sortField="id"
        ViewItem={ViewItem}
        none={none}
    >
        {listTop}
    </PageQueryMore>;
}
*/
function PageTypes(props: { entityAtom: EntityAtom; gen: GenAtom; } & PropsAssignSub) {
    let { entityAtom, gen } = props;
    const { openModal } = useModal();
    const { genAtomList, caption } = gen;
    const { children } = entityAtom;
    function ViewItem({ value }: { value: EntityAtom; }) {
        const { name, caption } = value;
        // <Link to={`../${genAtomList.path}/${name}`}>
        return <div className="px-3 py-2">
            {caption}
        </div>
        //</Link>;
    }
    function onItemClick(item: EntityAtom) {
        openModal(<PageAssignContent {...props} entityAtom={item} />);
        // closeModal(item);
    }
    return <Page header={`${caption}列表 - 大类`}>
        <List items={children} ViewItem={ViewItem} onItemClick={onItemClick} />
    </Page>
}

interface PropsAssignSub {
    entityAtom: EntityAtom;
    caption: string;
    //genBuds: GenBuds;
    //genBudsSearch: GenBudsSearch;
    entitySetting: string;
    budNames: string[];
}

function PageAssignContent({ caption, entityAtom, entitySetting: entityName, budNames }: PropsAssignSub) {
    let uqApp = useUqApp();
    const genBuds = new GenBuds(uqApp, entityName, budNames);
    const genBudsSearch = new GenAMSBudsSearch(genBuds, entityAtom.phrase);
    // { caption, genBuds, genBudsSearch }: PageAssignProps
    const { openModal } = useModal();
    const { entity, bizBuds, uq } = genBuds;
    // let genAtomBudsSearch = new GenAtomBudsSearch(genBuds);
    const { name: bizEntityName } = entity;
    function ViewItem({ value }: { value: RowMed; }) {
        // let { buds } = value;
        let { atom, meds } = value;
        function ViewValue({ value }: { value: number; }) {
            return value !== undefined ?
                <b className="fs-5">{value}</b>
                :
                <span className="text-muted small">(无)</span>
        }
        function ViewMetric({ value }: { value: MetricItem; }) {
            return <div className="w-6c">
                {value.ex}
            </div>;
        }
        function ViewMed({ value }: { value: Med; }) {
            // let { values } = value;
            let values = useAtomValue(value.atomValues);
            return <div className="ms-5 ps-3 py-2 d-flex">
                <IDView id={value.detail} Template={ViewMetric} uq={uq} />
                <div className="d-flex">
                    {bizBuds.map((v, index) => {
                        return <div key={index}>{v.caption} <ViewValue value={values?.[index]} /></div>
                    })}
                </div>
            </div>;
        }
        return <div>
            <div className="px-3 py-2 tonwa-bg-gray-2"><ViewAtomGoods value={atom} /></div>
            <List items={meds} ViewItem={ViewMed} />
        </div>;
    }
    async function onItemClick(value: RowMed) {
        let ret = await openModal(<PageAssignEdit genBuds={genBuds} rowMed={value} />);
        if (ret === undefined) return;
        await genBuds.saveBuds(bizBuds[0], ret);
        let { meds } = value;
        let len = meds.length;
        for (let i = 0; i < len; i++) {
            let med = meds[i];
            let { id, values } = med;
            let v = ret[id];
            if (v === undefined) continue;
            v = Number(v);
            if (Number(values[0]) === v) continue;
            let curValues = getAtomValue(med.atomValues);
            curValues[0] = v;
            setAtomValue(med.atomValues, [...curValues]);
        }
    }
    // pageSize={20}
    // pageMoreSize={5}
    return <PageQueryMore header={caption}
        query={genBudsSearch.search}
        param={{}}
        sortField="id"
        ViewItem={ViewItem}
        onItemClick={onItemClick}
    >
    </PageQueryMore>;
    /*
        <div className="p-3 tonwa-bg-gray-3">{caption} dd</div>
        <div className="p-3 tonwa-bg-gray-2">{bizEntityName} {caption} d bbb</div>
    */
}
