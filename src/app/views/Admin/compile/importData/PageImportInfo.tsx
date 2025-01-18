import { Page } from "tonwa-app";
import '../code-editor-style.css';
import { FA, getAtomValue, setAtomValue } from "tonwa-com";
import { AtomData, ImportAtom } from "./ImportAtom";
import { useRef, useState } from "react";
import { atom, useAtomValue } from "jotai";
import { Atom } from "jotai";

export function PageImportInfo({ importAtom }: { importAtom: ImportAtom; }) {
    const { rootEntity, arrAtomData, hasError } = importAtom;
    let content: any[] = [];
    //let { current: jotaiAtoms } = useRef(arrAtomData.map(v => atom<State>()));
    let [buttonVisible, setButtonVisible] = useState(hasError === false);
    let [finished, setFinished] = useState(-1);
    let jotaiAtoms = arrAtomData.map(v => atom<State>());
    for (let i = 0; i < arrAtomData.length; i++) {
        let atomData = arrAtomData[i];
        content.push(<ViewAtomData key={i} atomData={atomData} jotaiAtom={jotaiAtoms[i]} />);
    }
    let viewTop: any, viewBottom: any;
    if (buttonVisible === true) {
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
        setButtonVisible(false)
        let date = Date.now();
        let serverError: any;
        for (let i = 0; i < arrAtomData.length; i++) {
            let atomData = arrAtomData[i];
            serverError = await atomData.upload(importAtom, (rowGroup) => {
                setAtomValue(jotaiAtoms[i], {
                    atomIndex: i,
                    ln: rowGroup[rowGroup.length - 1].ln,
                    serverError,
                });
            });
            setAtomValue(jotaiAtoms[i], {
                atomIndex: i,
                ln: -1,
                serverError,
            });
            if (serverError !== undefined) break;
        }
        setFinished(Date.now() - date);
    }
    return <Page header={`导入 - ${rootEntity.caption} - 数据`}>
        {viewTop}
        <div className="pb-3">
            {content}
        </div>
        {viewBottom}
        {finished > 0 && <div className="px-3 py-2 text-success">完成 共用时{finished}豪秒</div>}
    </Page>
}

interface State {
    atomIndex: number;
    ln: number;
    serverError: any;
}
function ViewAtomData({ atomData, jotaiAtom }: { atomData: AtomData; jotaiAtom: Atom<State> }) {
    const { importAtom, entityLeaf, entityName, cols, rows, errorRows, errorCols } = atomData;
    let vCaption = <>{entityName}</>;
    let vCenter;
    let vRight = <span>共{rows.length}行</span>;
    let vBottom: any;
    let state = useAtomValue(jotaiAtom);
    if (entityLeaf === undefined) {
        vCenter = <><span className="text-danger">数据错误：</span>
            '{entityName}' 不是 '{importAtom.rootEntity.caption}' 的一部分
        </>;
    }
    else if (cols.length < 2) {
        vCenter = <span className="text-danger">
            至少需要两列数据，no和ex
        </span>;
    }
    else if (cols[0].header.toLowerCase() != 'no') {
        vCenter = <span className="text-danger">
            第一列必须是no
        </span>;
    }
    else if (cols[1].header.toLowerCase() != 'ex') {
        vCenter = <span className="text-danger">
            第一列必须是ex
        </span>;
    }
    else if (errorRows.length > 0) {
        vCenter = <span className="text-danger">
            共{errorRows.length}行数据有错误
        </span>;
        let errorArr = errorRows.slice(0, 10);
        vBottom = <div className="my-1">
            {errorArr.map((v, index) => {
                const [ln, errorCols] = v;
                return <div key={index} className="px-3 py-1">
                    {ln}行: 共{errorCols.length}列错误
                </div>
            })}
            {errorRows.length > errorArr.length ? <div className="px-3 py-1">...</div> : undefined}
        </div>
    }
    else {
        const { name, caption } = entityLeaf;
        vCaption = <>
            <b>{caption}</b>
            {caption === name ? undefined : <span className="text-info">&nbsp; {name}</span>}
        </>;
    }
    let vErrorCols: any;
    if (errorCols.length > 0) {
        vErrorCols = <div className="d-flex flex-wrap px-3 py-2">
            <span className="me-3">无效列：</span>
            {errorCols.map((v, index) => {
                return <span key={index} className="mx-1">{v.header}</span>
            })}
        </div>;
    }
    let vState: any;
    if (state !== undefined) {
        const { ln } = state;
        if (ln !== undefined) {
            vState = ln > 0 ?
                <div className="mt-2">{ln}</div>
                :
                <div className="mt-2 text-success">完成</div>;
        }
    }
    return <div className="px-3 py-2 border-bottom">
        <div className="d-flex align-items-center">
            <span className="w-min-12c"><FA name="chevron-circle-right" className="me-3 text-info" /><b>{vCaption}</b></span>
            <div className="flex-fill">{vCenter}</div>
            {vRight}
        </div>
        {vErrorCols}
        {vBottom}
        {vState}
    </div>;
}
