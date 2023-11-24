import { UIStyle } from "app/ui";
import { Entity } from "./Entity";

export class EntityConsole extends Entity {
    folder: Folder;
    coll: any = {};

    protected fromSwitch(i: string, val: any): void {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'folder': this.folder = this.buildFolder(val); break;
        }
    }

    private buildFolder(val: any) {
        let folders: Folder[] = [];
        let files: File[] = [];
        let { name, ui, folders: foldersVal, files: filesVal } = val;
        for (let folderVal of foldersVal) {
            folders.push(this.buildFolder(folderVal));
        }
        files = (filesVal).map((v: any) => {
            const { id, ui } = v;
            return {
                ui,
                entity: this.biz.entityFromId(id),
            }
        });
        let ret: Folder = {
            name,
            ui,
            folders,
            files,
        };
        return ret;
    }
}

export interface Folder {
    name: string;
    ui: any;
    folders: Folder[];
    files: File[];
}

export interface File {
    entity: Entity;
    ui: Partial<UIStyle>;
}
