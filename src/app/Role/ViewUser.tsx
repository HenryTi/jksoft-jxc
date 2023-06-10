import { useState } from "react";
import { useAtomValue } from "jotai";
import { Band, BandString, FA, Form, LMR, MutedSmall, stringFormat, Submit } from "tonwa-com";
import { EnumSysRole, UserUnit } from "tonwa-uq";
import { roleT } from "./res";
import { UnitRoleStore } from "./UnitRoleStore";
import { Image, Page, PageConfirm, useModal, useUqAppBase } from "tonwa-app";

interface Props {
    userUnit: UserUnit;
    // onAssignChanged: (assigned: string) => Promise<void>;
    // pageHeader: string;
    // onAdminChanged: OnAdminChanged;
}

export function ViewUser({ userUnit: userUnitInit }: Props) {
    let uqApp = useUqAppBase();
    let { openModal, closeModal } = useModal();
    let store = uqApp.objectOf(UnitRoleStore);
    let { uqUnit } = store;
    let [userUnit, setUserUnit] = useState(userUnitInit);
    let { name, icon, nick, assigned } = userUnit;
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
            let { user: userId, isOwner, isAdmin, addBy } = userUnit;
            let pageHeader: string;
            if (isOwner === true) pageHeader = tOwner;
            else if (isAdmin === true) pageHeader = tAdmin;
            else pageHeader = tUser;
            async function onSubmit(data: any): Promise<[name: string, err: string][] | string[] | string | void> {
                let { assigned } = data;
                await uqUnit.addUser(userId, assigned);
                setUserUnit({ ...userUnit, assigned });
                closeModal();
                return;
            }
            function ButtonRemove({ admin }: { admin: EnumSysRole; }) {
                let caption: string;
                //let adminFlag: 1 | 2;
                if (admin === EnumSysRole.owner) {
                    caption = tOwner;
                    // adminFlag = 2;
                }
                else {
                    caption = tAdmin;
                    //adminFlag = 1;
                }
                async function onRemove() {
                    let message = stringFormat(roleT('userReallyDelete'), caption, userUnit.name);
                    let ret = await openModal(<PageConfirm header="确认" message={message} yes="单据作废" no="不作废" />);
                    if (ret === true) {
                        await store.delAdmin(userId, admin);
                        closeModal();
                    }
                }
                let btnCaption = stringFormat(roleT('deleteThe'), caption);
                return <button onClick={onRemove} className="btn btn-sm btn-outline-primary">
                    {btnCaption}
                </button>;
            }
            let btnRemove: any;
            if (isOwner === true) {
                if (addBy === user.id) {
                    btnRemove = <ButtonRemove admin={EnumSysRole.owner} />;
                }
            }
            else if (isAdmin === true) {
                btnRemove = <ButtonRemove admin={EnumSysRole.admin} />;
            }

            return <Page header={pageHeader}>
                <LMR className="mb-3 p-3 border-bottom tonwa-bg-gray-1">
                    <div>{vAssignedUser}</div>
                    <span>{btnRemove}</span>
                </LMR>
                <Form values={userUnit} className="m-3">
                    <BandString name="assigned" label={roleT('assigned')} />
                    <Band contentContainerClassName="text-center my-3">
                        <Submit onSubmit={onSubmit}><div className='mx-5'>{roleT('save')}</div></Submit>
                    </Band>
                </Form>
            </Page>;
        }
        openModal(<PageEdit />);
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
