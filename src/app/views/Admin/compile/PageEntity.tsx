import * as jsonpack from 'jsonpack';
import { Entity } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { UseQueryOptions } from "app/tool";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { Page } from "tonwa-app";
import { ButtonAsync } from 'tonwa-com';
import { Grammar, highlight } from "prismjs";
import './code-editor-style.css'
import Editor from 'react-simple-code-editor';
import { uqGrammar } from './grammar';

export function PageEntity({ entity }: { entity: Entity }) {
    const uqApp = useUqApp();
    const { uq } = uqApp;
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
        div.style.maxHeight = div.parentElement.clientHeight + 'px';
    });

    const { code: codeInit, schema } = data;
    const [code, setCode] = useState(codeInit);
    const [readOnly, setReadOnly] = useState(false);
    async function onSubmit() {
        const { uqMan, biz } = uqApp;
        let { uqApi } = uqMan;
        // const { current: textArea } = refTextArea;
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
        setReadOnly(false);
        clearInterval(interval.current);
        interval.current = undefined;
        let newEntity = biz.entityIds[entity.id];
        setPageCaption(newEntity.caption ?? newEntity.name);
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

    return <Page header={pageCaption} onClosed={clearTimer} hideScroll={true}>
        <div className="d-flex flex-column" style={{ height: "calc(100% - 1em)" }}>
            <div className="text-secondary tonwa-bg-gray-2 d-flex align-items-center px-1 border-bottom">
                <div className="m-1">设计界面实现中...</div>
                <div className="flex-grow-1"></div>
                <ButtonAsync overtime={5} className="btn btn-sm btn-outline-primary m-1"
                    onClick={onSubmit}>
                    提交
                </ButtonAsync>
            </div>
            <div className="border-info rounded flex-grow-1">
                <div ref={refContainerEditorArea} className="container_editor_area w-100">
                    <Editor className="container__editor"
                        autoFocus={true}
                        spellCheck={false}
                        readOnly={readOnly}
                        placeholder="Type some code…"
                        value={code}
                        onValueChange={(code) => setCode(code)}
                        highlight={(code) => myHighlight(code, uqGrammar, 'uq')}
                        padding={10}
                        tabSize={4}
                        style={{
                            fontSize: 18,
                            border: 'none', outline: 'none',
                            overflowY: "visible",
                            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                        }}
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
