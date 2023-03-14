import React, { ChangeEvent, useEffect, useState } from "react";
import { Sep, Spinner } from "../coms";

interface ItemProps<T> {
    value: T;
}

export interface ListPropsWithoutItems<T> {
    className?: string;
    itemKey?: string | ((item: T) => string | number);
    ViewItem?: (props: ItemProps<T>) => JSX.Element;
    sep?: JSX.Element;
    none?: JSX.Element;
    loading?: JSX.Element;
    onItemClick?: (item: T) => Promise<string | void> | string | void;
}

export interface ListProps<T> extends ListPropsWithoutItems<T> {
    items: readonly T[];
    onItemSelect?: (item: T, isSelected: boolean) => void;
}

export function List<T>(props: ListProps<T>) {
    let [showLoading, setShowLoding] = useState(false);
    let { items, className, itemKey, ViewItem: ItemView, onItemClick, onItemSelect, sep, none, loading } = props;
    className = className ?? '';
    useEffect(() => {
        // loading超过200ms，显示spinner
        setTimeout(() => {
            setShowLoding(true);
        }, 200);
    }, []);
    if (items === null) return null;
    if (items === undefined) {
        if (showLoading === false) return null;
        if (loading) return loading;
        return <Spinner className="mx-3 my-2 text-primary" />;
    }
    let len = items.length;
    if (len === 0) {
        if (none) return none;
        return <div className="mx-3 my-2 text-muted">-</div>;
    }

    ItemView = ItemView ?? DefaultViewItem;
    let renderItem: (item: T, index: number) => JSX.Element;
    function onCheckChange(item: T, evt: ChangeEvent<HTMLInputElement>): void {
        onItemSelect(item, evt.currentTarget.checked);
    }
    let onItemNav: (item: T) => void;
    if (onItemClick) {
        onItemNav = async (item: T): Promise<void> => {
            let ret = await onItemClick(item);
            if (ret) {
                // navigate(ret);
            }
        }
    }
    if (onItemSelect) {
        if (onItemNav) {
            renderItem = v => (
                <div className="d-flex">
                    <label className="ps-3 pe-2 align-self-stretch d-flex align-items-center">
                        <input type="checkbox" className="form-check-input"
                            onChange={evt => onCheckChange(v, evt)} />
                    </label>
                    <div className="flex-grow-1 cursor-pointer" onClick={() => onItemNav(v)}>
                        <ItemView value={v} />
                    </div>
                </div>
            );
        }
        else {
            renderItem = v => (
                <label className="d-flex">
                    <input type="checkbox" className="form-check-input mx-3 align-self-center"
                        onChange={evt => onCheckChange(v, evt)} />
                    <div className="flex-grow-1">
                        <ItemView value={v} />
                    </div>
                </label>
            );
        }
    }
    else {
        if (onItemNav) {
            className += ' tonwa-list-item'
        }
        renderItem = v => {
            let funcClick: any, cn: string;
            if (onItemNav) {
                funcClick = () => onItemNav(v);
                cn = 'tonwa-list-item cursor-pointer';
            }
            return <div onClick={funcClick} className={cn}>
                <ItemView value={v} />
            </div>
        };
    }

    sep = <Sep sep={sep} />;
    let funcKey: (item: T, index: number) => number | string;
    switch (typeof itemKey) {
        default:
            funcKey = (item: T, index: number) => index;
            break;
        case 'string':
            funcKey = (item: T) => (item as any)[itemKey as string];
            break;
        case 'function':
            funcKey = itemKey;
            break;
    }
    return <ul className={'m-0 p-0 ' + className}>{items.map((v, index) => {
        let key = funcKey(v, index);
        return <React.Fragment key={key}>
            {renderItem(v, index)}
            {index < len - 1 && sep}
        </React.Fragment>;
    })}</ul>;
}

function DefaultViewItem<T>(itemProps: ItemProps<T>) {
    let { value } = itemProps;
    let cn = 'px-3 py-2';
    return <div className={cn}>{JSON.stringify(value)}</div>;
}
