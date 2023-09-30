import * as jsonpack from 'jsonpack';
import { Entity } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { UseQueryOptions } from "app/tool";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { Page } from "tonwa-app";
import { ButtonAsync } from 'tonwa-com';

export function PageEntity({ entity }: { entity: Entity }) {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    const { id, caption, name } = entity;
    const { data } = useQuery([id], async () => {
        let { ret } = await uq.GetEntityCode.query({ id });
        return ret[0];
    }, UseQueryOptions);
    const refTextArea = useRef<HTMLTextAreaElement>();
    const refTextAreaLog = useRef<HTMLTextAreaElement>();
    const interval = useRef<NodeJS.Timer>();
    const [pageCaption, setPageCaption] = useState(caption ?? name);
    useEffect(() => {
        refTextArea.current.focus();
    });
    const { code, schema } = data;
    async function onSubmit() {
        const { uqMan, biz } = uqApp;
        let { uqApi } = uqMan;
        const { current: textArea } = refTextArea;
        const { current: textAreaLog } = refTextAreaLog;
        interval.current = setInterval(() => {
            textAreaLog.value += '.';
        }, 1000);
        textArea.readOnly = true;
        textAreaLog.value = '......';
        let { value: code } = textArea;
        let { schemas, logs, hasError } = await uqApi.compileEntity(id, code);
        let ret: string;
        if (hasError === true) {
            let text: string[] = [];
            (logs as string[]).forEach(v => {
                if (v === null) return;
                text.push(...v.split('\n'));
            });
            ret = text.join('\n');
        }
        else {
            let bizSchema = jsonpack.unpack(schemas);
            biz.buildEntities(bizSchema);
            ret = '提交成功!\n' + JSON.stringify(bizSchema, null, 4);
        }
        textAreaLog.value = ret;
        textArea.readOnly = false;
        clearInterval(interval.current);
        interval.current = undefined;
        let newEntity = biz.entityIds[entity.id];
        setPageCaption(newEntity.caption ?? newEntity.name);
    }
    function onTabKeyDown(evt: KeyboardEvent) {
        const { key, altKey, ctrlKey, shiftKey } = evt;
        if (key !== "Tab" || altKey === true || ctrlKey === true) return;
        evt.preventDefault();
        let t = evt.currentTarget as HTMLTextAreaElement;
        t.setRangeText('    ', t.selectionStart, t.selectionEnd, 'end');
    }
    function clearTimer() {
        if (interval.current !== undefined) {
            clearInterval(interval.current);
        }
    }
    return <Page header={pageCaption} onClosed={clearTimer} >
        <div className="d-flex flex-column h-100">
            <div className="text-secondary tonwa-bg-gray-2 d-flex align-items-center px-1 border-bottom">
                <div className="m-1">设计界面实现中...</div>
                <div className="flex-grow-1"></div>
                <ButtonAsync className="btn btn-sm btn-outline-primary m-1"
                    onClick={onSubmit}>
                    提交
                </ButtonAsync>
            </div>
            <div className="flex-grow-1 p-1 border border-info rounded">
                <textarea ref={refTextArea} spellCheck={false}
                    onKeyDown={onTabKeyDown}
                    className="p-2 h-100 w-100 border-0"
                    defaultValue={code}
                    style={{ border: 'none', outline: 'none', fontFamily: 'monospace', resize: 'none' }}
                />
            </div>
            <div className="h-16c border-top border-dark border-3">
                <textarea ref={refTextAreaLog} spellCheck={false}
                    readOnly={true}
                    className="p-2 h-100 w-100 border-0"
                    style={{ border: 'none', outline: 'none', fontFamily: 'monospace', resize: 'none' }}
                />
            </div>
        </div>
    </Page>
}
