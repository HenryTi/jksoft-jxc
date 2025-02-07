import { Link } from "react-router-dom";
import { useUqApp } from "app/UqApp";
import { ViewNotifyCount } from "app/tool";
import { FA, Sep } from "tonwa-com";
import { CenterItem, centers } from "../center";
import { EntitySheet, File, Folder, RowColsSm, to62 } from "tonwa";
import { Accordion, AccordionItem } from "react-bootstrap";
import React, { useState } from "react";
import { UI } from "app/ui";
import { BizPhraseType } from "uqs/UqDefault";

const cn = ' d-flex px-4 py-3 border-bottom align-items-center ';
const fs = ' ';
const iconSize = '';
interface Active {
    name: string;
    open: boolean;
    subs: { [name: string]: Active };
}
const activeRoot: Active = {
    name: '$',
    open: true,
    subs: {},
};
export function ViewConsole() {
    const uqApp = useUqApp();
    const { biz } = uqApp;
    const { editing, atom, report, assign, tie, io, users, me, setting } = centers;
    const baseArr = [io, users, me, setting];
    const { bizConsole, errorLogs } = biz;
    if (errorLogs !== undefined) {
        return <ViewBizLogErrors errorLogs={errorLogs} />;
    }

    let arr: CenterItem[];
    let viewFolder: any, viewEditing: any;
    if (bizConsole === undefined) {
        arr = [atom, editing, report, assign, tie, ...baseArr];
    }
    else {
        arr = [...baseArr];
        viewEditing = <ViewFolderLink center={editing} />;
        viewFolder = <>
            <ViewFolderContent folder={bizConsole.folder} active={activeRoot} />
            <Sep />
        </>;
    }
    function ViewFolderLink({ center }: { center: CenterItem; }) {
        const { caption, icon, iconColor, path, phrase } = center;
        function onClick() {
            uqApp.clearNotifyCount(phrase);
        }
        return <FolderLink path={path} className={cn} onClick={onClick}
            phrase={phrase} caption={caption} icon={icon} iconColor={iconColor}
        />
    }
    return <div>
        {viewFolder}
        {viewEditing}
        {arr.map((v, index) => <ViewFolderLink key={index} center={v} />)}
        <div className="container-fluid">
            <RowColsSm>
                {
                    biz.sheets.map(v => <Link key={v.id}
                        to={`test-mvc-sheet/${to62(v.id)}`}
                        className={cn} onClick={undefined}>
                        {v.caption}
                    </Link>)
                }
            </RowColsSm>
        </div>
    </div>;
}
interface FolderProps {
    icon: string;
    iconColor: string;
    caption: string;
    phrase: number;
}
interface FolderLinkProps extends FolderProps {
    path: string;
    className: string;
    onClick: () => void;
}
function FolderLink({ path, className, icon, iconColor, onClick, caption, phrase }: FolderLinkProps) {
    return <Link to={path} className={className} onClick={onClick}>
        <FA name={icon ?? 'file'} className={(iconColor ?? 'text-primary') + " me-4"} fixWidth={true} size={iconSize} />
        <span className={fs}>{caption}</span>
        <div className="ms-3">
            <ViewNotifyCount phrase={phrase} />
        </div>
        <div className="flex-grow-1"></div>
        <FA name="angle-right" className="text-secondary" />
    </Link>
}

