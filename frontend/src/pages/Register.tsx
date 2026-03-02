import { useState } from 'react';
import { register } from '../services/auth.service';
import { ApiError } from '../types/api-error';
import {PublicLayout} from "../layout/PublicLayout.tsx";
import {Input} from "../layout/components/Input.tsx";
import {Card} from "../layout/components/Card.tsx";
import {Button} from "../layout/components/Button.tsx";

export function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [character, setCharacter] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            await register({ name, character, email, password });
            setSuccess('Cadastro realizado com sucesso. Você já pode fazer login.');
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message.toString() || 'Erro ao cadastrar');
        }
    }

    return (
        <PublicLayout>
            <Card className="w-full max-w-md space-y-4">
                <h2 className="text-xl font-bold text-center mb-5">
                    Cadastro de Herói
                </h2>

                {error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded text-sm mb-5">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 text-green-700 p-2 rounded text-sm mb-5">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Input
                        placeholder="Seu Personagem"
                        value={character}
                        onChange={(e) => setCharacter(e.target.value)}
                    />

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
                        Cadastrar
                    </Button>
                </form>
            </Card>
        </PublicLayout>
    );
}