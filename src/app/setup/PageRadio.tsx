import { useForm } from "react-hook-form";
import { ChangeEvent, useState } from "react";
import { IDView, Page, useModal } from "tonwa-app";
import { ButtonAsync, ButtonSubmit, FA, List, LMR } from "tonwa-com";
// import { PropDataType } from "uqs/UqDefault";
import { Band } from "app/coms";
import { useGen } from "../tool";
import { NextRight, NextTop } from "./NextTop";
import { PageNextProps, RadioItem } from "./types";
import { GenProp } from "./GenProp";

export function PageRadio(props: PageNextProps) {
    const { openModal } = useModal();
    const gen = useGen(GenProp);
    let { id: propId, type } = props;
    let header = undefined as string; // type === PropDataType.radio ? '单选' : '多选';
    let [items, setItems] = useState(props.items ?? []);
    function ViewRadio({ value: { name, caption } }: { value: RadioItem; }) {
        return <LMR className="px-3 py-2 align-items-center">
            <div>
                <b>{name}</b> &nbsp;
                <small className="text-muted">{caption}</small>
            </div>
            <FA name="angle-right" />
        </LMR>
    }
    function ViewItem({ value }: { value: RadioItem; }) {
        let { id, name, caption } = value;
        if (name === undefined) {
            return <IDView uq={gen.uq} id={id} Template={ViewRadio} />;
        }
        return <ViewRadio value={value} />;
    }
    async function onAdd() {
        let ret = await openModal(<PageEditItem id={propId} name={undefined} caption={undefined} />);
        setItems([...items, ret]);
    }
    async function onEditItem(item: RadioItem) {
        let ret = await openModal(<PageEditItem {...item} id={propId} />);
        Object.assign(item, ret);
        setItems([...items]);
    }
    return <Page header={'属性 - ' + header} right={<NextRight />}>
        <NextTop {...props} />
        <div className="border-top border-bottom" >
            <List className=""
                items={items}
                none={<div className="m-3 small text-muted">(请加可选项)</div>}
                ViewItem={ViewItem}
                onItemClick={onEditItem} />
        </div>
        <div>
            <ButtonAsync className="m-3 btn btn-primary d-inline" onClick={onAdd}>
                <FA name="plus" className="me-2" />
                可选项
            </ButtonAsync>
        </div>
    </Page>;
}

function PageEditItem({ id, name, caption }: { id: number; name: string; caption?: string; }) {
    const gen = useGen(GenProp);
    const { openModal, closeModal } = useModal();
    const [submitable, setSubmitable] = useState(name !== undefined);
    const [submiting, setSubmiting] = useState(false);
    const { register, handleSubmit, getValues } = useForm();
    function onNameChange(evt: ChangeEvent<HTMLInputElement>) {
        setSubmitable(evt.target.value.trim().length > 0);
    }
    async function onSubmit(data: any) {
        setSubmiting(true);
        let radioItemId = await gen.setRadioItem(id, data);
        setSubmiting(false);
        closeModal({ id: radioItemId, name: data.name, caption: data.caption });
    }
    return <Page header="可选项">
        <form className="container my-3" onSubmit={handleSubmit(onSubmit)}>
            <Band label={'名称'} labelClassName="text-end">
                <input className="form-control" {...register('name', { maxLength: 50, onChange: onNameChange, value: name })} />
            </Band>
            <Band label={'标提'} labelClassName="text-end">
                <input className="form-control" {...register('caption', { maxLength: 100, value: caption })} />
            </Band>
            <Band>
                <ButtonSubmit isSubmiting={submiting} className="btn btn-primary" disabled={!submitable}>
                    提交
                </ButtonSubmit>
            </Band>
        </form>
    </Page>;
}
