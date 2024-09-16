import React from "react";
import { Page, useModal } from "tonwa-app";
import { FA, Sep } from "tonwa-com";
import { PageCmdClearCode, PageCmdClearPend } from "./PageCmdClear";
import { PageCmdLog } from "./PageLog";

interface Cmd {
    icon: string;
    iconColor: string;
    caption: string;
    onAct: () => void;
}

export function PageAdmin() {
    const modal = useModal();
    const cmdArr: Cmd[] = [
        {
            icon: 'list',
            iconColor: 'text-info',
            caption: '日志清单',
            onAct: () => {
                modal.open(<PageCmdLog />);
            }
        },
        {
            icon: 'trash',
            iconColor: 'text-danger',
            caption: '清空代码',
            onAct: () => {
                modal.open(<PageCmdClearCode />);
            }
        },
        {
            icon: 'trash',
            iconColor: 'text-danger',
            caption: '清空待处理',
            onAct: () => {
                modal.open(<PageCmdClearPend />);
            }
        },
    ];
    return <Page header="管理">
        {cmdArr.map((v, index) => {
            return <React.Fragment key={index}>
                <VCmd {...v} />
                <Sep />
            </React.Fragment>;
        })}
    </Page>;
}

function VCmd({ icon, iconColor, caption, onAct }: Cmd) {
    return <div className="px-3 py-3 d-flex align-items-center cursor-pointer" onClick={onAct}>
        <FA name={icon} className={'mx-3 ' + (iconColor ?? 'text-primary')} fixWidth={true} />
        <span>{caption}</span>
        <div className="flex-grow-1" />
        <FA name="angle-right" />
    </div>
}
