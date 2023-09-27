import { useRef, useState } from "react";
import { Route } from "react-router-dom";
import { Page, useModal } from "tonwa-app";
import { PageUpload } from './PageUpload';

function PageCompile() {
    const { openModal } = useModal();
    const fileInput = useRef<HTMLInputElement>();
    function onUploaded(content: string) {
        openModal(<PageUpload content={content} />);
    }
    function onSelectFiles() {
        fileInput.current.click();
    }
    async function onFilesChange(evt: React.ChangeEvent<HTMLInputElement>) {
        let { files } = evt.target;
        await load(files[0]);
        fileInput.current.value = '';
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
    return <Page header={captionCompile}>
        <div className="p-3">
            <button className="btn btn-primary" onClick={onSelectFiles}>上传业务设计</button>
            <input ref={fileInput}
                type="file"
                className="w-100 form-control-file d-none"
                name="files" multiple={false}
                onChange={onFilesChange} />
        </div>
    </Page>;
}

export const pathCompile = "compile";
export const captionCompile = '业务设计';
export const routeCompile = <Route path={`${pathCompile}`} element={<PageCompile />}></Route>;
