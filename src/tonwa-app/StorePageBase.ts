import { UqAppBase } from "./UqAppBase";

export abstract class StorePageBase<UQApp extends UqAppBase<UQS> = any, UQS = any> {
    readonly uqApp: UQApp;
    protected readonly uqs: UQS;
    constructor(uqApp: UQApp) {
        this.uqApp = uqApp;
        this.uqs = uqApp.uqs;
    }

    async init(): Promise<void> {
    }
}
