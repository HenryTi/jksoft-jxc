import { Route, useNavigate, useParams } from "react-router-dom";
import { Page, PageConfirm, useModal } from "tonwa-app";
import { ViewUomList } from "./ViewUomList";
import { OptionsUseBizAtom, useBizAtomList, useBizAtomNew, useBizAtomView, useBizAtomViewFromId } from "app/hooks";
import { EnumAtom } from "uqs/UqDefault";
import { ViewListHeader } from "./ViewListHeader";
import { GAtom } from "app/tool";
import { Band, ButtonRight, FormRow, FormRowsView, PageMoreCacheData, PageQueryMore } from "app/coms";
import { FA, LMR, List, useEffectOnce } from "tonwa-com";
import { useState } from "react";
import { Uom, UomI, UomX } from "./model";
import { useForm } from "react-hook-form";
import { useUqApp } from "app/UqApp";
import { useQuery } from "react-query";

const options: OptionsUseBizAtom = {
    atomName: EnumAtom.UomI,
    NOLabel: undefined,
    exLabel: undefined,
}

function PageList() {
    let {
        header,
        right,
        query,
        param,
        sortField,
        ViewItem,
        none,
    } = useBizAtomList({
        ...options,
        ViewItemAtom,
    });
    const top = <>
        <ViewUomList />
        <ViewListHeader caption="计量单位" right={right} onAdd={onAdd} />
    </>;

    async function onAdd() {
    }

    function ViewItemAtom({ value }: { value: any; }) {
        return <div>
            {JSON.stringify(value)}
        </div>
    }
    // right={right}
    return <PageQueryMore header={header}
        query={query}
        param={param}
        sortField={sortField}
        ViewItem={ViewItem}
        none={none}
    >
        {top}
    </PageQueryMore>;
    /*
    return <Page header={captionUomList}>
        <ViewUomList />
        <ViewUomIList />
    </Page>;
    */
}

function PageNew() {
    let { page } = useBizAtomNew(options);
    return page;
}

function PageEdit() {
    let { view, caption } = useBizAtomView(options);
    return <Page header={caption}>
        <div>EDIT</div>
        {view}
        <div>UomXList</div>
    </Page>;
}

function ViewItemUomI({ value }: { value: any }) {
    return <div>
        {JSON.stringify(value)}
    </div>
}

export const captionUomList = '计量单位';
export const pathUomList = 'uomi-list';

export const gUomI: GAtom = {
    name: options.atomName,
    pageNew: <PageNew />,
    pageEdit: <PageEdit />,
    pageList: <PageList />,
    pageView: <PageView />,
    ViewItem: ViewItemUomI,
}

function PageView() {
    const caption = '计量单位';
    const navigate = useNavigate();
    const uqApp = useUqApp();
    const { uq } = uqApp;
    const { openModal } = useModal();
    const { id: idParam } = useParams();
    const idValue = Number(idParam);
    const { data: { uomI, uomxList } } = useQuery(['GetUomI', idParam], async () => {
        let { UomI: retUomI, UomX: retUomX } = await uq.GetUomI.query({ id: idValue });
        let uomI: UomI;
        if (retUomI.length > 0) {
            let {
                id,
                // base,
                no,
                ex,
                discription,
                ratio,
                uom,
                uomNo,
                uomEx,
                uomDiscription,
            } = retUomI[0];
            uomI = {
                id, no, ex, discription, ratio,
                uom: { id: uom, no: uomNo, ex: uomEx, discription: uomDiscription, type: 0 },
            };
        }
        const uomxList = retUomX.map(v => {
            const uomX: UomX = { ...v };
            return uomX;
        });
        return {
            uomI,
            uomxList,
        }
    });

    async function onDel() {
        let message = '真的要删除这个计量单位吗？';
        let ret = await openModal(<PageConfirm header="确认" message={message} yes="删除" no="不删除" />);
        if (ret === true) {
            await uq.DelAtom.submit({ id: idValue });
            let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
            if (data) {
                data.removeItem<{ id: number; }>(v => v.id === idValue) as any;
            }
            navigate(-1);
        }
    }
    const right = <ButtonRight color="outline-info" onClick={onDel}>
        <FA name="trash" />
    </ButtonRight>;

    return <Page header={caption} right={right}>
        {uomI === undefined ?
            <div className="p-3">unknown UomI</div>
            :
            <UomI uomI={uomI} />
        }
        <UomXList uomI={uomI} uomxList={uomxList} />
    </Page>;
}

function UomI({ uomI }: { uomI: UomI; }) {
    const { openModal } = useModal();
    const { ex, discription, uom, ratio } = uomI;
    function onEdit() {
        openModal(<PageUomIView id={uomI.id} />);
    }
    return <LMR className="ps-3">
        <div className="py-3">
            <div>{discription}</div>
            <div>
                <b className="fs-larger me-3">{ex}</b>
                <span>{ratio}{uom.ex}</span>
            </div>
        </div>
        <div className="p-3 cursor-pointer" onClick={onEdit}>
            <FA name="pencil-square-o" className="text-info" />
        </div>
    </LMR>
}

