import { useState } from 'react';
import { login } from '../services/auth.service';
import { ApiError } from '../types/api-error';
import {PublicLayout} from "../layout/PublicLayout.tsx";
import {Card} from "../layout/components/Card.tsx";
import {Input} from "../layout/components/Input.tsx";
import {Button} from "../layout/components/Button.tsx";
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const { setUser } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        try {
            const data = await login({ email, password });
            setUser(data.user);
            navigate('/dashboard');
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message.toString() || 'Erro ao autenticar');
        }
    }

    return (
        <PublicLayout>
            <Card className="w-full max-w-md space-y-4">
                <h2 className="text-xl font-bold text-center mb-5">
                    Login
                </h2>

                {error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded text-sm mb-5">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button type="submit" className="w-full">
                        Entrar
                    </Button>
                </form>
            </Card>
        </PublicLayout>
    );
}