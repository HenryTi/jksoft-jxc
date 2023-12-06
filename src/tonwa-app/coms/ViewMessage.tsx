interface ViewMessageProps {
    message: string | JSX.Element;
    children: React.ReactNode;
}
export function ViewMessage({ message, children }: ViewMessageProps) {
    return <div className="border border-danger rounded mx-auto m-3 w-max-30c bg-white ">
        <div className="p-4 border-bottom">{message}</div>
        <div className="p-3 text-center">
            {children}
        </div>
    </div>
}

