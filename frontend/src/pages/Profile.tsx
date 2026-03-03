import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';
import { getUser, updateUser } from '../services/users.service';

import { Card } from '../layout/components/Card';
import { Input } from '../layout/components/Input';
import { Button } from '../layout/components/Button';

export function Profile() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [character, setCharacter] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (user) {
            loadUserData();
        }
    }, [user]);

    async function loadUserData() {
        try {
            if (!user?.id) return;
            const data = await getUser(user.id);
            setName(data.name || '');
            setCharacter(data.character || '');
        } catch (err) {
            console.error(err);
            setError('Erro ao carregar dados do usuário');
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (password && password !== confirmPassword) {
            return setError('As senhas não coincidem.');
        }

        try {
            setLoading(true);
            const payload: any = { name, character };
            if (password) {
                payload.password = password;
            }

            const updatedUser = await updateUser(user!.id, payload);

            setUser({ ...user, ...updatedUser });
            localStorage.setItem('user', JSON.stringify({ ...user, ...updatedUser }));

            setSuccessMessage('Perfil atualizado com sucesso!');
            setPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao atualizar perfil.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex-1 flex justify-center px-6 py-8 w-full">
            <div className="w-full max-w-lg space-y-6">
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                        ← Voltar ao Dashboard
                    </button>
                </div>

                <Card>
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">Editar Perfil</h2>
                        {error && (
                            <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
                                {error}
                            </div>
                        )}

                        {successMessage && (
                            <div className="bg-green-100 text-green-700 p-3 rounded text-sm">
                                {successMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nome
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Seu nome completo"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Herói
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Sua classe de herói"
                                    value={character}
                                    onChange={(e) => setCharacter(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="border-t border-gray-200 pt-6 mt-6">
                                <h3 className="text-md font-bold text-gray-800 mb-2">Alterar Senha</h3>
                                <p className="text-sm text-gray-500 mb-4">Preencha apenas se desejar alterar sua senha atual.</p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nova Senha
                                        </label>
                                        <Input
                                            type="password"
                                            placeholder="Sua nova senha"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Confirmar Nova Senha
                                        </label>
                                        <Input
                                            type="password"
                                            placeholder="Confirme sua nova senha"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <div className="w-1/2">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </Card>
            </div>
        </main>
    );
}
