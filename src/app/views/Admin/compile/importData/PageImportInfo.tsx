import { Page } from "tonwa-app";
import '../code-editor-style.css';
import { ButtonAsync, FA, setAtomValue } from "tonwa-com";
import { AtomData } from "./AtomData";
import { useState } from "react";
import { useAtomValue } from "jotai";
import { EnumBudType } from "app/Biz";

export function PageImportInfo({ atomData }: { atomData: AtomData; }) {
    const { hasErrorAtom } = atomData;
    let hasError = useAtomValue(hasErrorAtom);
    let [buttonVisible, setButtonVisible] = useState(true);
    let [finished, setFinished] = useState(-1);
    let content = <ViewAtomData atomData={atomData} />;
    let viewTop: any, viewBottom: any;
    if (hasError) {
        viewTop = <div className="p-3 border-bottom">
            <FA name="exclamation-circle me-3" className="text-danger" />
            <span className="text-info">请先处理数据，再导入</span>
        </div>
    }
    else if (buttonVisible) {
        viewBottom = <div className="m-3">
            <button className="btn btn-primary" onClick={onStart}>开始导入</button>
        </div>
    }
    else {
    }
    async function onStart() {
        setButtonVisible(false)
        let date = Date.now();
        const { stateAtom } = atomData;
        let error: any;
        await atomData.upload((rowGroup, uploadError?: any) => {
            setAtomValue(stateAtom, {
                ln: rowGroup[rowGroup.length - 1].ln,
                error: uploadError,
            });
            error = uploadError;
        });
        setAtomValue(stateAtom, {
            ln: -1,
            error,
        });
        // if (error !== undefined) break;
        setFinished(Date.now() - date);
    }
    return <Page header={`导入数据 - 开始`}>
        {viewTop}
        <div className="pb-3">
            {content}
        </div>
        {viewBottom}
        {finished > 0 && <div className="px-3 py-2 text-success">完成 共用时{finished}ms</div>}
    </Page>
}

function ViewAtomData({ atomData }: { atomData: AtomData; }) {
    const { entityRoot, entityLeaf, entityName, cols, rows
        , errorRows, errorCols, stateAtom
        , errorAtoms, idsLoadedAtom, hasAtomCols } = atomData;
    const idsLoaded = useAtomValue(idsLoadedAtom);
    let vCaption = <>{entityName}</>;
    let vCenter: any, vCols: any;
    // let vRight = <span>共{rows.length}行</span>;
    let vBottom: any;
    let state = useAtomValue(stateAtom);
    let vIcon: any;
    let vState: any;
    if (state !== undefined) {
        const { ln, error } = state;
        if (error !== undefined) {
            vState = <div className="mt-2 text-primary">
                第{ln}行, 导入错误: {error.message}
            </div>
        }
        else if (ln > 0) {
            vState = <div className="mt-2 text-primary">第{ln}行导入...</div>
            vIcon = <FA name="chevron-circle-right" className="me-3 text-primary" />;
        }
        else {
            // vState = <div className="mt-2 text-success"><FA name="check-circle" className="me-2" /> 完成</div>;
            vIcon = <FA name="check-circle" className="me-3 text-success" />;
        }
    }
    else {
        vIcon = <FA name="list-alt" className="me-3 text-info" />;
    }
    if (entityLeaf === undefined) {
        vCenter = <><span className="text-danger">数据错误：</span>
            '{entityName}' 不是 '{entityRoot.caption}' 的一部分
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
        /*
        if (hasAtomCols === true) {
            if (idsLoaded === false) {
                async function onGetAtomIds() {
                    await atomData.getAtomIds();
                }
                vCenter = <ButtonAsync className="btn btn-success" onClick={onGetAtomIds}>获取Atom IDs</ButtonAsync>;
            }
            else if (errorAtoms === undefined) {
                vCenter = <span className="text-success">已获得Atom IDs</span>;
            }
            else {
                vCenter = <span className="text-danger">Atom IDs错误</span>;
            }
        }
        */
        const { name, caption } = entityLeaf;
        vCaption = <>
            <b>{caption}</b>
            {caption === name ? undefined : <span className="text-info">&nbsp; {name}</span>}
        </>;
        vCols = <div>
            <div>1. NO</div>
            <div>2. EX</div>
            {cols.map((v, index) => {
                if (index < 2) return null;
                const { header, bud } = v;
                return <div key={index}>
                    {index + 2}. {header}: {EnumBudType[bud.budDataType.type]}
                </div>;
            })}
        </div>;
    }
    let vError: any;
    if (errorCols.length > 0) {
        vError = <div className="d-flex flex-wrap px-3 py-2">
            <span className="me-3">无效列：</span>
            {errorCols.map((v, index) => {
                return <span key={index} className="mx-1">{v.header}</span>
            })}
        </div>;
    }
    if (errorAtoms !== undefined) {
        let vArr: any[] = [];
        for (let i in errorAtoms) {
            const errorAtom = errorAtoms[i];
            const propIndex = Number(i) - 2;
            const nos = errorAtom.slice(0, 100).map(v => {
                let ln = v + atomData.ln;
                `${ln}:${rows[v].props[propIndex]}`
            });
            vArr.push(<div key={i}>
                {cols[i].header} {nos.join(', ')} {nos.length > 100 ? '...' : undefined}
            </div>);
        }
        vError = <>
            <div>没有找到编号</div>
            {vArr}
        </>;
    }
    return <div className="px-3 py-2 border-bottom">
        <div className="">
            <span className="me-3">{vIcon}<b>{vCaption}</b></span>
        </div>
        <div className="flex-fill">{vCenter}</div>
        {vCols}
        {vError}
        {vBottom}
        {vState}
    </div>;
}
