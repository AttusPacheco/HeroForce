type Props = React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ children, ...props }: Props) {
    return (
        <button
            {...props}
            className="
        w-full py-2 rounded font-semibold
        bg-indigo-600 hover:bg-indigo-700
        text-white transition
      "
        >
            {children}
        </button>
    )
}