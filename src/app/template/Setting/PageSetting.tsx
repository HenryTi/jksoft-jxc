import { PageQueryMore } from "app/coms";
import { useUqApp } from "app/UqApp";
import { useModal } from "tonwa-app";
import { ReturnSearchItemSettings$page, ReturnSearchItemSettingsProps } from "uqs/UqDefault";
import { GenProps } from "app/tool";
import { PageSettingEdit } from "./PageSettingEdit";
import { GenSetting } from "./GenSetting";
import React from "react";

export function PageSetting<P extends GenSetting>({ Gen }: GenProps<P>) {
    const { openModal } = useModal();
    const uqApp = useUqApp();
    const gen = uqApp.objectOf(Gen);
    const { caption, searchItems, itemName, bizSettings, settingPhrases } = gen;
    function ViewItem({ value }: { value: ReturnSearchItemSettingsProps & { settings: { [setting: string]: any } }; }) {
        let { settings } = value;
        let { bizSettings } = gen;
        return <div className="px-3 py-2">
            <div>{JSON.stringify(value)}</div>
            <div className="d-flex align-items-center">
                {
                    bizSettings.map((v, index) => {
                        let { caption, name } = v;
                        let value = settings[name];
                        return <React.Fragment key={index}>
                            <span className="me-2">{caption ?? name}:</span>
                            {
                                value !== undefined ?
                                    <b className="fs-5">{value}</b>
                                    :
                                    <span className="text-muted small">(无)</span>
                            }
                        </React.Fragment>;
                    })
                }
            </div>
        </div>;
    }
    async function onItemClick(value: ReturnSearchItemSettings$page & { settings: { [setting: string]: any } }) {
        let ret = await openModal(<PageSettingEdit Gen={Gen} value={value} />);
        if (ret === undefined) return;
        value.settings = ret;
    }
    return <PageQueryMore header={caption}
        query={searchItems}
        param={{}}
        sortField="id"
        ViewItem={ViewItem}
        pageSize={4}
        pageMoreSize={1}
        onItemClick={onItemClick}
    >
        <div className="p-3 tonwa-bg-gray-3">{caption}</div>
        <div className="p-3 tonwa-bg-gray-2">{itemName} {caption}</div>
    </PageQueryMore>;
}