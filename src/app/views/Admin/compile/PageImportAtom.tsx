import { BizBud, BudDataType, Entity, EntityAtom, EntityOptions, EnumBudType } from "app/Biz";
import React, { useRef, useState } from "react";
import { Page, useModal } from "tonwa-app";
import './code-editor-style.css';
import Editor from 'react-simple-code-editor';
import { editorStyle } from './grammar';
import { ButtonAsyncIcon } from 'app/tool/ButtonAsyncIcon';
import { loadFiles } from "./loadFiles";
import { FA } from "tonwa-com";
import { useUqApp } from "app/UqApp";
import { BizPhraseType } from "uqs/UqDefault";
import { getDays } from "app/tool";

const style: React.CSSProperties = { ...editorStyle };
export function PageImportAtom({ entity }: { entity: EntityAtom; }) {
    const modal = useModal();
    const [code, setCode] = useState('');
    const fileInput = useRef<HTMLInputElement>();
    async function onImport() {
        let parser = new Parser(code, entity);
        let importAtom = parser.parse();
        modal.open(<PageImportInfo importAtom={importAtom} />);
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
        let fullContent = code + (await loadFiles(files));
        fileInput.current.value = '';
        setCode(fullContent);
    }
    function onMemo() {
        modal.open(<PageMemo />);
    }
    return <Page header={'导入 - ' + entity.caption}>
        <div className="px-3 py-1 tonwa-bg-gray-2 d-flex">
            <ButtonAsyncIcon onClick={onImport} icon="send-o">导入</ButtonAsyncIcon>
            <button className="btn btn-sm btn-link" onClick={onMemo}>导入格式说明</button>
            <div className="flex-grow-1" />
            <button className="btn btn-outline-primary" onClick={onLoadFile}>打开文件</button>
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
    // highlight={(code) => myHighlight(code, uqGrammar, 'uq')}
}

type PropValue = string | number | (number[]);
type RefAtom = [EntityAtom, string, number, number]; // , no, rowIndex, propIndex
enum Sep {
    eof = 0,
    eol = 1,
    eow = 2,
}
enum EnumError {
    none = 0,
    nonexists = 1,
    invalidValue = 2,
}
interface AtomRow {
    no: string;
    ex: string;
    props: [BizBud, PropValue?][];
    ln: number;
}
interface AtomData {
    entityLeaf: EntityAtom;
    entityName: string;
    entityAny: Entity;
    rows: AtomRow[];
    errorRows: [number, [string, EnumError][]][];      // 行号，字段名称组
    refAtoms: RefAtom[]; // refEntity, no, row index, prop index
}
const chars = ':;\n\r';
const chColon = chars.charCodeAt(0);
const chSemiColon = chars.charCodeAt(1);
const chN = chars.charCodeAt(2);
const chR = chars.charCodeAt(3);
class Parser {
    private readonly data: string;
    private readonly rootEntity: EntityAtom;
    private p: number;
    private word: string;
    private lowered: string;
    private sep: Sep;
    private delimiter: number = chSemiColon;
    private ln: number = 0;
    readEntityLeaf: EntityAtom;
    readEntity: Entity;
    readEntityName: string;

    constructor(data: string, entity: EntityAtom) {
        this.data = data;
        this.rootEntity = entity;
    }

