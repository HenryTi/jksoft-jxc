import * as jsonpack from 'jsonpack';
import { useUqApp } from "app/UqApp";
import React, { useRef, useState } from "react";
import { Page, useModal } from "tonwa-app";
import { FA } from "tonwa-com";
import Editor from 'react-simple-code-editor';
import { Grammar, highlight } from 'prismjs';
import { editorStyle, uqGrammar } from './grammar';
import { PageAdmin } from './PageAdmin';
import { ButtonAsyncIcon } from 'app/tool/ButtonAsyncIcon';
import { loadFiles } from './loadFiles';
import { ViewCurSite, ViewCurSiteHeader } from 'app/views/Site';

export function PageCode() {
    const uqApp = useUqApp();
    const modal = useModal();
    const [code, setCode] = useState('');
    const fileInput = useRef<HTMLInputElement>();

    async function onCompile() {
        const { uqMan, biz } = uqApp;
        let { uqApi } = uqMan;
        let { schemas, logs, hasError } = await uqApi.compile(code);
        let allSchemas: any;
        let top: any;
        function Top({ children, icon, color }: { icon: string; color: string; children: React.ReactNode }) {
            return <div className='p-3 border-bottom tonwa-bg-gray-2'>
                <FA className={'me-3 ' + (color ?? ' ')} name={icon} />
                {children}
            </div>
        }
        if (hasError === false) {
            allSchemas = jsonpack.unpack(schemas);
            biz.buildEntities(allSchemas);
            top = <Top icon="check-circle" color="text-success">编译成功</Top>;
        }
        else {
            top = <Top icon="exclamation-circle" color="text-danger">发生错误</Top>;
        }
        let results: string;
        if (logs.length > 0) {
            let text: string[] = [];
            (logs as string[]).forEach(v => {
                if (v === null) return;
                text.push(...v.split('\n'));
            });
            results = text.join('\n');
        }
        else {
            let str = JSON.stringify(allSchemas, null, 4);
            results = str;
        }
        modal.open(<Page header="业务设计已提交">
            {top}
            <pre className='p-3 text-break' style={{ whiteSpace: 'pre-wrap' }}>{results}</pre>
        </Page>);
    }
    function myHighlight(text: string, grammar: Grammar, language: string): string {
        let ret = highlight(text, grammar, language);
        return ret;
    }
    function onCodeChange(code: string) {
        setCode(code);
    }
    let style: React.CSSProperties = { ...editorStyle };

    function onUploadFile() {
        fileInput.current.click();
    }
    async function onDownloadFile() {
        const { uqMan } = uqApp;
        let { uqApi } = uqMan;
        await uqApi.source('');
    }
    /*
    async function load(file: File): Promise<string> {
        return new Promise<string>((resolve) => {
            let fr = new FileReader();
            fr.readAsText(file);
            fr.onloadend = async function (evt: ProgressEvent<FileReader>) {
                resolve(evt.target.result as string);
            }
        });
    }
    */
    async function onFilesChange(evt: React.ChangeEvent<HTMLInputElement>) {
        let { files } = evt.target;
        if (files === null) return;
        let fullContent = code + await loadFiles(files, undefined);
        /*
        let fullContent = code;
        for (let file of files) {
            fullContent += await load(file);
        }
        */
        fileInput.current.value = '';
        setCode(fullContent);
    }
    function onAdmin() {
        modal.open(<PageAdmin />);
    }

    return <Page header={<ViewCurSiteHeader caption="脚本" />}>
        <div className="px-3 py-1 tonwa-bg-gray-2 d-flex">
            <ButtonAsyncIcon onClick={onCompile} icon="send-o">提交</ButtonAsyncIcon>
            <div className="flex-grow-1" />
            <button className="btn btn-outline-primary" onClick={onUploadFile}>上传脚本</button>
            <button className="btn btn-outline-primary ms-2" onClick={onDownloadFile}>下载脚本</button>
            <button className="btn btn-outline-primary ms-2" onClick={onAdmin}>管理</button>
        </div>
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
        <input ref={fileInput}
            type="file"
            className="w-100 form-control-file d-none"
            name="files" multiple={true}
            onChange={onFilesChange} />
    </Page>;
}
