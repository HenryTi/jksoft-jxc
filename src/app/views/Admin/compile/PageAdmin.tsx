import React from "react";
import { Page, useModal } from "tonwa-app";
import { FA, Sep } from "tonwa-com";
import { PageCmdClear } from "./PageCmdClear";

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
            icon: 'trash',
            iconColor: 'text-danger',
            caption: '清空代码',
            onAct: () => {
                modal.open(<PageCmdClear />);
            }
        },
    ];
    return <Page header="代码管理">
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
