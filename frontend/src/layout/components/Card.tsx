type Props = {
    children: React.ReactNode
}

export function Card({ children }: Props) {
    return (
        <div className="bg-neutral-50 p-6 rounded shadow">
            {children}
        </div>
    )
}