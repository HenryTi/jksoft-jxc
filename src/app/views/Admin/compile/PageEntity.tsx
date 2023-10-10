import * as jsonpack from 'jsonpack';
import { useForm } from "react-hook-form";
import { Entity } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { UseQueryOptions } from "app/tool";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { Page, useModal } from "tonwa-app";
import { ButtonAsync, getAtomValue, setAtomValue } from 'tonwa-com';
import { Grammar, highlight } from "prismjs";
import './code-editor-style.css'
import Editor from 'react-simple-code-editor';
import { uqGrammar } from './grammar';
import { FormRow, FormRowsView, Band } from 'app/coms';

export function PageEntity({ entity }: { entity: Entity }) {
    const uqApp = useUqApp();
    const { uq, uqMan, biz } = uqApp;
    const { uqApi } = uqMan;
    const { openModal, closeModal } = useModal();
    const { id, caption, name } = entity;
    const { data } = useQuery([id], async () => {
        let { ret } = await uq.GetEntityCode.query({ id });
        return ret[0];
    }, UseQueryOptions);
    const refTextAreaLog = useRef<HTMLTextAreaElement>();
    const refContainerEditorArea = useRef<HTMLDivElement>();
    const interval = useRef<NodeJS.Timer>();
    const [pageCaption, setPageCaption] = useState(caption ?? name);
    useEffect(() => {
        let { current: div } = refContainerEditorArea;
        if (div === undefined) return;
        div.style.maxHeight = div.parentElement.clientHeight + 'px';
    });

    const { code: codeInit, schema } = data ?? {};
    const [code, setCode] = useState(codeInit);
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
        let { schemas, hasError } = await uqApi.compileEntity(id, code);
        let ret: string;
        if (hasError === true) {
            ret = '不能改实体名，也不能新增实体';
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
        let newEntity = biz.entityIds[entity.id];
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
