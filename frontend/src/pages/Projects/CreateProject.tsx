import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { storeProject } from '../../services/projects.service';
import { ApiError } from "../../types/api-error.ts";

import { Card } from "../../layout/components/Card.tsx";
import { Input } from "../../layout/components/Input.tsx";
import { Button } from "../../layout/components/Button.tsx";
export function CreateProject() {
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
            await storeProject({ name, description })

            navigate('/dashboard');
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message.toString() || 'Erro ao cadastrar');
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
                        <h2 className="text-2xl font-bold text-gray-800">
                            Novo Projeto
                        </h2>
                        {error && (
                            <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nome do Projeto
                                </label>
                                <Input
                                    placeholder="Nome do projeto"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descrição
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Descreva brevemente o objetivo do projeto..."
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    rows={4}
                                />
                            </div>

                            <div className="pt-4 flex justify-end">
                                <div className="w-1/2">
                                    <Button type="submit" disabled={loading || !name.trim()}>
                                        {loading ? 'Criando...' : 'Criar Projeto'}
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