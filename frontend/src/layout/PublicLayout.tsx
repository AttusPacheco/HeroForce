interface PublicLayoutProps {
    title?: string;
    children: React.ReactNode;
}

export function PublicLayout({ title, children }: PublicLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-blue-600">
                        HeroForce
                    </h1>

                    <nav className="space-x-4">
                        <a href="/login" className="text-gray-600 hover:text-blue-600">
                            Login
                        </a>
                        <a
                            href="/register"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Criar conta
                        </a>
                    </nav>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-6">
                <div className="w-full max-w-md">
                    {title && (
                        <h2 className="text-2xl font-bold text-center mb-6">
                            {title}
                        </h2>
                    )}

                    {children}
                </div>
            </main>

            <footer className="bg-white border-t text-center text-sm text-gray-500 py-4">
                © {new Date().getFullYear()} HeroForce
            </footer>
        </div>
    );
}