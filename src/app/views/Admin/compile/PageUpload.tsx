import * as jsonpack from 'jsonpack';
import { useUqApp } from "app/UqApp";
import React, { useEffect, useRef, useState } from "react";
import { Page, useModal } from "tonwa-app";
import { ButtonAsync, EasyDate, FA, LMR, List, Sep, wait } from "tonwa-com";

export function PageUpload({ content }: { content: string; }) {
    const uqApp = useUqApp();
    const { openModal, closeModal } = useModal();

    async function onComplie() {
        const { uqMan, biz } = uqApp;
        let { uqApi } = uqMan;
        let { schemas, logs, hasError } = await uqApi.compileOverride(content);
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
    return <Page header="业务设计">
        <div className="px-3 py-1 tonwa-bg-gray-2 d-flex">
            <ButtonAsync className="btn btn-primary me-3" onClick={onComplie}>提交</ButtonAsync>
        </div>
        <div className="p-1">
            <pre className='p-3 text-break' style={{ whiteSpace: 'pre-wrap' }}>{content}</pre>
        </div>
    </Page>;
    // <textarea ref={textAreaRef} className="form-control fs-larger" rows={20} />
}