    private readWord(chEnd: number) {
        const { length } = this.data;
        let start = this.p;
        let end: number;
        for (; ;) {
            if (this.p >= length) {
                this.sep = Sep.eof;
                end = this.p;
                break;
            }
            let c = this.data.charCodeAt(this.p);
            if (c === chR || c === chN) {
                this.sep = Sep.eol;
                end = this.p;
                ++this.p
                ++this.ln;
                break;
            }
            if (c === chEnd) {
                this.sep = Sep.eow;
                end = this.p;
                ++this.p
                break;
            }
            ++this.p;
        }
        this.word = this.data.substring(start, end).trim();
        this.lowered = this.word.toLowerCase();
    }
    parse(): ImportAtom {
        const { biz } = this.rootEntity;
        this.p = 0;
        let importAtom = new ImportAtom(this.rootEntity);
        const { arrAtomData } = importAtom;
        for (; ;) {
            this.parseHead();
            if (this.sep as any === Sep.eof) break;
            let rows: AtomRow[] = [];
            let errorRows: [number, [string, EnumError][]][] = [];
            let refAtoms: [EntityAtom, string, number, number][] = [];
            for (; ;) {
                this.readWord(this.delimiter);
                let no = this.word;
                if (no === '' && this.sep === Sep.eol) break;
                this.readWord(this.delimiter);
                let ex = this.word;
                let props: [BizBud, PropValue?][] = [];
                let errs: [string, EnumError][] = [];
                for (; ;) {
                    this.readWord(chColon);
                    if (this.sep as any === Sep.eof || this.sep as any === Sep.eol) break;
                    let key = this.word;
                    this.readWord(this.delimiter);
                    let value = this.word;
                    if (key.length > 0 && value.length > 0) {
                        if (this.readEntityLeaf === undefined) {
                            errs.push([key, EnumError.nonexists]);
                        }
                        else {
                            let bud = this.readEntityLeaf.budFromName(key);
                            if (bud !== undefined) {
                                let v = this.budValue(bud, value);
                                if (v === null) {
                                    this.budAtomValue(refAtoms, rows.length, props.length, value);
                                    props.push([bud]);
                                }
                                else if (v !== undefined) {
                                    props.push([bud, v]);
                                }
                                else {
                                    errs.push([key, EnumError.invalidValue]);
                                }
                            }
                            else {
                                errs.push([key, EnumError.nonexists]);
                            }
                        }
                    }
                    if (this.sep as any === Sep.eof || this.sep as any === Sep.eol) break;
                }
                rows.push({
                    no, ex, ln: this.ln, props,
                });
                if (errs.length > 0) {
                    errorRows.push([this.ln, errs]);
                }
                if (this.sep === Sep.eof) break;
            }
            arrAtomData.push({
                entityLeaf: this.readEntityLeaf,
                entityName: this.readEntityName,
                entityAny: this.readEntity,
                rows,
                errorRows,
                refAtoms,
            });
            if (this.sep === Sep.eof) break;
        }
        return importAtom;
    }

    private budValue(bud: BizBud, v: string): PropValue {
        switch (bud.budDataType.type) {
            default: return this.budNumberValue(v);
            case EnumBudType.dec: return this.budNumberValue(v);
            case EnumBudType.char:
            case EnumBudType.str: return v;
            case EnumBudType.radio: return this.budRadioValue(v);
            case EnumBudType.check: return this.budCheckValue(v);
            case EnumBudType.date: return this.budDateValue(v);
            case EnumBudType.datetime: return this.budDateTimeValue(v);
            case EnumBudType.ID:
            case EnumBudType.atom: return null;
        }
    }

    private budNumberValue(v: string) {
        let dec = Number(v);
        if (Number.isNaN(dec) === true) return;
        return dec;
    }

    private budDateValue(v: string) {
        let date = getDays(v);
        return date;
    }

    private budDateTimeValue(v: string) {
        let date = getDays(v);
        return date;
    }

    private parseOptionsValue(v: string): [EntityOptions, string] {
        let parts = v.split('.');
        if (parts.length !== 2) return;
        let optionsEntity = this.rootEntity.biz.entities[parts[0]];
        if (optionsEntity === undefined) return;
        if (optionsEntity.bizPhraseType !== BizPhraseType.options) return;
        let options = optionsEntity as EntityOptions;
        return [options, parts[1]];
    }

    private budRadioValue(v: string) {
        let [options, value] = this.parseOptionsValue(v);
        let optionItem = options.items.find(item => item.name === value);
        if (optionItem === undefined) return;
        return optionItem.id;
    }

