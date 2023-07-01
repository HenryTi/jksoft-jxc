import { PageQueryMore } from "app/coms";
import { IDView, Page, useModal } from "tonwa-app";
import { MetricItem } from "uqs/UqDefault";
import { PageAssignEdit } from "./PageAssignEdit";
import { GenAMSBudsSearch, GenBuds, GenBudsSearch, Med, RowMed } from "./GenBuds";
import { List, getAtomValue, setAtomValue } from "tonwa-com";
import { EntityAtom } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { useAtomValue } from "jotai";

interface PageAssignProps {
    caption: string;
    atomName: string;
    entitySetting: string;
    budNames: string[];
    noMedsMessage: string;
}

export function PageAssign(props: PageAssignProps) {
    const { atomName } = props;
    const uqApp = useUqApp();
    let entityAtom = uqApp.biz.entities[atomName] as EntityAtom;
    const { children } = entityAtom;
    switch (children.length) {
        case 0: break;
        case 1: entityAtom = children[0]; break;
        default:
            return <PageTypes {...props} entityAtom={entityAtom} />;
    }
    return <PageAssignContent {...props} entityAtom={entityAtom} />;
}

function PageTypes(props: { entityAtom: EntityAtom; } & PropsAssignSub) {
    let { entityAtom, caption } = props;
    const { openModal } = useModal();
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
    entitySetting: string;
    budNames: string[];
    noMedsMessage: string;
}

function PageAssignContent({ caption, entityAtom, entitySetting: entityName, budNames, noMedsMessage }: PropsAssignSub) {
    let uqApp = useUqApp();
    const genBuds = new GenBuds(uqApp, entityName, budNames);
    genBuds.noMedsMessage = noMedsMessage;
    const genBudsSearch = new GenAMSBudsSearch(genBuds, entityAtom.phrase);
    const { openModal } = useModal();
    const { entity, bizBuds, uq } = genBuds;
    function ViewItem({ value }: { value: RowMed; }) {
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
        const none = <div className="text-danger ps-5 py-3">
            {noMedsMessage}
        </div>;
        function ViewAtomGoods({ value }: { value: any }) {
            // import error
            debugger;
            return <></>;
        }
        return <div>
            <div className="px-3 py-2 tonwa-bg-gray-2"><ViewAtomGoods value={atom} /></div>
            <List items={meds} ViewItem={ViewMed} none={none} />
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
