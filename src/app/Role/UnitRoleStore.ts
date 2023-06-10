import { EnumSysRole, UnitRoles, UqUnit } from "tonwa-uq";
import { Gen } from "app/tool";
import { atom } from "jotai";
import { setAtomValue } from "tonwa-com";
import { UqApp } from "app/UqApp";

export class UnitRoleStore extends Gen {
    readonly uqUnit: UqUnit;
    readonly unitRoles = atom({} as UnitRoles);

    constructor(uqApp: UqApp) {
        super(uqApp);
        this.uqUnit = uqApp.uqUnit;
    }

    async init() {
        try {
            let ret = await this.uqUnit.loadUnitUsers();
            if (ret === undefined) return;
            setAtomValue(this.unitRoles, ret);
        }
        catch (err) {
            console.error(err);
        }
    }

    onAdminChanged: () => Promise<void>;

    private reloadAdmin = async () => {
        await this.onAdminChanged?.();
        await this.init();
    }

    onAdminAdded = async (userId: number) => {
        let admin: EnumSysRole = EnumSysRole.admin;
        await this.uqUnit.addAdmin(userId, admin, undefined);
        this.reloadAdmin();
    }

    onOwnerAdded = async (userId: number) => {
        let admin: EnumSysRole = EnumSysRole.owner | EnumSysRole.admin;
        await this.uqUnit.addAdmin(userId, admin, undefined);
        this.reloadAdmin();
    }

    quitOwner = async () => {
        await this.uqUnit.quitOwner();
        await this.reloadAdmin();
    }

    delAdmin = async (userId: number, admin: EnumSysRole) => {
        await this.uqUnit.delAdmin(userId, admin);
        this.reloadAdmin();
    }
}
