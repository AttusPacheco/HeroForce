import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {storeProject} from '../../services/projects.service';

import {Card} from "../../layout/components/Card.tsx";
import {Input} from "../../layout/components/Input.tsx";
import {Button} from "../../layout/components/Button.tsx";
import {ApiError} from "../../types/api-error.ts";
import {useAuth} from "../../auth/AuthContext.tsx";

export function CreateProject() {
    const { user } = useAuth();

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await storeProject({name, description})

            navigate('/dashboard');
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message.toString() || 'Erro ao cadastrar');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">
                        HeroForce
                    </h1>

                    <div className="text-sm text-gray-600">
                        {user?.name}
                    </div>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-6">
                <div className="w-full max-w-md">
                    <Card className="w-full max-w-md space-y-4">
                        {error && (
                            <div className="bg-red-100 text-red-700 p-2 rounded text-sm mb-5">
                                {error}
                            </div>
                        )}

                        <h2 className="text-md font-bold text-gray-800 mb-5">
                            Novo Projeto
                        </h2>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <Input
                                placeholder="Nome do projeto"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descrição
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    rows={4}
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Salvando...' : 'Salvar'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </main>
        </div>
    );
}