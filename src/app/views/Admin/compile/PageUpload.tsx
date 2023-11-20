import * as jsonpack from 'jsonpack';
import { useUqApp } from "app/UqApp";
import React, { useRef, useState } from "react";
import { Page, useModal } from "tonwa-app";
import { ButtonAsync, FA } from "tonwa-com";
import Editor from 'react-simple-code-editor';
import { Grammar, highlight } from 'prismjs';
import { editorStyle, uqGrammar } from './grammar';

export function PageUpload() {
    const uqApp = useUqApp();
    const { openModal, closeModal } = useModal();
    const [code, setCode] = useState('');
    const fileInput = useRef<HTMLInputElement>();

    async function onComplie() {
        const { uqMan, biz } = uqApp;
        let { uqApi } = uqMan;
        let { schemas, logs, hasError } = await uqApi.compile(code);
        let allSchemas: any;
        let top: any;
        function Top({ children, icon, color }: { icon: string; color: string; children: React.ReactNode }) {
            return <div className='p-3 border-bottom tonwa-bg-gray-2'>
                <FA className={'me-3 ' + color ?? ' '} name={icon} />
                {children}
            </div>
        }
        if (hasError === false) {
            allSchemas = jsonpack.unpack(schemas);
            biz.buildEntities(allSchemas);
            top = <Top icon="check-circle" color="text-success">提交成功</Top>;
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
        closeModal();
        openModal(<Page header="业务设计已提交">
            {top}
            <pre className='p-3 text-break' style={{ whiteSpace: 'pre-wrap' }}>{results}</pre>
        </Page>);
    }
    // <button className="btn btn-outline-primary me-3" onClick={onSelectFiles}>打开</button>
    /*
    <input ref={fileInput}
    type="file"
    className="w-100 form-control-file d-none"
    name="files" multiple={false}
    onChange={onFilesChange} />
    */
    function myHighlight(text: string, grammar: Grammar, language: string): string {
        let ret = highlight(text, grammar, language);
        return ret;
    }
    function onCodeChange(code: string) {
        setCode(code);
        // setSumitDisabled(false);
    }
    let style: React.CSSProperties = { ...editorStyle };

    function onLoadFile() {
        fileInput.current.click();
    }
    function onUploaded(content: string) {
        setCode(code + content);
    }
    async function load(file: File) {
        return new Promise<void>((resolve) => {
            // textAreaRef.current.textContent = '';
            let fr = new FileReader();
            fr.readAsText(file);
            fr.onloadend = async function (evt: ProgressEvent<FileReader>) {
                resolve();
                //setText(evt.target.result as string);
                // textAreaRef.current.textContent = evt.target.result as string;
                onUploaded(evt.target.result as string);
            }
        });
    }
    async function onFilesChange(evt: React.ChangeEvent<HTMLInputElement>) {
        // filesContent = '';
        let { files } = evt.target;
        if (files === null) return;
        for (let file of files) {
            await load(file);
        }
        // openModal(<PageUpload content={filesContent} />);
        fileInput.current.value = '';
    }
    return <Page header="业务设计">
        <div className="px-3 py-1 tonwa-bg-gray-2 d-flex">
            <ButtonAsync className="btn btn-primary me-3" onClick={onComplie}>提交</ButtonAsync>
            <div className="flex-grow-1" />
            <button className="btn btn-outline-primary" onClick={onLoadFile}>载入文件</button>
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
