import { Link } from "react-router-dom";
import { useUqApp } from "app/UqApp";
import { ViewNotifyCount } from "app/tool";
import { FA, Sep } from "tonwa-com";
import { Center, centers } from "../pathes";
import { File, Folder } from "app/Biz";
import { Accordion, AccordionItem } from "react-bootstrap";
import React, { useState } from "react";

const cn = 'd-flex px-4 py-3 border-bottom align-items-center';
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
    const { sheet, atom, report, assign, tie, me, setting } = centers;
    const { bizConsole } = biz;
    let arr: Center[];
    let viewFolder: any;
    if (bizConsole === undefined) {
        arr = [sheet, atom, report, assign, tie, me, setting,];
    }
    else {
        arr = [me, setting,];
        viewFolder = <>
            <ViewFolderContent folder={bizConsole.folder} active={activeRoot} />
            <Sep />
        </>;
    }
    return <div>
        {viewFolder}
        {arr.map((v, index) => {
            const { caption, icon, iconColor, path, phrase } = v;
            function onClick() {
                uqApp.clearNotifyCount(phrase);
            }
            return <FolderLink key={index} path={path} className={cn} onClick={onClick}
                phrase={phrase} caption={caption} icon={icon} iconColor={iconColor}
            />
        })}
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
        <FA name={icon ?? 'file'} className={(iconColor ?? 'text-primary') + " me-4"} fixWidth={true} size="2x" />
        <span className="fs-larger">{caption}</span>
        <ViewNotifyCount phrase={phrase} />
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
    return <Accordion flush={true} className="" activeKey={activeKeys} onSelect={onSelect}>
        {folders.map((v, index) => <ViewFolder key={index} folder={v} index={String(index)} active={active} />)}
        {files.map((v, index) => <React.Fragment key={index}>
            {index > 0 && <Sep />}
            <ViewFile key={index} file={v} />
        </React.Fragment>)}
    </Accordion>;
}

function Folder({ icon, iconColor, caption, phrase }: FolderProps) {
    return <div>
        <FA name={icon} className={(iconColor ?? 'text-info') + " me-4"} fixWidth={true} size="2x" />
        <span className="fs-larger">{caption}</span>
        <ViewNotifyCount phrase={phrase} />
    </div>
}

function ViewFolder({ folder, index, active }: { folder: Folder; index: string, active: Active; }) {
    const { name, ui } = folder;
    let sub: Active;
    if (active !== undefined) {
        let { subs } = active;
        if (subs === undefined) {
            subs = {};
            active.subs = subs;
        }
        sub = active.subs[index];
    }
    return <AccordionItem eventKey={index} className="">
        <Accordion.Header>
            <Folder phrase={0} caption={ui?.caption ?? name}
                icon="folder-o" iconColor="text-warning" />
        </Accordion.Header>
        <Accordion.Body className="ps-5 pe-0">
            <ViewFolderContent folder={folder} active={sub} />
        </Accordion.Body>
    </AccordionItem>;
}

function ViewFile({ file }: { file: File; }) {
    const { entity: { name, ui, id, type } } = file;
    const centerDef = (centers as any)[type];
    if (centerDef === undefined) return null; //debugger;
    const { icon, iconColor, getPath } = centerDef;
    let to: string = getPath?.(id) ?? '';
    return <Link to={to}>
        <div className="d-flex py-3 pe-4">
            <FA name={icon} className={(iconColor ?? 'text-primary ') + ' px-1 ms-4 me-4'} size="2x" />
            <span className="fs-larger">{ui?.caption ?? name}</span>
            <div className="flex-grow-1"></div>
            <FA name="angle-right" className="text-secondary" />
        </div>
    </Link>
}
