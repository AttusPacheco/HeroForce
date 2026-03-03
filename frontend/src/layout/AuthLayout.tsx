import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { logout } from '../services/auth.service';

interface AuthLayoutProps {
    children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">
                        HeroForce
                    </h1>

                    <div className="flex items-center gap-4">
                        <div className="text-sm font-medium text-gray-700">
                            {user?.name}
                        </div>
                        <div className="h-6 w-px bg-gray-300"></div>
                        <Link to="/profile" className="text-sm text-gray-600 hover:text-indigo-600 transition">
                            Meu Perfil
                        </Link>
                        <button
                            onClick={() => {
                                logout();
                                window.location.href = '/login';
                            }}
                            className="text-sm text-red-600 hover:text-red-800 transition"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            {children}

        </div>
    );
}
