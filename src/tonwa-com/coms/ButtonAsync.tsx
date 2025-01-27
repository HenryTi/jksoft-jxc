import React, { MouseEvent, MouseEventHandler, ReactNode, useRef } from "react";
import { useEffect, JSX, useState } from "react";
import { ComAsync } from "./ComAsync";

interface Props extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    children: React.ReactNode;
    tag?: string;
    overtime?: number;
}

export function ButtonAsync(props: { onClick: (evt: MouseEvent<HTMLButtonElement>) => Promise<void> } & Props): JSX.Element {
    const [isWaiting, setIsWaiting] = useState<boolean>(false);
    let { children, onClick, tag, overtime } = props;
    let isMounted = useRef<boolean>(false);
    let newOnClick: MouseEventHandler<HTMLButtonElement> | undefined;
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        }
    });
    if (onClick) {
        newOnClick = async (evt: MouseEvent<HTMLButtonElement>) => {
            if (overtime !== undefined) {
                setTimeout(() => {
                    setIsWaiting(false);
                }, overtime * 1000);
            }
            setIsWaiting(true);
            try {
                await onClick(evt);
            }
            catch (err) {
                console.error(err);
                throw err;
            }
            finally {
                if (isMounted.current === true) {
                    setIsWaiting(false);
                }
            }
        };
    }
    if (isWaiting === true) {
        let { className } = props;
        className = (className ?? '') + ' position-relative';
        return <button {...props} disabled={true} className={className}>
            {children}
            <ComAsync isWaiting={true} />
        </button>;
    }
    else if (tag !== undefined) {
        return React.createElement(tag, { ...props, onClick: newOnClick }, children);
    }
    else {
        return <button {...props} onClick={newOnClick}>{children}</button>;
    }
}

export function ButtonSubmitAsync({ className, isSubmiting, children, disabled }: { className: string; isSubmiting: boolean; children: ReactNode; disabled?: boolean; }) {
    return <button type="submit" disabled={isSubmiting || (disabled ?? false)} className={(className ?? '') + ' position-relative'}>
        {children}
        {isSubmiting && <ComAsync isWaiting={true} />}
    </button>;
}

