import { Entity } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { UseQueryOptions } from "app/tool";
import { KeyboardEvent, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { Page } from "tonwa-app";

export function PageEntity({ entity }: { entity: Entity }) {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    const { id, caption, name } = entity;
    const { data } = useQuery([id], async () => {
        let { ret } = await uq.GetEntityCode.query({ id });
        return ret[0];
    }, UseQueryOptions);
    const refTextArea = useRef<HTMLTextAreaElement>();
    useEffect(() => {
        refTextArea.current.focus();
    });
    const { code, schema } = data;
    async function onSubmit() {
        const { uqMan, biz } = uqApp;
        let { uqApi } = uqMan;
        let { value: code } = refTextArea.current
        let { schemas, logs, hasError } = await uqApi.compileEntity(id, code);
    }
    function onTabKeyDown(evt: KeyboardEvent) {
        const { key, altKey, ctrlKey, shiftKey } = evt;
        if (key !== "Tab" || altKey === true || ctrlKey === true) return;
        evt.preventDefault();
        let t = evt.currentTarget as HTMLTextAreaElement;
        t.setRangeText('    ', t.selectionStart, t.selectionEnd, 'end');
    }
    return <Page header={caption ?? name} >
        <div className="d-flex flex-column h-100">
            <div className="text-secondary tonwa-bg-gray-2 d-flex align-items-center px-1 border-bottom">
                <div className="m-1">设计界面实现中...</div>
                <div className="flex-grow-1"></div>
                <button className="btn btn-sm btn-outline-primary m-1" onClick={onSubmit}>提交</button>
            </div>
            <div className="flex-grow-1 p-1 border border-info rounded">
                <textarea ref={refTextArea} spellCheck={false}
                    onKeyDown={onTabKeyDown}
                    className="p-2 h-100 w-100 border-0"
                    defaultValue={code}
                    style={{ border: 'none', outline: 'none', fontFamily: 'monospace', }}
                />
            </div>
        </div>
    </Page>
}
