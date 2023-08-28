import { BizBud, BudRadio } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { ButtonRightAdd } from "app/coms";
import { OptionsUseBizAtom, pathAtomNew, useBizAtomList, useBizAtomNew, useBizAtomView } from "app/hooks";
import { GAtom, UseQueryOptions } from "app/tool";
import { ViewAtom } from "app/views/ViewAtom";
import { atom, useAtom, useAtomValue } from "jotai";
import { useMemo, useRef } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { Page, useModal } from "tonwa-app";
import { List, setAtomValue } from "tonwa-com";
import { Atom, EnumAtom } from "uqs/UqDefault";

const options: OptionsUseBizAtom = {
    atomName: EnumAtom.Uom,
    NOLabel: undefined,
    exLabel: undefined,
}

function PageNew() {
    let { page: Page } = useBizAtomNew(options);
    return Page;
}

function PageView() {
    const { uq, biz } = useUqApp();
    const { openModal } = useModal();
    const uom = biz.entities[options.atomName];
    const { caption, buds } = uom;
    const { budDataType } = buds['type'];
    const { id: idParam } = useParams();
    const id = Number(idParam);
    const { coll } = budDataType as BudRadio;
    const [itemName, itemCaption] = coll[id];
    const { data } = useQuery(['EnumAtom.Uom', id], async () => {
        let { uom } = await uq.GetUom.query({ id });
        console.log('EnumAtom.Uom', uom);
        let uomAtom = atom(uom);
        return uomAtom;
    }, UseQueryOptions);
    function Ret() {
        const header = `${caption} - ${itemCaption ?? itemName}`;
        const uomList = useAtomValue(data);
        const right = <ButtonRightAdd onClick={onAdd} />;
        async function onAdd() {
            function PageAdd() {
                let { modalContent } = useBizAtomNew(options);
                return <Page header={header}>
                    {modalContent}
                </Page>;
            }
            let ret = await openModal(<PageAdd />);
            await uq.SaveUomType.submit({ id: ret.id, type: id });
            setAtomValue(data, [...uomList, ret]);
        }
        function ViewItem({ value }: { value: Partial<Atom>; }) {
            return <div className="px-3 py-2">
                <ViewAtom value={value as any} />
            </div>;
        }
        return <Page header={header} right={right}>
            <List items={uomList} ViewItem={ViewItem} />
        </Page>;
    }
    return <Ret />;
}

function PageList() {
    let { page } = useBizAtomList({ ...options, ViewItemAtom: ViewItemUom });
    return page;
}

function ViewItemUom({ value }: { value: Atom; }) {
    return <div>
        {JSON.stringify(value)}
    </div>
}

export const gUom: GAtom = {
    name: options.atomName,
    pageNew: <PageNew />,
    pageEdit: <PageView />,
    pageList: <PageList />,
    pageView: <PageView />,
    ViewItem: ViewItemUom,
}
