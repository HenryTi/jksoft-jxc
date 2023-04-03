import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { IDView, Page, useModal } from "tonwa-app";
import { ButtonSubmit, FA, List, LMR, Sep, useEffectOnce } from "tonwa-com";
import { Band } from "app/coms";
import { ChangeEvent, useState } from "react";
import { useGen } from "../tool";
import { arrType, collPropDataType, TypeItem } from "./types";
import { GenProp } from "./GenProp";

export function PagePropEdit() {
    const gen = useGen(GenProp);
    const { openModal } = useModal();
    const { prop } = useParams();
    const [arr, setArr] = useState<any[]>(undefined);
    useEffectOnce(() => {
        (async function () {
            let ret = await gen.loadIDProps(prop);
            setArr(ret);
        })();
    });
    function ViewItemProp({ value }: { value: { id: number; items: { id: number }[] }; }) {
        let { id, items } = value;
        function ViewProp({ value }: { value: any/*Prop*/ & { $removed: boolean; }; }) {
            const { id, name, ex, type, $removed } = value;
            const { caption: typeCaption, PageNext, memo } = collPropDataType[type as any /*PropDataType*/];
            function onAct() {
                if (PageNext !== undefined) {
                    openModal(<PageNext id={id} name={name} caption={ex} type={type} items={items as any} />);
                }
                else {
                    value.$removed = ($removed !== true);
                    setArr([...arr]);
                }
            }
            let icon: string, cnIcon: string, lineThrough: string = '', fw = ' fw-bold';
            if ($removed === true) {
                icon = 'undo';
                cnIcon = 'text-muted';
                lineThrough = ' text-decoration-line-through text-muted';
                fw = '';
            }
            else if (PageNext !== undefined) {
                icon = 'angle-right';
                cnIcon = 'text-secondary';
            }
            else {
                icon = 'trash';
                cnIcon = 'text-info';
            }
            return <div className="ps-3 py-2">
                <div className="d-flex">
                    <div className={'flex-fill me-3 ' + lineThrough}>
                        <div className="mb-1 d-flex">
                            <span className={'w-min-8c me-3' + fw}>{name}</span>
                            <small className={'text-muted'}>{ex}</small>
                        </div>
                        <LMR>
                            <span>{typeCaption}</span>
                            <small className="text-muted">{memo}</small>
                        </LMR>
                    </div>
                    <div className="d-flex align-items-center ps-3 pe-3 cursor-pointer" onClick={onAct}>
                        <FA name={icon} fixWidth={true} className={cnIcon} />
                    </div>
                </div>
            </div>;
        }
        return <IDView uq={gen.uq} id={id} Template={ViewProp} />;
    }
    async function onAdd() {
        let ret = await openModal(<PagePropNew IDName={prop} />);
        if (!ret) return;
        let propTypeId = await gen.loadIDPropId(prop);
        let newId = ret;
        setArr([...arr, { ix: propTypeId, xi: newId }]);
    }
    const right = <button className="btn btn-sm btn-success me-2" onClick={onAdd}>
        <FA name="plus" />
    </button>;
    const caption = 'collIDCustom[prop as EnumID].caption';
    return <Page header={caption + '属性编辑'} right={right}>
        {
            arr && arr.length > 0 && <>
                <List items={arr} ViewItem={ViewItemProp} />
                <Sep />
            </>
        }
    </Page>;
}

function PagePropNew({ IDName }: { IDName: string; }) {
    const gen = useGen(GenProp);
    const { openModal, closeModal } = useModal();
    const { register, handleSubmit, getValues } = useForm();
    const [type, setType] = useState<TypeItem>(undefined);
    const [submitable, setSubmitable] = useState(false);
    const [submiting, setSubmiting] = useState(false);
    async function onSubmit(data: any) {
        /*
        setSubmiting(true);
        let { PageNext } = type;
        let [ret] = await gen.saveIxIDProp(IDName, data);
        if (PageNext !== undefined) {
            await openModal(<PageNext id={ret} name={data.name} caption={data.caption} type={type.type} />);
        }
        else {
        }
        setSubmiting(false);
        closeModal(ret);
        */
    }
    function onChange(evt: ChangeEvent<HTMLInputElement>) {
        let value = Number(evt.target.value) as any /* PropDataType */;
        let type = collPropDataType[value];
        setType(type);
        let name = getValues('name');
        setSubmitable(name.trim().length > 0 && type !== undefined);
    }
    function onNameChange(evt: ChangeEvent<HTMLInputElement>) {
        setSubmitable(evt.target.value.trim().length > 0 && type !== undefined);
    }
    let viewMemo: any, contentSubmit = '提交';
    if (type !== undefined) {
        const { PageNext, memo } = type;
        if (memo !== undefined) {
            viewMemo = <div className="mt-1 mb-2 py-2 px-2 text-muted small">说明：{memo}</div>;
        }
        if (PageNext !== undefined) contentSubmit = '下一步';
    }
    return <Page header="新增属性">
        <form className="container my-3" onSubmit={handleSubmit(onSubmit)}>
            <Band label={'名称'} labelClassName="text-end">
                <input className="form-control" {...register('name', { maxLength: 50, onChange: onNameChange })} />
            </Band>
            <Band label={'标识'} labelClassName="text-end">
                <input className="form-control" {...register('caption', { maxLength: 100 })} />
            </Band>
            <Band label="类型" labelClassName="text-end">
                <select className="form-select" {...register('type', { onChange })} defaultValue={'$'}>
                    <option disabled={true} value={'$'}>请选择数据类型</option>
                    {arrType.map(v => {
                        const { caption } = collPropDataType[v];
                        return <option key={v} className="me-3 w-min-8c mb-2 py-3" value={v}>
                            {caption}
                        </option>;
                    })}
                </select>
                {viewMemo}
            </Band>
            <Band>
                <ButtonSubmit isSubmiting={submiting} className="btn btn-primary" disabled={!submitable}>
                    {contentSubmit}
                </ButtonSubmit>
            </Band>
        </form>
    </Page>;
}
