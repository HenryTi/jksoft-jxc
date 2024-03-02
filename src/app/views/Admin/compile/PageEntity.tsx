import * as jsonpack from 'jsonpack';
import { useForm } from "react-hook-form";
import { Entity, EntityAtom } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { UseQueryOptions } from "app/tool";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { Modal, Page, useModal } from "tonwa-app";
import { ButtonAsync, FA, Spinner, getAtomValue, setAtomValue, useEffectOnce } from 'tonwa-com';
import { Grammar, highlight } from "prismjs";
import './code-editor-style.css'
import Editor from 'react-simple-code-editor';
import { editorStyle, uqGrammar } from './grammar';
import { FormRow, FormRowsView, Band, ToolItem, Toolbar, ToolElement, ToolButton } from 'app/coms';
import { atom, useAtomValue } from 'jotai';
import { BizPhraseType } from 'uqs/UqDefault';

class Nav {
    readonly supers: Entity[] = [];
    cur: Entity;
    readonly subs: Entity[] = [];
    changed = atom(false);
    private readonly onChange: (newEntity: Entity) => void;
    constructor(entity: Entity, onChange: (newEntity: Entity) => void) {
        this.cur = entity;
        this.onChange = onChange;
        this.setSubs(entity);
    }
    private setSubs(entity: Entity) {
        this.subs.splice(0);
        let arr = entity.getRefEntities();
        if (arr === undefined) return;
        this.subs.push(...arr);
    }
    private setCur(entity: Entity) {
        if (entity === this.cur) return;
        let index = this.supers.findIndex(v => v === entity);
        if (index >= 0) {
            this.supers.splice(index);
            this.cur = entity;
        }
        else {
            index = this.subs.findIndex(v => v === entity);
            if (index < 0) return;
            this.supers.push(this.cur);
            this.cur = entity;
        }
        this.setSubs(entity);
        let changed = getAtomValue(this.changed);
        setAtomValue(this.changed, !changed);
        this.onChange(entity);
    }
    private VClick(entity: Entity) {
        const { caption, name } = entity;
        const onClick = () => this.setCur(entity);
        return <div className="px-3 py-2 cursor-pointer text-primary" onClick={onClick}>{caption ?? name}</div>
    }
    private VSuper(entity: Entity) {
        return <React.Fragment key={entity.id}>
            {this.VClick(entity)}
            <FA name="angle-right" className="" />
        </React.Fragment>;
    }
    private VCur() {
        const { caption, name } = this.cur;
        let vRightAngle: any;
        if (this.subs.length > 0) vRightAngle = <FA name="angle-right" className="" />;
        return <>
            <div className="fw-bold mx-3">{caption ?? name}</div>
            {vRightAngle}
        </>;
    }
    showView() {
        const View = () => {
            if (this.subs.length === 0 && this.supers.length === 0) return null;
            useAtomValue(this.changed);
            return <div className="d-flex flex-wrap align-items-center border-bottom border-primary-subtle">
                {this.supers.map(v => this.VSuper(v))}
                {this.VCur()}
                {this.subs.map((v, index) => {
                    let vSep: any;
                    if (index > 0) vSep = <small className="text-seconday">|</small>;
                    return <React.Fragment key={v.id}>
                        {vSep}
                        {this.VClick(v)}
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
    const modal = useModal();
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
    const [code, setCode] = useState(data?.code ?? '');
    const nav = useMemo(() => new Nav(orgEntity, onEntityChange), [orgEntity]);
    const [pageCaption, setPageCaption] = useState(caption ?? name);
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
        setCode('');
        let data = await query(newEntity.id);
        setCode(data.code ?? '');
    }
    function onCodeChange(code: string) {
        setCode(code);
        setSumitDisabled(false);
    }
    async function onSubmit() {
        // const { current: textAreaLog } = refTextAreaLog;
        modal.open(<PageLogs entity={entity} code={code} />);
        let newEntity = biz.entityFromId(entity.id);
        setPageCaption(newEntity.caption ?? newEntity.name);
        setSumitDisabled(true);
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
                    modal.close(true);
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
        if (await modal.open(<PageChangeName />) === true) {
            let { ret } = await uq.GetEntityCode.query({ id });
            setCode(ret[0]?.code);
        }
    }
    async function onDel() {
        function PageDel() {
            async function onDeleted() {
                let ret = await uqApi.delEntity(id);
                modal.close(ret);
            }
            return <Page header={`删除 - ${entity.name}`}>
                <div className='p-3'>
                    <button className="btn btn-primary" onClick={onDeleted}>确定删除</button>
                </div>
            </Page>;
        }
        let { hasError, logs } = await modal.open(<PageDel />);
        let msg: string;
        if (hasError === true) {
            // refTextAreaLog.current.value = logs === undefined ? '删除出错' : logs.join('\n');
            msg = logs === undefined ? '删除出错' : logs.join('\n');
        }
        else {
            setDeleted(true);
            biz.delEntity(entity);
            // refTextAreaLog.current.value = '成功删除';
            msg = '成功删除';
        }
        modal.open(<Page header="删除">
            <pre className="p-3">
                {msg}
            </pre>
        </Page>);
    }
    let style: React.CSSProperties = { ...editorStyle };
    if (deleted === true) {
        style.textDecoration = 'line-through';
        style.color = 'lightgray';
    }
    //const breadcrumb = new ToolElement(nav.showView());
    const groups: ToolItem[][] = [
        [
            new ToolButton({ caption: '提交', icon: 'send-o', className: 'btn btn-primary' }, onSubmit),
        ],
        null,
        [
            new ToolButton({ caption: '改名' }, onRename),
            new ToolButton({ caption: '删除' }, onDel),
        ]
    ];
    let ret = buildEntityButton(modal, entity);
    if (ret !== undefined) {
        let [r0, r1] = ret;
        if (r0 !== undefined) groups[0].push(...r0);
        if (r1 !== undefined) groups[2].push(...r1);
    }
    const top = <div>
        {nav.showView()}
        {deleted === false && <Toolbar groups={groups} />}
    </div>;
    return <Page header={pageCaption} hideScroll={true} top={top}>
        <div className="d-flex flex-column">
            <div className="border-info rounded flex-grow-1">
                <div className="container_editor_area w-100">
                    <Editor className="container__editor"
                        autoFocus={true}
                        spellCheck={false}
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
        </div>
    </Page>
}

function buildEntityButton(modal: Modal, entity: Entity): ToolItem[][] {
    switch (entity.bizPhraseType) {
        default: return;
        case BizPhraseType.atom: return buildAtomButton(modal, entity as EntityAtom);
    }
}

function buildAtomButton(modal: Modal, entity: EntityAtom): ToolItem[][] {
    const { uniques } = entity;
    if (uniques === undefined) return;
    return [[new ToolButton({ caption: '对照表', }, onMap),]];
    function onMap() {
        modal.open(<PageUniques entity={entity} />);
    }
}

function PageUniques({ entity }: { entity: EntityAtom; }) {
    const { uniques } = entity;
    return <Page header="对照表生成">
        <div className="tonwa-bg-gray-2 p-3">对照表用于对接数据</div>
        {uniques.map(v => {
            function onBuildMap() {
                alert(v);
            }
            return <div key={v} className="p-3 border-bottom">
                <button className="btn btn-outline-primary" onClick={onBuildMap}>生成{v}对照表</button>
            </div>
        })}
    </Page>;
}

function PageLogs({ entity, code }: { entity: Entity, code: string; }) {
    const uqApp = useUqApp();
    const { uq, uqMan, biz } = uqApp;
    const { uqApi } = uqMan;
    const atomLogs = useMemo(() => atom(''), []);
    const refInterval = useRef<number>();
    const { id, caption, name } = entity;
    useEffectOnce(() => {
        (async () => {
            let intervals = 0;
            let msg = '...';
            setAtomValue(atomLogs, msg);
            let interval = refInterval.current = setInterval(() => {
                // textAreaLog.value += '.';
                msg += '.'
                setAtomValue(atomLogs, msg);
                intervals += 1;
                if (intervals > 5) {
                    // textAreaLog.value = 'Overtime! 5 seconds';
                    setAtomValue(atomLogs, 'Overtime! 5 seconds');
                    clearInterval(interval);
                    interval = undefined;
                }
            }, 1000);
            // textAreaLog.value = '......';
            let { schemas, hasError, logs } = await uqApi.compileEntity(id, code);
            let ret: string;
            if (hasError === true) {
                if (logs === undefined) logs = ['编译出现内部错误'];
                ret = (logs as string[]).join('\n');
            }
            else {
                let bizSchema = jsonpack.unpack(schemas);
                biz.buildEntities(bizSchema);
                ret = '编译成功!\n' + JSON.stringify(bizSchema, null, 4);
            }
            //textAreaLog.value = ret;
            setAtomValue(atomLogs, ret);
            clearInterval(interval);
            interval = undefined;
        })();
    });
    const clearTimer = useCallback(() => {
        if (refInterval.current !== undefined) {
            clearInterval(refInterval.current);
        }
    }, []);
    let logs = useAtomValue(atomLogs);
    return <Page header={`编译 - ${caption ?? name}`} onClosed={clearTimer}>
        <pre spellCheck={false}
            className="p-2 w-100 border-0"
            style={{ fontFamily: 'monospace' }}>
            {logs}
        </pre>
    </Page>
}