function ViewFolderContent({ folder, active }: { folder: Folder; active: Active; }) {
    const { folders, files } = folder;
    let [activeKeys, setActiveKeys] = useState<string[]>(getActiveKeys());
    function getActiveKeys() {
        let ks: string[] = [];
        if (active !== undefined) {
            let { subs } = active;
            if (subs === undefined) {
                subs = {};
                active.subs = subs;
            }
            for (let i in subs) {
                if (subs[i].open === true) ks.push(i);
            }
        }
        return ks;
    }
    function onSelect(eventKey: string | string[] | null, event: Object) {
        if (active === undefined) return;
        function setOpen(k: string) {
            let sub = active.subs[k];
            if (sub === undefined) {
                active.subs[k] = sub = {
                    name: undefined,
                    open: true,
                    subs: {},
                }
            }
            else {
                sub.open = !sub.open;
            }
        }
        if (eventKey === null) {

        }
        else if (Array.isArray(eventKey) === true) {
            for (let k of eventKey) setOpen(k);
        }
        else {
            setOpen(eventKey as string);
        }
        let ks = getActiveKeys();
        setActiveKeys(ks);
    }
    return <Accordion flush={true} className="">
        {folders.map((v, index) => <ViewFolder key={index} folder={v} index={String(index)} active={active} />)}
        {files.flatMap((v, index) => {
            let { entity: { name } } = v;
            if (name[0] === '$') return [];
            return [<React.Fragment key={index}>
                {index > 0 && <Sep />}
                <ViewFile key={index} file={v} />
            </React.Fragment>];
        })}
    </Accordion>;
}

function FolderHeader({ icon, iconColor, caption, phrase }: FolderProps) {
    return <div className="d-flex align-items-center">
        <FA name={icon} className={(iconColor ?? 'text-info') + " ms-1 me-4"} fixWidth={true} size={iconSize} />
        <span className={fs}>{caption}</span>
        <div className="ms-3">
            <ViewNotifyCount phrase={phrase} />
        </div>
    </div>
}

function ViewFolder({ folder, index, active }: { folder: Folder; index: string, active: Active; }) {
    const { name, ui: uiDef } = folder;
    let sub: Active;
    if (active !== undefined) {
        let { subs } = active;
        if (subs === undefined) {
            subs = {};
            active.subs = subs;
        }
        sub = active.subs[index];
    }
    let ui = new UI(uiDef, {
        icon: 'folder-o',
        iconColor: 'text-warning',
        caption: name,
    });
    return <AccordionItem eventKey={index} className="">
        <Accordion.Header>
            <FolderHeader phrase={0} caption={ui.caption}
                icon={ui.icon} iconColor={ui.iconColor} />
        </Accordion.Header>
        <Accordion.Body className="ps-5 pe-0 text-dark">
            <ViewFolderContent folder={folder} active={sub} />
        </Accordion.Body>
    </AccordionItem>;
}

function ViewFile({ file }: { file: File; }) {
    const { ui: uiDef, entity } = file;
    const { name, id, type, bizPhraseType } = entity;
    const centerDef = (centers as any)[type];
    if (centerDef === undefined) return null; //debugger;
    const { icon, iconColor, getPath } = centerDef;
    let to: string = getPath?.(id) ?? '';
    let ui = new UI(uiDef, {
        caption: name,
        iconColor: iconColor ?? 'text-primary',
        icon,
    });
    let vNotifyCount: any;
    if (bizPhraseType === BizPhraseType.sheet) {
        let entitySheet = entity as EntitySheet;
        vNotifyCount = <div className="position-absolute" style={{ right: "0.6rem", top: "-0.5rem" }}>
            <ViewNotifyCount phrase={entitySheet.coreDetail?.pend?.id} />
        </div>;
    }
    return <Link to={to}>
        <div className="d-flex py-2 pe-4 align-items-center text-dark">
            <div className="position-relative">
                <FA name={ui.icon} className={ui.iconColor + ' px-1 ms-4 me-4'} size={iconSize} />
                {vNotifyCount}
            </div>
            <span className={fs}>{ui.caption}</span>
            <div className="flex-grow-1"></div>
            <FA name="angle-right" className="text-secondary" />
        </div>
    </Link>
}

function ViewBizLogErrors({ errorLogs }: { errorLogs: string[]; }) {
    return <div className="p-3">
        <div className="mb-3 ">
            <FA name="exclamation-circle" className="me-3 text-danger" />
            <span className="text-primary">业务代码编译错误</span>
        </div>
        <div>{errorLogs.map((v, index) => <pre key={index}>{v}</pre>)}</div>
    </div>;
}