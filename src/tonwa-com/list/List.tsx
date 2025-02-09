import React, { ChangeEvent, useEffect, useState, JSX } from "react";
import { FA, Sep, Spinner, SpinnerSmall } from "../coms";

interface ItemProps<T> {
    value: T;
    index?: number;
}

export interface ListPropsWithoutItems<T> {
    className?: string;
    itemKey?: string | ((item: T) => string | number);
    ViewItem?: (props: ItemProps<T>) => JSX.Element;
    ViewItemHead?: (props: ItemProps<T>) => JSX.Element;
    sep?: JSX.Element;
    none?: JSX.Element;
    loading?: JSX.Element;
    onItemClick?: (item: T) => Promise<string | void> | string | void;
    itemBan?: (item: T) => string;
}

export interface ListProps<T> extends ListPropsWithoutItems<T> {
    items: readonly T[];
    onItemSelect?: (item: T, isSelected: boolean) => void;
}

export function List<T>(props: ListProps<T>) {
    let [showLoading, setShowLoding] = useState(false);
    let { items, className, itemKey, ViewItem, ViewItemHead, onItemClick, onItemSelect, sep, none, loading, itemBan } = props;
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
        return <div className="mx-3 my-2">
            <SpinnerSmall />
        </div>;
    }
    let len = items.length;
    if (len === 0) {
        if (none === undefined) {
            none = <div className="mx-3 my-2 text-muted">-</div>;
        }
        return none;
    }

    ViewItem = ViewItem ?? DefaultViewItem;

    let renderItem: (item: T, index: number, key: string) => JSX.Element;
    function onCheckChange(item: T, evt: ChangeEvent<HTMLInputElement>): void {
        onItemSelect(item, evt.currentTarget.checked);
    }
    function renderBan(item: T) {
        // let disabled: boolean;
        let banMessage: string;
        let vMessage: any;
        if (itemBan !== undefined) {
            banMessage = itemBan(item)
        }
        if (banMessage !== undefined) {
            // disabled = true;
            vMessage = <div className="text-danger small mx-3 mb-3">
                <FA name="exclamation-circle" className="me-2" />
                {banMessage}
            </div>;
        }
        else {
            // disabled = false;
        }
        return vMessage;
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
            renderItem = (v, index, key) => {
                let vBan = renderBan(v);
                return <div className="d-flex">
                    <label className="ps-3 pe-2 align-self-stretch d-flex align-items-center">
                        <input type="checkbox" className="form-check-input"
                            onChange={evt => onCheckChange(v, evt)} disabled={vBan !== undefined} />
                    </label>
                    <div className="flex-grow-1 cursor-pointer" onClick={() => onItemNav(v)}>
                        <ViewItem value={v} index={index} />
                        {vBan}
                    </div>
                </div>;
            }
        }
        else {
            renderItem = (v, index, key) => {
                let vBan = renderBan(v);
                return <div className="form-check mx-3">
                    <input type="checkbox" disabled={vBan !== undefined}
                        className="mt-2 form-check-input" id={key}
                        onChange={evt => onCheckChange(v, evt)} />
                    <label className="form-check-label w-100 ms-1" htmlFor={key}>
                        <ViewItem value={v} index={index} />
                        {vBan}
                    </label>
                </div>
            };
        }
    }
    else {
        if (onItemNav) {
            className += ' tonwa-list-item'
        }
        renderItem = (v, index) => {
            let funcClick: any, cn: string;
            let vBan = renderBan(v);
            if (onItemNav && vBan === undefined) {
                funcClick = () => onItemNav(v);
                cn = 'tonwa-list-item cursor-pointer';
            }
            return <div onClick={funcClick} className={cn}>
                <ViewItem value={v} index={index} />
                {vBan}
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
    return <>
        <ul className={'m-0 p-0 ' + className}>{items.map((v, index) => {
            let key = funcKey(v, index);
            return <React.Fragment key={key}>
                {ViewItemHead && <ViewItemHead value={v} index={index} />}
                {renderItem(v, index, key as string)}
                {index < len - 1 && sep}
            </React.Fragment>;
        })}</ul>
        {sep}
    </>;
}

function DefaultViewItem<T>(itemProps: ItemProps<T>) {
    let { value } = itemProps;
    let cn = 'px-3 py-2';
    return <div className={cn}>{JSON.stringify(value)}</div>;
}
