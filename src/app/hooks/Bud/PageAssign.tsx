import { PageQueryMore } from "app/coms";
import { IDView, Page, useModal } from "tonwa-app";
import { EnumAtom } from "uqs/UqDefault";
import { PageAssignEdit } from "./PageAssignEdit";
import { Med, RowMed, useAMSBudsSearch } from "./useBuds";
import { List, getAtomValue, setAtomValue } from "tonwa-com";
import { EntityAtom } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { useAtomValue } from "jotai";
import { Uom } from "app/tool";
import { ViewAtom } from "app/views";

interface PageAssignProps {
    atom: EnumAtom;
    caption: string;
    budNames: string | (string[]);
    noMedsMessage: string;
}

export function PageAssign(props: PageAssignProps) {
    const { atom: atomName, noMedsMessage, caption, budNames } = props;
    const uqApp = useUqApp();
    const { openModal } = useModal();
    let entityAtom = uqApp.biz.entities[atomName.toLowerCase()] as EntityAtom;
    const { children } = entityAtom;
    if (children !== undefined) {
        switch (children.length) {
            case 0: break;
            case 1: entityAtom = children[0]; break;
            default:
                return <PageTypes />;
        }
    }
    return <PageAssignContent atomName={atomName} />;

    function PageTypes() {
        function ViewItem({ value }: { value: EntityAtom; }) {
            const { caption } = value;
            return <div className="px-3 py-2">
                {caption}
            </div>
        }
        function onItemClick(item: EntityAtom) {
            const { name } = item;
            openModal(<PageAssignContent atomName={name} />);
        }
        return <Page header={`${caption}列表 - 大类`}>
            <List items={children} ViewItem={ViewItem} onItemClick={onItemClick} />
        </Page>
    }

    function PageAssignContent({ atomName }: { atomName: string; }) {
        const uqApp = useUqApp();
        const { uq } = uqApp;
        const genBudsSearch = useAMSBudsSearch({ entity: atomName, budNames, noMedsMessage });
        const { openModal } = useModal();
        const { entity, bizBuds, saveBuds, search } = genBudsSearch;
        function ViewItem({ value }: { value: RowMed; }) {
            let { atom, meds } = value;
            function ViewValue({ value }: { value: number; }) {
                return value !== undefined ?
                    <b className="fs-5">{value}</b>
                    :
                    <span className="text-muted small">(无)</span>
            }
            function ViewUom({ value }: { value: Uom; }) {
                return <div className="w-6c">
                    {value.ex}
                </div>;
            }
            function ViewMed({ value }: { value: Med; }) {
                let values = useAtomValue(value.atomValues);
                return <div className="ms-5 ps-3 py-2 d-flex">
                    <IDView id={value.detail} Template={ViewUom} uq={uq} />
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
            return <div>
                <div className="px-3 py-2 tonwa-bg-gray-2"><ViewAtom value={atom} /></div>
                <List items={meds} ViewItem={ViewMed} none={none} />
            </div>;
        }
        async function onItemClick(value: RowMed) {
            let ret = await openModal(<PageAssignEdit rowMed={value} entity={entity} noMedsMessage={noMedsMessage} />);
            if (ret === undefined) return;
            await saveBuds(bizBuds[0], ret);
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
            query={search}
            param={{}}
            sortField="id"
            ViewItem={ViewItem}
            onItemClick={onItemClick}
        >
        </PageQueryMore>;
    }
}