    private budCheckValue(v: string) {
        let [options, items] = this.parseOptionsValue(v);
        let parts = items.split('+');
        let ret: number[] = [];
        for (let p of parts) {
            p = p.trim();
            let optionItem = options.items.find(item => item.name === p);
            if (optionItem === undefined) return;
            ret.push(optionItem.id);
        }
        return ret;
    }

    private budAtomValue(refAtoms: [EntityAtom, string, number, number][], rowIndex: number, propIndex: number, v: string) {
        let p = v.indexOf('.');
        if (p <= 0) return;
        let e = v.substring(0, p);
        let no = v.substring(p + 1);
        let entity = this.rootEntity.biz.entities[e];
        if (entity === undefined) return;
        if (entity.bizPhraseType !== BizPhraseType.atom) return;
        refAtoms.push([entity as EntityAtom, no, rowIndex, propIndex]);
    }

    private parseHead(): EntityAtom {
        this.readEntityLeaf = undefined;
        this.readEntityName = undefined;
        let length: number;
        for (; ;) {
            this.readWord(chN);
            length = this.word.length;
            if (length > 0) break;
            if (this.sep === Sep.eof) return;
        }
        length--;
        let c = this.lowered.charCodeAt(length);
        if (!(c >= 0x30 && c <= 0x39 || c >= 0x41 && c <= 0x5A || c >= 0x61 && c <= 0x7A || c > 0x7F)) {
            this.delimiter = c;
            this.readEntityName = this.lowered.substring(0, length);
        }
        else {
            this.readEntityName = this.lowered;
        }
        this.readEntityLeaf = this.rootEntity.getLeaf(this.readEntityName);
        this.readEntity = this.rootEntity.biz.entities[this.readEntityName];
    }
}

class ImportAtom {
    readonly rootEntity: EntityAtom;
    readonly arrAtomData: AtomData[] = [];

    constructor(entity: EntityAtom) {
        this.rootEntity = entity;
    }

    checkError() {
        for (let atomData of this.arrAtomData) {
            const { entityLeaf, errorRows } = atomData;
            if (entityLeaf === undefined) return true;
            if (errorRows.length > 0) return true;
        }
        return false;
    }

    async loadAtomNos(atomData: AtomData) {
        if (this.checkError() === true) return;
        let coll: { [id: number]: { [no: string]: RefAtom } } = {};
        let arr: RefAtom[] = [];
        let { refAtoms } = atomData;
        for (let refAtom of refAtoms) {
            let [entity, no] = refAtom;
            const { id } = entity;
            let noColl = coll[id];
            if (noColl === undefined) coll[id] = noColl = {};
            if (noColl[no] === undefined) {
                noColl[no] = refAtom;
                arr.push(refAtom);
            }
        }
        let results = await this.rootEntity.biz.uq.GetAtomNos.submit({
            arr: arr.map(([entity, no]) => ({
                entity: entity.rootClass.id, no
            }))
        });
        let { length } = results;
        for (let i = 0; i < length; i++) {
            let [, , rowIndex, propIndex] = arr[i];
            let row = atomData.rows[rowIndex];
            let ret = results[i];
            let retId = ret.id;
            if (retId === 0) {
                let prop = row.props[propIndex];
                atomData.errorRows.push([row.ln, [[prop[0].name, EnumError.invalidValue]]]);
            }
            else {
                row.props[propIndex].push(retId);
            }
        }
    }
}

