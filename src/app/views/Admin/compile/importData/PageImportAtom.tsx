import { EntityAtom } from "app/Biz";
import React, { KeyboardEvent, useRef, useState } from "react";
import { Page, useModal } from "tonwa-app";
import '../code-editor-style.css';
import Editor from 'react-simple-code-editor';
import { editorStyle } from '../grammar';
import { ButtonAsyncIcon } from 'app/tool/ButtonAsyncIcon';
import { loadFiles } from "../loadFiles";
import { Parser } from "./Parser";
import { PageMemo } from "./PageMemo";
import { PageImportInfo } from "./PageImportInfo";
import { useUqApp } from "app/UqApp";
import { AtomData } from "./AtomData";

const style: React.CSSProperties = { ...editorStyle };
export function PageImportAtom() {
    const { biz } = useUqApp();
    const modal = useModal();
    const [code, setCode] = useState('');
    const fileInput = useRef<HTMLInputElement>();
    const elSelect = useRef<HTMLSelectElement>();
    async function onImport() {
        let atomData = new AtomData(biz, code);
        atomData.parseHead();
        // let parser = new Parser(biz, code);
        // let atomData = parser.parse();
        modal.open(<PageImportInfo atomData={atomData} />);
    }
    function onCodeChange(code: string) {
        setCode(code);
    }
    function onLoadFile() {
        fileInput.current.click();
    }
    async function onFilesChange(evt: React.ChangeEvent<HTMLInputElement>) {
        let { files } = evt.target;
        if (files === null) return;
        let fullContent = (await loadFiles(files, elSelect.current.value));
        fileInput.current.value = '';
        setCode(fullContent);
    }
    function onMemo() {
        modal.open(<PageMemo />);
    }
    function onKeyDown(evt: KeyboardEvent) {
        const { code, altKey, ctrlKey, shiftKey } = evt;
        if (code === 'Tab' && altKey === false && ctrlKey === false && shiftKey === false) {
            let textArea = evt.target as HTMLTextAreaElement;
            const position = textArea.selectionStart;
            textArea.setRangeText('\t', position, position);
            textArea.setSelectionRange(position + 1, position + 1);
            evt.preventDefault();
        }
    }
    return <Page header={'导入数据'}>
        <div className="px-3 py-2 tonwa-bg-gray-2">
            <div className="row">
                <div className="col-auto">
                    <ButtonAsyncIcon onClick={onImport} icon="send-o">导入</ButtonAsyncIcon>
                </div>
                <button className="col-auto btn btn-sm btn-link" onClick={onMemo}>导入格式说明</button>
                <button className="col-auto ms-auto btn btn-outline-primary" onClick={onLoadFile}>打开文件</button>
                <div className="col-auto">
                    <select ref={elSelect} className="form-select">
                        <option value={undefined} selected>文本编码</option>
                        <option value="utf8">utf8编码</option>
                        <option value="gbk">简体中文编码</option>
                    </select>
                </div>
            </div>
        </div>
        <div className="border-info rounded flex-grow-1">
            <div className="container_editor_area w-100">
                <Editor className="container__editor"
                    autoFocus={true}
                    spellCheck={false}
                    placeholder="直接输入，或调入文件"
                    value={code}
                    onValueChange={onCodeChange}
                    highlight={(code) => code}
                    padding={10}
                    style={style}
                    tabSize={4}
                    ignoreTabKey={false}
                    onKeyDown={onKeyDown}
                />
            </div>
        </div>
        <input ref={fileInput}
            type="file"
            className="w-100 form-control-file d-none"
            name="files" multiple={true}
            onChange={onFilesChange} />
    </Page>;
    // highlight={(code) => myHighlight(code, uqGrammar, 'uq')}
}
