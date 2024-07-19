import { useState } from "react";
import { useAtomValue } from "jotai";
import { Band, BandString, CheckAsync, FA, Form, LMR, MutedSmall, setAtomValue, stringFormat, Submit, wait } from "tonwa-com";
import { EnumSysRole, UserSite } from "tonwa-uq";
import { roleT } from "./res";
// import { GenSiteRole } from "./useSiteRole";
import { Image, Page, PageConfirm, useModal } from "tonwa-app";
// import { Biz } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { UseSiteRoleReturn } from "./useSiteRole";

interface Props {
    userSite: UserSite;
    siteRole: UseSiteRoleReturn;
}

export function ViewUser({ siteRole, userSite: userSiteInit }: Props) {
    let uqApp = useUqApp();
    let modal = useModal();
    let [userSite, setUserSite] = useState(userSiteInit);
    let { name, icon, nick, assigned } = userSite;
    let tUser = roleT('user');
    let tAdmin = roleT('admin');
    let tOwner = roleT('owner');
    let vNick: any;
    if (nick) {
        vNick = <span className="d-inline me-3">{nick}</span>;
    }

    let vAssignedUser = assigned ?
        <>
            <div>{assigned}</div>
            {
                nick ? <MutedSmall>{vNick} {tUser}: {name}</MutedSmall> : name
            }
        </>
        :
        (
            nick ? <>{vNick} <MutedSmall>{tUser}: {name}</MutedSmall></> : name
        );
    function onEdit() {
        function PageEdit() {
            let user = useAtomValue(uqApp.user);
            let { user: userId, isOwner, isAdmin, addBy } = userSite;
            let pageHeader: string;
            if (isOwner === true) pageHeader = tOwner;
            else if (isAdmin === true) pageHeader = tAdmin;
            else pageHeader = tUser;
            async function onSubmit(data: any): Promise<[name: string, err: string][] | string[] | string | void> {
                let { assigned } = data;
                await siteRole.addUser(userId, assigned);
                setUserSite({ ...userSite, assigned });
                modal.close();
                return;
            }
            function ButtonRemove() {
                let admin: EnumSysRole;
                let caption: string;
                if (isOwner === true) {
                    if (addBy === user.id) {
                        admin = EnumSysRole.owner;
                        caption = tOwner;
                    }
                    else {
                        return null;
                    }
                }
                else if (isAdmin === true) {
                    admin = EnumSysRole.admin;
                    caption = tAdmin;
                }
                else {
                    admin = EnumSysRole.user;
                    caption = tUser;
                }
                async function onRemove() {
                    let message = stringFormat(roleT('userReallyDelete'), caption, userSite.name);
                    let ret = await modal.open(<PageConfirm header="确认" message={message} yes="删除" no="不删除" />);
                    if (ret === true) {
                        await siteRole.delAdmin(userId, admin);
                        modal.close();
                    }
                }
                let btnCaption = stringFormat(roleT('deleteThe'), caption);
                return <button onClick={onRemove} className="btn btn-sm btn-outline-primary">
                    {btnCaption}
                </button>;
            }
            function Roles() {
                if (isOwner === true || isAdmin === true) return null;
                const cnLabel = ' my-2 me-4 w-min-6c ';
                const cnInput = ' form-check-input ';
                const cnInputGap = ' me-2 ';
                let { biz } = uqApp;
                let { rolesAtom } = userSiteInit;
                let roles = useAtomValue(rolesAtom);
                return <Band label={'角色'}>
                    {biz.roles.map((v, index) => {
                        let { name, caption, phrase } = v;
                        let defaultChecked = roles?.findIndex(r => r === phrase) >= 0;
                        async function onCheckChanged(name: string, checked: boolean) {
                            await siteRole.setUserRole(userId, phrase, checked);
                            if (checked === true) {
                                roles.push(phrase);
                            }
                            else {
                                let index = roles.findIndex(v => v === phrase);
                                if (index >= 0) roles.splice(index, 1);
                            }
                            setAtomValue(rolesAtom, [...roles]);
                        }
                        return <CheckAsync key={index}
                            onCheckChanged={onCheckChanged}
                            className={cnLabel} inputClassName={cnInput} gapClassName={cnInputGap}
                            defaultChecked={defaultChecked} name={name}
                        >
                            {caption ?? name}
                        </CheckAsync>;
                    })}
                </Band>;
            }
            return <Page header={pageHeader}>
                <Form values={userSite} className="mx-3">
                    <Band>
                        <LMR className="p-3 tonwa-bg-gray-2">
                            <div>{vAssignedUser}</div>
                            <ButtonRemove />
                        </LMR>
                    </Band>
                    <BandString name="assigned" label={roleT('assigned')} />
                    <Band contentContainerClassName=" my-3">
                        <Submit onSubmit={onSubmit}><div className='mx-5'>{roleT('save')}</div></Submit>
                    </Band>

                    <div className="mt-5 mb-3">
                        <Roles />
                    </div>
                </Form>
            </Page>;
        }
        modal.open(<PageEdit />);
    }
    return <LMR className="my-2">
        <Image className="w-2c h-2c me-3" src={icon} />
        <div>
            {vAssignedUser}
        </div>
        <div className="cursor-pointer text-info" onClick={onEdit}>
            <FA name="pencil" />
        </div>
    </LMR>;
}
