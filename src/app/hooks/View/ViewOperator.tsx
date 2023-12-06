interface Props {
    id: number;
}

export function ViewOperator({ id }: Props) {
    return <span className={''}>
        {id}
    </span>
}
