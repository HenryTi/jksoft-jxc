import * as jsonpack from 'jsonpack';
import { useForm } from "react-hook-form";
import { Entity } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { UseQueryOptions } from "app/tool";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { Page, useModal } from "tonwa-app";
import { ButtonAsync, FA, Spinner, getAtomValue, setAtomValue } from 'tonwa-com';
import { Grammar, highlight } from "prismjs";
import './code-editor-style.css'
import Editor from 'react-simple-code-editor';
import { uqGrammar } from './grammar';
import { FormRow, FormRowsView, Band } from 'app/coms';
import { atom, useAtomValue } from 'jotai';

class Nav {
    readonly supers: Entity[] = [];
    cur: Entity;
    subs: Entity[];
    changed = atom(false);
    private readonly onChange: (newEntity: Entity) => void;
    constructor(entity: Entity, onChange: (newEntity: Entity) => void) {
        this.cur = entity;
        this.onChange = onChange;
        this.subs = entity.getSubClasses();
    }
    showView() {
        const View = () => {
            if (this.subs === undefined) return null;
            const setCur = (entity: Entity) => {
                if (entity === this.cur) return;
                let index = this.supers.findIndex(v => v === entity);
                if (index >= 0) {
                    this.supers.splice(index);
                    this.cur = entity;
                    this.subs = entity.getSubClasses();
                }
                else {
                    index = this.subs.findIndex(v => v === entity);
                    if (index < 0) return;
                    this.supers.push(this.cur);
                    this.cur = entity;
                    this.subs = entity.getSubClasses();
                }
                let changed = getAtomValue(this.changed);
                setAtomValue(this.changed, !changed);
                this.onChange(entity);
            }
            useAtomValue(this.changed);
            function VClick({ entity }: { entity: Entity }) {
                const { caption, name } = entity;
                const onClick = () => setCur(entity);
                return <div className="px-3 py-2 cursor-pointer text-primary" onClick={onClick}>{caption ?? name}</div>
            }
            function VSuper({ entity }: { entity: Entity; }) {
                return <>
                    <VClick entity={entity} />
                    <FA name="angle-right" className="" />
                </>;
            }
            const VCur = () => {
                const { caption, name } = this.cur;
                let vRightAngle: any;
                if (this.subs.length > 0) vRightAngle = <FA name="angle-right" className="" />;
                return <>
                    <div className="fw-bold mx-3">{caption ?? name}</div>
                    {vRightAngle}
                </>;
            }
            return <div className="tonwa-bg-gray-3 d-flex flex-wrap align-items-center">
                {this.supers.map(v => <VSuper key={v.id} entity={v} />)}
                <VCur />
                {this.subs.map((v, index) => {
                    let vSep: any;
                    if (index > 0) vSep = <small className="text-seconday">|</small>;
                    return <React.Fragment key={v.id}>
                        {vSep}
                        <VClick entity={v} />
                    </React.Fragment>;
                })}
            </div>
        }
        return <View />;
    }
}

