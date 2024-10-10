import * as jsonpack from 'jsonpack';
import { useForm } from "react-hook-form";
import { Biz, Entity, EntityAtom, EntityID, EntityQuery } from "app/Biz";
import { UqApp, useUqApp } from "app/UqApp";
import { UseQueryOptions } from "app/tool";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { Modal, Page, useModal } from "tonwa-app";
import { theme, wait } from "tonwa-com";
import { FA, getAtomValue, setAtomValue, useEffectOnce } from 'tonwa-com';
import { Grammar, highlight } from "prismjs";
import './code-editor-style.css'
import Editor from 'react-simple-code-editor';
import { editorStyle, uqGrammar } from './grammar';
import { FormRow, FormRowsView, Band, ToolItem, Toolbar, ToolButton } from 'app/coms';
import { atom, useAtomValue, WritableAtom } from 'jotai';
import { BizPhraseType, UqExt } from 'uqs/UqDefault';
import { adminData } from '../adminData';

class Nav {
    readonly supers: Entity[] = [];
    cur: Entity;
    readonly subs: Entity[] = [];
    private readonly atomChanged = atom(false);
    private readonly onChange: (newEntity: Entity) => void;
    constructor(entity: Entity, onChange: (newEntity: Entity) => void) {
        this.cur = entity;
        this.onChange = onChange;
        this.setSubs(entity);
    }
    private setSubs(entity: Entity) {
        this.subs.splice(0);
        let entitySet: Set<Entity> = new Set();
        entity.getRefEntities(entitySet);
        this.subs.push(...Array.from(entitySet));
    }
    private setCur(entity: Entity) {
        if (entity === this.cur) return;
        let index = this.supers.findIndex(v => v === entity);
        if (index >= 0) {
            this.supers.splice(index);
        }
        else {
            index = this.subs.findIndex(v => v === entity);
            if (index < 0) return;
            this.supers.push(this.cur);
        }
        this.cur = entity;
        this.setSubs(entity);
        let changed = getAtomValue(this.atomChanged);
        setAtomValue(this.atomChanged, !changed);
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
            useAtomValue(this.atomChanged);
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

const codeWaiting = '...';
class EntityStore {
    readonly uqApp: UqApp;
    readonly uq: UqExt;
    readonly biz: Biz;
    readonly modal: Modal;
    readonly atomEntity: WritableAtom<Entity, any, any>;
    readonly atomCode = atom(codeWaiting);
    readonly atomDeleted = atom(false);
    readonly nav: Nav;

    constructor(uqApp: UqApp, modal: Modal, entity: Entity) {
        this.uqApp = uqApp;
        this.uq = entity.uq;
        this.biz = entity.biz;
        this.modal = modal;
        this.atomEntity = atom(entity);
        this.nav = new Nav(entity, this.onEntityChange);
    }

    private readonly onSubmit = async () => {
        let entity = getAtomValue(this.atomEntity);
        let code = getAtomValue(this.atomCode);
        this.modal.open(<PageLogs entity={entity} code={code} />);
        this.setSubmitDisabled(true);
    }

    get entity() {
        let entity = getAtomValue(this.atomEntity);
        return entity;
    }

    readonly toolButtonSubmit = new ToolButton({
        caption: '提交',
        icon: 'send-o',
        className: 'btn btn-primary'
    }, this.onSubmit, true);

    async loadCode() {
        this.setSubmitDisabled(true);
        setAtomValue(this.atomCode, codeWaiting);
        let entity = getAtomValue(this.atomEntity);
        let { ret } = await this.uq.GetEntityCode.query({ id: entity.id });
        let data = ret[0];
        setAtomValue(this.atomCode, data.code);
        this.setSubmitDisabled(false);
        // return data;
    }

    setSubmitDisabled(disabled: boolean) {
        setAtomValue(this.toolButtonSubmit.atomDisabled, disabled);
    }

    onDeleted = async () => {
        let ret = await this.uqApp.uqMan.uqApi.delEntity(this.entity.id);
        this.modal.close(ret);
    }

    onEntityChange = async (newEntity: Entity) => {
        setAtomValue(this.atomEntity, newEntity);
        await this.loadCode();
    }

    onCodeChange = (code: string) => {
        setAtomValue(this.atomCode, code);
        this.setSubmitDisabled(false);
    }

    deleteEntity() {
        setAtomValue(this.atomDeleted, true);
        this.biz.delEntity(this.entity);
    }
}
export function PageEntity({ entity: orgEntity }: { entity: Entity }) {
    const uqApp = useUqApp();
    // const { uq, uqMan, biz } = uqApp;
    // const { uqApi } = uqMan;
    const modal = useModal();
    // const [entity, setEntity] = useState(orgEntity);
    // const { id, caption, name } = entity;
    const { current: store } = useRef(new EntityStore(uqApp, modal, orgEntity));
    const { atomEntity, atomCode, atomDeleted } = store;
    const entity = useAtomValue(atomEntity);
    const code = useAtomValue(atomCode);
    const deleted = useAtomValue(atomDeleted);
    /*
    const { current: toolButtonSubmit } = useRef(new ToolButton({
        caption: '提交',
        icon: 'send-o',
        className: 'btn btn-primary'
    }, onSubmit, true));
    const [code, setCode] = useState(codeWaiting);
    function setSumitDisabled(disabled: boolean) {
        setAtomValue(toolButtonSubmit.atomDisabled, disabled);
    }
    const query = useCallback(async (id: number) => {
        setSumitDisabled(true);
        setCode(codeWaiting);
        let { ret } = await uq.GetEntityCode.query({ id });
        let data = ret[0];
        setCode(data.code);
        setSumitDisabled(false);
        return data;
    }, [id]);
    */

    useEffectOnce(() => {
        // query(id);
        store.loadCode();
    });
    /*
    const { data } = useQuery([id], async () => {
        let ret = await query(id);
        // await wait(5000);
        // setAtomValue(toolButtonSubmit.atomDisabled, false);
        // let code = ret?.code ?? '';
        // setCode(code);
        if (ret === undefined || ret.code === undefined) {
            console.error('no ret in useQuery');
        }
        else {
            setCode(ret.code);
        }
        return ret;
    }, UseQueryOptions);
    */
    // const nav = useMemo(() => new Nav(orgEntity, onEntityChange), [orgEntity]);
    // const [pageCaption, setPageCaption] = useState(caption ?? name);
    // const [submitDisabled, setSumitDisabled] = useState(true);
    // const [deleted, setDeleted] = useState(false);
    if (code === undefined) {
        return <Page header="错误">
            <div className="p-3">
                没有能够拿到{entity.name}的code
            </div>
        </Page>;
    }
    /*
    async function onEntityChange(newEntity: Entity) {
        setEntity(newEntity);
        await query(newEntity.id);
    }
    function onCodeChange(code: string) {
        setCode(code);
        setSumitDisabled(false);
    }
    async function onSubmit() {
        modal.open(<PageLogs entity={entity} code={code} />);
        let newEntity = biz.entityFromId(entity.id);
        setPageCaption(newEntity.caption ?? newEntity.name);
        setSumitDisabled(true);
    }
    */
    function myHighlight(text: string, grammar: Grammar, language: string): string {
        let ret = highlight(text, grammar, language);
        return ret;
    }
    async function onRename() {
        function PageChangeName() {
            const { name } = store.entity;
            const { register, handleSubmit, setError, formState: { errors } } = useForm({ mode: 'onBlur' });
            const onSubmitForm = async (data: any) => {
                alert('改名有问题，以后再实现');
                return;
            }
            let formRows: FormRow[] = [
                { name: 'name', label: '新名字', type: 'text', options: { maxLength: 150 } },
                { type: 'submit', label: '提交' }
            ];
            return <Page header="改名">
                <div className={theme.bootstrapContainer + ' border-bottom tonwa-bg-gray-2 '}>
                    <div className="m-3 mb-0">
                        <Band label={'名字'}>
                            <div className="mx-1 fw-bold">{name}</div>
                        </Band>
                    </div>
                </div>
                <div className="m-3">
                    <form className={theme.bootstrapContainer} onSubmit={handleSubmit(onSubmitForm)}>
                        <FormRowsView rows={formRows} register={register} errors={errors} context={undefined} />
                    </form>
                </div>
            </Page>;
        }
        if (await modal.open(<PageChangeName />) === true) {
            // let { ret } = await uq.GetEntityCode.query({ id });
            // setCode(ret[0]?.code);
        }
    }
    async function onDel() {
        function PageDel() {
            /*
            async function onDeleted() {
                let ret = await uqApi.delEntity(id);
                modal.close(ret);
            }
            */
            return <Page header={`删除 - ${entity.name}`}>
                <div className='p-3'>
                    <button className="btn btn-primary" onClick={store.onDeleted}>确定删除</button>
                </div>
            </Page>;
        }
        let { hasError, logs } = await modal.open(<PageDel />);
        let msg: string;
        if (hasError === true) {
            msg = logs === undefined ? '删除出错' : logs.join('\n');
        }
        else {
            // setDeleted(true);
            // setAtomValue(store.atomDeleted, true);
            // biz.delEntity(entity);
            store.deleteEntity();
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
    const groups: ToolItem[][] = [
        [store.toolButtonSubmit],
        null,
        [
            adminData(modal, entity),
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
        {store.nav.showView()}
        {deleted === false && <Toolbar groups={groups} />}
    </div>;
    return <Page header={entity.caption} hideScroll={true} top={top}>
        <div className="d-flex flex-column">
            <div className="border-info rounded flex-grow-1">
                <div className="container_editor_area w-100">
                    <Editor className="container__editor"
                        autoFocus={true}
                        spellCheck={false}
                        value={code}
                        onValueChange={store.onCodeChange}
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
    const uniques = entity.getUniques();
    if (uniques === undefined) return;
    return [[new ToolButton({ caption: '对照表', }, onMap),]];
    function onMap() {
        modal.open(<PageUnique entity={entity} />);
    }
}

function PageUnique({ entity }: { entity: EntityAtom; }) {
    const { uq } = useUqApp();
    const [doing, setDoing] = useState(false);
    const [done, setDone] = useState(false);
    const { current: atomJob } = useRef(atom({ count: 0, dup: [] as any[] }));
    const { count, dup } = useAtomValue(atomJob);
    const build = useCallback(async () => {
        async function iterate(ent: EntityID, callback: (e: EntityID) => Promise<void>) {
            await callback(ent);
            for (let sub of ent.subClasses) {
                await iterate(sub, callback);
            }
        }
        await iterate(entity, async (e) => {
            for (let start = 0; ;) {
                const results = await uq.BuildAtomUnique.submitReturns({ phrase: e.id, start, batchNumber: 1 });
                const { ret: [{ batchDone, lastId }], DupTable } = results;
                if (batchDone === 0) break;
                const { count, dup } = getAtomValue(atomJob);
                setAtomValue(atomJob, {
                    count: count + batchDone,
                    dup: [...dup, ...DupTable],
                });
                start = lastId;
            }
        });
    }, []);

    const onBuildMap = async () => {
        setDoing(true);
        await build();
        setDone(true);
    };
    return <Page header="对照表生成">
        <div className="tonwa-bg-gray-2 p-3">
            对照表用于对接数据
        </div>
        {
            done === false ?
                <div className="p-3">
                    {
                        doing === true ?
                            <>
                                <FA name="spinner" className="me-3 text-info" spin={true} />
                                生成 {count} 项
                            </>
                            :
                            <button className="btn btn-outline-primary" onClick={onBuildMap}>生成对照表</button>
                    }
                </div>
                :
                <div className="p-3 text-success">
                    <FA name="check-circle-o" className="me-3" size="lg" />
                    共{count}项全部完成
                </div>
        }
        {dup.length > 0 && <div className="py-3">
            <div className="px-3 tonwa-bg-gray-1 small py-2 border-bottom">问题列表</div>
            <div className="px-3 py-3">
                {JSON.stringify(dup)}
            </div>
        </div>}
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
                msg += '.'
                setAtomValue(atomLogs, msg);
                intervals += 1;
                if (intervals > 5) {
                    setAtomValue(atomLogs, 'Overtime! 5 seconds');
                    clearInterval(interval);
                    interval = undefined;
                }
            }, 1000);
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
