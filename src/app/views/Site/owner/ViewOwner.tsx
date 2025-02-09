import { FA, LMR } from "tonwa-com";
import { propertyOf, UserSite } from "tonwa-uq";
import { ButtonAddUser } from "../ButtonAddUser";
import { Me } from "../Me";
import { roleT } from "../res";
import { UseSiteRoleReturn } from "../useSiteRole";
import { ViewUser } from "../ViewUser";
import { ListEdit, ListEditContext, None, Page, useModal, useUqAppBase } from "tonwa-app";
import { useAtomValue } from "jotai";
import { consts } from "../consts";

export function ViewOwner({ siteRole }: { siteRole: UseSiteRoleReturn; }) {
    let uqApp = useUqAppBase();
    let modal = useModal();
    let user = useAtomValue(uqApp.user);
    // let store = uqApp.objectOf(SiteRole);
    let { onOwnerAdded } = siteRole;
    let unitRoles = useAtomValue(siteRole.unitRoles);
    let { owners } = unitRoles;

    let listEditContext = new ListEditContext<UserSite>(owners, propertyOf<UserSite>('site'));
    let tOwner = roleT('owner');

    function ViewItem({ value }: { value: UserSite }) {
        function iQuitOwner() {
            function PageIQuitOwner() {
                async function confirmQuit() {
                    await siteRole.quitOwner();
                    modal.close();
                    modal.close();
                }
                return <Page header={tOwner}>
                    <div className="w-20c rounded border px-3 py-4 mx-auto my-3 text-center">
                        <LMR>
                            <FA name="question-circle-o" size="3x" className="text-danger me-3" />
                            <div className="text-start">
                                <b>{roleT('ownerReallyQuit')}</b>
                                <br />
                                <small className="text-muted">{roleT('ownerLost')}</small>
                                <br />
                                <br />
                                <button className="btn btn-outline-primary" onClick={confirmQuit}>{roleT('ownerConfirmQuit')}</button>
                            </div>
                            <span></span>
                        </LMR>
                    </div>
                </Page>;
            }
            modal.open(<PageIQuitOwner />);
        }
        if (value.user === user.id) {
            let vIQuitOwner: any;
            if (owners.length > 1) {
                vIQuitOwner = <span className="cursor-pointer" onClick={iQuitOwner}>
                    <FA name="times" className="text-info" />
                </span>;
            }
            return <Me right={vIQuitOwner} />;
        }
        return <div className="px-3 py-2">
            <ViewUser userSite={value} siteRole={siteRole} />
        </div>;

    }

    return <>
        <div className={consts.cnCard}>
            <div className="card-header pe-0 py-0">
                <LMR className="align-items-center">
                    <span>{tOwner}</span>
                    <ButtonAddUser onUserAdded={onOwnerAdded} />
                </LMR>
            </div>
            <ListEdit context={listEditContext} none={<None />} ViewItem={ViewItem} />
        </div>
        <ul className="small text-muted mt-2 mb-5 mx-3">
            <li>{roleT("ownerMemo1")}</li>
            <li>{roleT("ownerMemo2")}</li>
        </ul>
    </>;
}
