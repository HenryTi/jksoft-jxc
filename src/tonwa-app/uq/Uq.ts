import {
    UqMan, Uq as UqCore
} from "tonwa-uq";

enum UqError {
    unexist_entity = 'UnexistEntity',
    unexist_uq = 'UnexistUq'
};

export class Uq {
    private $_uqMan: UqMan;
    private $_uqSql: UqCore;
    constructor(uqMan: UqMan) {
        this.$_uqMan = uqMan;
        this.$_uqSql = this.$_createUqSqlProxy();
    }

    $_createProxy() {
        let ret = new Proxy(this.$_uqMan.entities, {
            get: (target, key, receiver) => {
                if (key === 'SQL') {
                    return this.$_uqSql;
                }
                let lk = (key as string).toLowerCase();
                if (lk[0] === '$') {
                    switch (lk) {
                        case '$': return this;
                        // case '$name': return this.$_uqMan.name;
                    }
                }
                let ret = target[lk];
                if (ret !== undefined) return ret;
                let func = (this.$_uqMan as any)[key];
                if (func !== undefined) return func;
                func = (this as any)[key];
                if (func !== undefined) return func;
                this.errUnexistEntity(String(key));
            },
        });
        return ret;
    }

    private $_createUqSqlProxy(): UqCore {
        let ret = new Proxy(this.$_uqMan, {
            get: (target, key, receiver) => {
                let ret = (target as any)['$' + (key as string)];
                if (ret !== undefined) return ret;
                this.errUnexistEntity(String(key));
            }
        });
        return ret as unknown as UqCore;
    }

    private errUnexistEntity(entity: string) {
        let message = `entity ${this.$_uqMan.name}.${entity} not defined`;
        let err = new Error(message);
        err.name = UqError.unexist_entity;
        this.$_uqMan.clearLocalEntites();
        throw err;
    }
    /*
        protected IDRender = (id: number, render?: (value: any) => JSX.Element): JSX.Element => {
            if (id === undefined || id === null) return null;
            return React.createElement(observer(() => {
                let ret = this.$_uqMan.idCache.getValue(id);
                if (ret === undefined) {
                    return React.createElement('span', { props: { className: 'text-muted' }, children: ['id=' + id] });
                }
                let { $type } = ret as any;
                if (!$type) return this.renderIDUnknownType(id);
                let IDType = this.$_uqMan.ids[$type];
                if (!IDType) return this.renderIDUnknownType(id);
                return (render ?? (IDType as any).render)(ret);
            }));
        }
    
        protected IDV = <T extends object>(id: number): T => {
            let ret = this.$_uqMan.idCache.getValue(id);
            return ret as T;
        }
    
        private renderIDUnknownType(id: number) {
            return React.createElement('span', { props: { className: 'text-muted' }, children: [`id=${id} type undefined`] });
        }
    
        protected IDLocalV = <T extends object>(id: number): T => {
            return this.IDV(-id);
        }
    
        protected IDLocalRender = (id: number, render?: (value: any) => JSX.Element): JSX.Element => {
            if (id === undefined || id === null) return null;
            return this.IDRender(-id, render);
        }
    */
}
