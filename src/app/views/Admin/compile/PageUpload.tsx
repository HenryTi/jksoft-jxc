import * as jsonpack from 'jsonpack';
import { useUqApp } from "app/UqApp";
import { useEffect, useRef, useState } from "react";
import { Page, useModal } from "tonwa-app";
import { ButtonAsync, EasyDate, LMR, List, Sep, wait } from "tonwa-com";

export function PageUpload() {
    const uqApp = useUqApp();
    const { openModal, closeModal } = useModal();
    const fileInput = useRef<HTMLInputElement>();
    const textAreaRef = useRef<HTMLTextAreaElement>();
    const [files, setFiles] = useState<any[]>(null);
    const [text, setText] = useState<string>();
    // useAutosizeTextArea(textAreaRef.current, '');
    function onFilesChange(evt: React.ChangeEvent<HTMLInputElement>) {
        let upFiles: any[] = [];
        let { files } = evt.target;
        let len = files.length;
        for (let i = 0; i < len; i++) {
            upFiles.push(files[i]);
        }
        setFiles(upFiles);
        if (len > 0) {
            load(files[0]);
        }
    }

    function onSelectFiles() {
        fileInput.current.click();
    }

    function ViewFile({ value }: { value: File; }) {
        const { name, size, lastModified } = value;
        function sz(): string {
            let n: number, u: string;
            if (size < 1024) {
                n = size; u = 'b';
            }
            else if (size < 1024 * 1024) {
                n = Math.trunc((size / 1024) * 100) / 100; u = 'k';
            }
            else {
                n = Math.trunc((size / 1024 / 1024) * 100) / 100; u = 'm';
            }
            return n + ' ' + u;
        }
        return <LMR className="px-3 py-2">
            <div>
                <div>{name}</div>
                <div className="text-secondary small">修改日期: <EasyDate date={lastModified / 1000} /></div>
            </div>
            <div className="text-secondary small">{sz()}</div>
        </LMR>;
    }
    async function load(file: File) {
        return new Promise<void>((resolve) => {
            textAreaRef.current.textContent = '';
            let fr = new FileReader();
            fr.readAsText(file);
            fr.onloadend = async function (evt: ProgressEvent<FileReader>) {
                resolve();
                //setText(evt.target.result as string);
                textAreaRef.current.textContent = evt.target.result as string;
            }
        });
    }
    async function onComplie() {
        let { uqApi } = uqApp.uqMan;
        let { schemas, logs } = await uqApi.compileOverride(textAreaRef.current.textContent);
        setFiles(undefined);
        if (logs.length > 0) {
            let text: string[] = [];
            (logs as string[]).forEach(v => {
                text.push(...v.split('\n'));
            });
            textAreaRef.current.textContent = text.join('\n');
        }
        else {
            textAreaRef.current.textContent = JSON.stringify(
                jsonpack.unpack(schemas)
                , null, 4
            );
        }
    }
    let btnUpload: any;
    if (files?.length > 0) {
        btnUpload = <ButtonAsync className="btn btn-primary me-3" onClick={onComplie}>提交</ButtonAsync>;
    }
    return <Page header="上传代码">
        <div className="px-3 py-1 tonwa-bg-gray-2 d-flex">
            <button className="btn btn-outline-primary me-3" onClick={onSelectFiles}>打开</button>
            {btnUpload}
            <input ref={fileInput}
                type="file"
                className="w-100 form-control-file d-none"
                name="files" multiple={false}
                onChange={onFilesChange} />
        </div>
        <div className="p-1">
            <textarea ref={textAreaRef} className="form-control fs-larger" rows={20} />
        </div>
    </Page>;
}