function PageImportInfo({ importAtom }: { importAtom: ImportAtom; }) {
    const uqApp = useUqApp();
    const { rootEntity, arrAtomData } = importAtom;
    let hasErr: boolean = false;
    let content: any[] = [];
    for (let i = 0; i < arrAtomData.length; i++) {
        let atomData = arrAtomData[i];
        const { entityLeaf, entityName, entityAny, rows } = atomData;
        let vCaption: any;
        let vCenter;
        let vRight = <span>共{rows.length}行</span>;
        if (entityLeaf !== undefined) {
            const { name, caption } = entityLeaf;
            vCaption = <>
                <b>{caption}</b>
                {caption === name ? undefined : <span className="text-info">&nbsp; {name}</span>}
            </>;
        }
        else {
            hasErr = true;
            vCaption = <>{entityName}</>;
            vCenter = <><span className="text-danger">数据错误：</span>
                '{entityName}' 不是 '{rootEntity.caption}' 的一部分
            </>;
        }
        content.push(<div key={i} className="d-flex align-items-center px-3 py-2 border-bottom">
            <span className="w-min-12c"><FA name="chevron-circle-right" className="me-3 text-info" /><b>{vCaption}</b></span>
            <div className="flex-fill">{vCenter}</div>
            {vRight}
        </div>);
    }
    let viewTop: any, viewBottom: any;
    if (hasErr === false) {
        viewBottom = <div className="m-3">
            <button className="btn btn-primary" onClick={onStart}>开始导入</button>
        </div>
    }
    else {
        viewTop = <div className="p-3 border-bottom">
            <FA name="exclamation-circle me-3" className="text-danger" />
            <span className="text-info">请先修正数据问题，然后再导入</span>
        </div>
    }
    async function onStart() {
        let date = Date.now();
        let promises: Promise<any>[] = [];
        let rootPhrase = rootEntity.id;
        let serverError: any;
        for (let atomData of arrAtomData) {
            const { entityLeaf, rows } = atomData;
            const phrase = entityLeaf.id;
            for (let row of rows) {
                if (promises.length === 10) {
                    await Promise.all(promises);
                    promises = [];
                }
                const { no, ex, props } = row;
                promises.push((async () => {
                    try {
                        let ret = await uqApp.uq.SaveAtomAndProps.submit({
                            rootPhrase,
                            phrase,
                            no,
                            ex,
                            props: props.map(([bud, value]) => ([bud.id, value]))
                        });
                    }
                    catch (e) {
                        serverError = e;
                    }
                })());
                if (serverError !== undefined) break;
            }
            if (serverError !== undefined) break;
        }
        if (promises.length > 0) await Promise.all(promises);
        alert(`完成 共用时${Date.now() - date}豪秒`);
    }
    return <Page header={`导入 - ${rootEntity.caption} - 数据`}>
        {viewTop}
        <div className="pb-3">
            {content}
        </div>
        {viewBottom}
    </Page>
}

function PageMemo() {
    return <Page header="导入格式说明">
        <div className="my-3">
            <div className="mx-3">导入数据示例</div>
            <pre className="border-top border-bottom text-info mt-3 py-2 px-3">{
                `手机
001; aaa1; a1:b1; c1:d1; e
002; aaa2; a2:b2; c2:d2;
233211003; 苹果15 Pro Max; 持有人:职员.3399001; 重量:3.0; 类型:手机类型.ios
004; aaa4; a4:b4; c4:d4

手机1
001; aaa1; a1:b1; c1:d1; e
002; aaa2; a2:b2; c2:d2;
003; aaa3; a3:b3; c3:d3
004; aaa4; a4:b4; c4:d4

`}
            </pre>
        </div>
        <div className="px-3 pb-3 mb-2 border-bottom">说明</div>
        <ul>
            <li>可以导入多个Atom组，每组之间加一个空行</li>
            <li>Atom的第一行，是Atom名称</li>
            <li>随后的每一行都是数据</li>
            <li>数据之间用分号分开</li>
            <li>每一行的第一个值，是no，也就是唯一编号</li>
            <li>每一行的第二个值，是ex，也就是可读的说明</li>
            <li>随后是以冒号分开的键值对</li>
            <li>键是属性的名称，值是属性的值</li>
            <li>单选项的值：选项定义.选项名称</li>
            <li>多选项的值：选项定义.选项名称1+选项名称2+选项名称3+...</li>
            <li>Atom值: [Atom名称].[Atom no]</li>
            <li>日期值: 2024-1-3</li>
        </ul>
    </Page>;
}