export function PageEntity({ entity: orgEntity }: { entity: Entity }) {
    const uqApp = useUqApp();
    const { uq, uqMan, biz } = uqApp;
    const { uqApi } = uqMan;
    const { openModal, closeModal } = useModal();
    const [entity, setEntity] = useState(orgEntity);
    const { id, caption, name } = entity;
    const query = useCallback(async (id: number) => {
        let { ret } = await uq.GetEntityCode.query({ id });
        let data = ret[0];
        return data;
    }, [])
    const { data } = useQuery([id], async () => {
        return await query(id);
    }, UseQueryOptions);
    const [code, setCode] = useState(data?.code);
    const nav = useMemo(() => new Nav(orgEntity, onEntityChange), [orgEntity]);
    const refTextAreaLog = useRef<HTMLTextAreaElement>();
    const refContainerEditorArea = useRef<HTMLDivElement>();
    const interval = useRef<NodeJS.Timer>();
    const [pageCaption, setPageCaption] = useState(caption ?? name);
    useEffect(() => {
        let { current: div } = refContainerEditorArea;
        if (div === undefined) return;
        div.style.maxHeight = div.parentElement.clientHeight + 'px';
    });

    // const { code: codeInit, schema } = data ?? {};
    const [readOnly, setReadOnly] = useState(false);
    const [submitDisabled, setSumitDisabled] = useState(true);
    const [deleted, setDeleted] = useState(false);
    if (data === undefined) {
        return <Page header="错误">
            <div className="p-3">
                没有能够拿到{entity.name}的code
            </div>
        </Page>;
    }
    async function onEntityChange(newEntity: Entity) {
        setEntity(newEntity);
        setCode(null);
        let data = await query(newEntity.id);
        setCode(data.code);
    }
    function onCodeChange(code: string) {
        setCode(code);
        setSumitDisabled(false);
    }
    async function onSubmit() {
        const { current: textAreaLog } = refTextAreaLog;
        let intervals = 0;
        interval.current = setInterval(() => {
            textAreaLog.value += '.';
            intervals += 1;
            if (intervals > 5) {
                textAreaLog.value = 'Overtime! 5 seconds';
                setReadOnly(false);
                clearInterval(interval.current);
                interval.current = undefined;
            }
        }, 1000);
        setReadOnly(true);
        textAreaLog.value = '......';
        let { schemas, hasError, logs } = await uqApi.compileEntity(id, code);
        let ret: string;
        if (hasError === true) {
            if (logs === undefined) logs = ['编译出现内部错误'];
            ret = (logs as string[]).join('\n');
        }
        else {
            let bizSchema = jsonpack.unpack(schemas);
            biz.buildEntities(bizSchema);
            ret = '提交成功!\n' + JSON.stringify(bizSchema, null, 4);
        }
        textAreaLog.value = ret;
        setReadOnly(false);
        clearInterval(interval.current);
        interval.current = undefined;
        let newEntity = biz.entityFromId(entity.id);
        setPageCaption(newEntity.caption ?? newEntity.name);
        setSumitDisabled(true);
    }
    function clearTimer() {
        if (interval.current !== undefined) {
            clearInterval(interval.current);
        }
    }
    function myHighlight(text: string, grammar: Grammar, language: string): string {
        let ret = highlight(text, grammar, language);
        return ret;
    }
    function btnClassName(c: string) {
        return 'btn btn-sm mx-2 my-1 ' + (c ?? '');
    }
    async function onRename() {
        function PageChangeName() {
            const { register, handleSubmit, setError, formState: { errors } } = useForm({ mode: 'onBlur' });
            const onSubmitForm = async (data: any) => {
                alert('改名有问题，以后再实现');
                return;
                let { name: newName } = data;
                let { hasError, logs } = await uqApi.renameEntity(id, newName);
                if (hasError === true) {
                    setError('name', { message: `重名，或者其它实体引用了${name}` }, { shouldFocus: true })
                }
                else {
                    closeModal(true);
                    entity.setName(newName);
                    setPageCaption(caption ?? newName);
                    biz.refresh();
                }
            }
            let formRows: FormRow[] = [
                { name: 'name', label: '新名字', type: 'text', options: { maxLength: 150 } },
                { type: 'submit', label: '提交' }
            ];
            return <Page header="改名">
                <div className="container border-bottom tonwa-bg-gray-2">
                    <div className="m-3 mb-0">
                        <Band label={'名字'}>
                            <div className="mx-1 fw-bold">{name}</div>
                        </Band>
                    </div>
                </div>
                <div className="m-3">
                    <form className="container" onSubmit={handleSubmit(onSubmitForm)}>
                        <FormRowsView rows={formRows} register={register} errors={errors} />
                    </form>
                </div>
            </Page>;
        }
        if (await openModal(<PageChangeName />) === true) {
            let { ret } = await uq.GetEntityCode.query({ id });
            setCode(ret[0]?.code);
        }
    }
    async function onDel() {
        function PageDel() {
            async function onDeleted() {
                let ret = await uqApi.delEntity(id);
                closeModal(ret);
            }
            return <Page header={`删除 - ${entity.name}`}>
                <div className='p-3'>
                    <button className="btn btn-primary" onClick={onDeleted}>确定删除</button>
                </div>
            </Page>;
        }
        let { hasError, logs } = await openModal(<PageDel />);
        if (hasError === true) {
            refTextAreaLog.current.value = logs === undefined ? '删除出错' : logs.join('\n');
        }
        else {
            setDeleted(true);
            biz.delEntity(entity);
            refTextAreaLog.current.value = '成功删除';
        }
    }
    let style: React.CSSProperties = {
        fontSize: 18,
        border: 'none', outline: 'none',
        overflowY: "visible",
        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
    };
    if (deleted === true) {
        style.textDecoration = 'line-through';
        style.color = 'lightgray';
    }
    return <Page header={pageCaption} onClosed={clearTimer} hideScroll={true}>
        <div className="d-flex flex-column" style={{ height: "calc(100% - 1em)" }}>
            {
                deleted === false &&
                <div className="text-secondary tonwa-bg-gray-2 d-flex align-items-center px-1 border-bottom">
                    <ButtonAsync overtime={5} className={btnClassName('btn-primary')}
                        disabled={submitDisabled}
                        onClick={onSubmit}>
                        提交
                    </ButtonAsync>
                    <div className="flex-grow-1"></div>
                    <button className={btnClassName('btn-outline-primary')} onClick={onRename}>改名</button>
                    <button className={btnClassName('btn-outline-primary')} onClick={onDel}>删除</button>
                </div>
            }
            {nav.showView()}
            <div className="border-info rounded flex-grow-1">
                <div ref={refContainerEditorArea} className="container_editor_area w-100">
                    <Editor className="container__editor"
                        autoFocus={true}
                        spellCheck={false}
                        readOnly={readOnly || deleted}
                        placeholder="Type some code…"
                        value={code}
                        onValueChange={onCodeChange}
                        highlight={(code) => myHighlight(code, uqGrammar, 'uq')}
                        padding={10}
                        tabSize={4}
                        style={style}
                    />
                </div>
            </div>
            <div className="border-top border-dark h-16c">
                <textarea ref={refTextAreaLog} spellCheck={false}
                    readOnly={true}
                    className="p-2 h-100 w-100 border-0"
                    style={{ border: 'none', outline: 'none', fontFamily: 'monospace', resize: 'none' }}
                />
            </div>
        </div>
    </Page>
}
