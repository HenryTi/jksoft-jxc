import { BudRadio } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { ButtonRightAdd, PageQueryMore } from "app/coms";
import { CaptionAtom, OptionsUseBizAtom, useBizAtomList, useBizAtomNew } from "app/hooks";
import { GAtom, UseQueryOptions } from "app/tool";
import { ViewAtom } from "app/views/ViewAtom";
import { atom, useAtomValue } from "jotai";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { IDView, Page, useModal } from "tonwa-app";
import { List, Sep, setAtomValue } from "tonwa-com";
import { Atom, EnumAtom } from "uqs/UqDefault";
import { ViewItemUomI } from "./PageUomI";

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
        let { uom } = await uq.GetUomFromType.query({ id });
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
            return <Link to={pathUomIListOfUom(value.id)}>
                <div className="px-3 py-2">
                    <ViewAtom value={value as any} />
                </div>
            </Link>;
        }
        return <Page header={header} right={right}>
            <List items={uomList} ViewItem={ViewItem} />
        </Page>;
    }
    return <Ret />;
}

export function pathUomIListOfUom(param: string | number) {
    return '/uomi-list-of-uom/' + param;
}
export function PageUomIListOfUom() {
    const { uq } = useUqApp();
    const { id: idParam } = useParams();
    const id = Number(idParam);
    async function getUomIListOfUom(param: any, pageStart: any, pageSize: number): Promise<any[]> {
        let query = uq.GetUomIListOfUom;
        let ret = await query.page(param, pageStart, pageSize);
        let { $page } = ret;
        return $page;
    };
    let param = {
        uom: id
    };
    function ViewItem({ value }: { value: any }) {
        return <Link to={`/uomi/${value.id}`}>
            <div className="px-3 py-2">
                <ViewItemUomI value={value} />
            </div>
        </Link>
    }
    const right = <>R</>;
    const top = <div>
        <div className="m-3">
            <IDView uq={uq} id={id} Template={ViewAtom} />
        </div>
        <Sep />
    </div>;
    return <PageQueryMore header={<CaptionAtom atom={EnumAtom.Uom} />}
        query={getUomIListOfUom}
        param={param}
        sortField={'id'}
        ViewItem={ViewItem}
        right={right}
    >
        {top}
    </PageQueryMore>;
}

function PageList() {
    let { page } = useBizAtomList({ ...options, ViewItemAtom: ViewItemUom });
    return page;
}

function ViewItemUom({ value }: { value: Atom; }) {
    return <ViewAtom value={value} />;
}

export const gUom: GAtom = {
    name: options.atomName,
    pageNew: <PageNew />,
    pageEdit: <PageView />,
    pageList: <PageList />,
    pageView: <PageView />,
    ViewItem: ViewItemUom,
}
