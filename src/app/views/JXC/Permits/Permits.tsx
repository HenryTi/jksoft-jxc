import { Biz } from "app/Biz";
import { EntityPermit, EntityRole } from "app/Biz/EntityPermit";
import { Permit } from "app/Site";
import { useUqApp } from "app/UqApp";
import { useAtomValue } from "jotai";
import { Route } from "react-router-dom";
import { Page, ViewUser } from "tonwa-app";
import { FA, List, Sep } from "tonwa-com";

export const pathPermits = 'permits';

function PagePermits() {
    const uqApp = useUqApp();
    const user = useAtomValue(uqApp.user);
    const biz = uqApp.objectOf(Biz);
    const { roles, permits } = biz;
    const { uqUnit: { userUnit } } = uqApp;
    const permitColl = userUnit.permits;
    function Check({ phrase }: { phrase: string; }) {
        let cn: string, icon: string;
        if (permitColl[phrase] === true) {
            cn = 'text-success';
            icon = 'check';
        }
        else {
            cn = 'text-danger';
            icon = 'times';
        }
        return <FA name={icon} className={'me-3 ' + cn} />;
    }
    function ButtonPermit({ permit, caption }: { permit: string; caption: string }) {
        function onClick() {
            alert('click ' + caption);
        }
        return <Permit permit={permit}>
            <button className="btn btn-outline-primary" onClick={onClick}>{caption} 按钮</button>
        </Permit>;
    }
    function ViewRole({ value }: { value: EntityRole; }) {
        let { phrase, name, caption } = value;
        return <div className="px-3 py-2 text-primary">
            <div>
                <Check phrase={phrase} />
                角色 {phrase} {name}  {caption}
            </div>
            <div className="ps-4 py-1">
                <ButtonPermit permit={phrase} caption={caption ?? name} />
            </div>
        </div>
    }
    function ViewPermit({ value }: { value: EntityPermit; }) {
        let { phrase, name, caption, items, permits } = value;
        function ViewItem({ value, caption }: { value: string; caption?: string; }) {
            return <div className="ps-5 py-2">
                <div>
                    <Check phrase={phrase} />
                    {caption && <b>{caption}</b>} {value}
                </div>
                <div className="ps-4 py-1">
                    <ButtonPermit permit={phrase} caption={caption ?? name} />
                </div>
            </div>
        }
        function ViewPermitItem({ value }: { value: string; }) {
            return <ViewItem value={value} />
        }
        function ViewImportPermit({ value }: { value: string; }) {
            return <ViewItem value={value} caption="许可" />
        }
        return <div className="px-3 py-2 text-success">
            许可 {phrase} {name}  {caption}
            <List items={items} ViewItem={ViewPermitItem} />
            {permits.length > 0 && <List items={permits} ViewItem={ViewImportPermit} />}
        </div>
    }
    return <Page header="权限演示">
        <div>
            <div className="p-3">
                <ViewUser user={user} />
            </div>
            <List items={roles} ViewItem={ViewRole} />
            <Sep />
            <List items={permits} ViewItem={ViewPermit} />
        </div>
    </Page>
}

export const routePermits = <>
    <Route path={pathPermits} element={<PagePermits />} />
</>;
