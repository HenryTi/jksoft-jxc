export class UI {
    readonly caption: string;
    readonly icon: string;
    readonly iconColor: string;

    constructor(ui: any, uiDefault?: any) {
        if (ui !== undefined) {
            const { caption: uiCaption, icon: uiIcon } = ui;
            if (uiCaption !== undefined) this.caption = uiCaption;
            if (uiIcon !== undefined) {
                let parts = (uiIcon as string).split(',');
                this.icon = parts[0].trim();
                if (parts.length > 1) {
                    this.iconColor = parts[1].trim();
                }
            }
        }
        if (uiDefault === undefined) return;
        for (let i in uiDefault) {
            if ((this as any)[i] === undefined) {
                (this as any)[i] = uiDefault[i];
            }
        }
    }
}