function PageUomIView({ id }: { id: number; }) {
    const { page } = useBizAtomViewFromId({ ...options, id });
    return page;
}

function UomXList({ uomI, uomxList: uomxListInit }: { uomI: UomI; uomxList: UomX[]; }) {
    const { uq } = useUqApp();
    const { openModal, closeModal } = useModal();
    const [uomxList, setUomxList] = useState<UomX[]>(uomxListInit);
    async function onAdd() {
        const retNo = await uq.IDNO({ ID: uq.Atom });
        const uomX: UomX = {
            no: retNo,
        } as any;
        const retRatio = await openModal(<PageUomXRatio uomX={uomX} />);
        await saveUomX(retRatio);
    }
    async function saveUomX(uomX: UomX) {
        if (uomX === undefined) return;
        const { no, ex, ratio } = uomX;
        let ret = await uq.SaveUomX.submit({
            i: uomI.id,
            no,
            ex,
            ratio,
        });
        if (uomX.id !== ret.id) {
            uomX.id = ret.id;
            uomxList.push(uomX);
        }
        else {
            let index = uomxList.findIndex(v => v.id === uomX.id);
            Object.assign(uomxList[index], uomX);
        }
        uomxList.sort((a, b) => {
            const { ratio: ra } = a;
            const { ratio: rb } = b;
            if (ra < rb) return -1;
            if (ra > rb) return 1;
            return 0;
        });
        setUomxList([...uomxList]);
    }
    function PageUomXRatio({ uomX }: { uomX: UomX; }) {
        const { register, handleSubmit, formState: { errors }, setError } = useForm({ mode: 'onBlur' });
        const { id } = uomX;
        function onSubmit(data: any) {
            const { ex } = data;
            let index = uomxList.findIndex(v => v.ex === ex);
            if (index >= 0) {
                let u = uomxList[index];
                if (u.id !== id) {
                    setError('ex', { message: '重复了' });
                    return;
                }
            }
            // data.no = NO;
            const ret = { ...uomX, ...data };
            closeModal(ret);
        }
        const formRows: FormRow[] = [
            { name: 'ex', label: '简称', type: 'text', options: { maxLength: 30, value: uomX.ex } },
            { name: 'ratio', label: '换算率', type: 'number', options: { required: true, valueAsNumber: true, value: uomX.ratio } },
            { type: 'submit' },
        ];
        async function onDel() {
            let message = '真的要删除这个换算单位吗？';
            let ret = await openModal(<PageConfirm header="确认" message={message} yes="删除" no="不删除" />);
            if (ret === true) {
                await uq.DelUomX.submit({ uomI: uomI.id, uomX: id });
                let index = uomxList.findIndex(v => v.id === id);
                if (index >= 0) {
                    let ret = uomxList.splice(index, 1);
                    setUomxList(ret);
                }
                closeModal();
            }
        }
        let right: any;
        if (id > 0) {
            right = <ButtonRight color="outline-info" onClick={onDel}>
                <FA name="trash" />
            </ButtonRight>;
        }
        return <Page header="换算率" right={right}>
            <Band>
                <div className="mt-3 small text-secondary">
                    <FA name="exclamation-circle" className="text-info me-3" />
                    相对{uomI.ex}的换算率
                </div>
            </Band>
            <form onSubmit={handleSubmit(onSubmit)} className="container my-3 pe-5">
                <FormRowsView rows={formRows} {...{ register, errors }} />
            </form>
        </Page>;
    }
    function ViewUomxRow(props: { value: UomX; index?: number; }) {
        const { value, index } = props;
        let prevEx: string, prevRatio: number;
        if (index === 0) {
            prevEx = uomI.ex;
            prevRatio = 1;
        }
        else {
            let { ex, ratio } = uomxList[index - 1];
            prevEx = ex;
            prevRatio = ratio;
        };
        const { no, ratio, ex } = value;
        const r = ratio / prevRatio;
        const rText = Number.isInteger(r) === true ? r : r.toFixed(2);
        async function onEdit() {
            let ret = await openModal(<PageUomXRatio uomX={value} />);
            if (ret === undefined) return;
            await saveUomX(ret);
        }
        return <LMR className="ps-3">
            <div className="py-2 w-min-12c">1 <b className="fs-larger">{ex}</b></div>
            <div className="py-2"> = {rText} {prevEx}</div>
            <div className="px-3 py-2 cursor-pointer" onClick={onEdit}>
                <FA name="angle-right" />
            </div>
        </LMR>;
    }
    return <div>
        <ViewListHeader caption="换算单位" onAdd={onAdd} />
        <List items={uomxList} ViewItem={ViewUomxRow} itemKey={v => v.ex} />
    </div>
}