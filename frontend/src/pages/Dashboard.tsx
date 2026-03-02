import {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

import {useAuth} from '../auth/AuthContext';
import {getProjects, getProjectStats, Project} from '../services/projects.service';

import {Card} from '../layout/components/Card';
import {StatusBadge} from "../layout/components/StatsBadge.tsx";
import {ProgressBar} from "../layout/components/ProgressBar.tsx";

export function Dashboard() {
    const { user } = useAuth();

    const [projects, setProjects] = useState<Project[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        loadData();
    }, [page, statusFilter]);

    async function loadData() {
        try {
            setLoading(true);

            const [projectsResponse, statsResponse] = await Promise.all([
                getProjects(page, 6, statusFilter),
                getProjectStats(),
            ]);

            setProjects(projectsResponse.data);
            setStats(statsResponse);
        } finally {
            setLoading(false);
        }
    }

    function truncateString(text: string, maxLength: number): string {
        if (text.length <= maxLength) return `${text}...`;
        if (maxLength <= 3) return '.'.repeat(maxLength);

        return text.slice(0, maxLength - 3) + '...';
    }

    return (
        <div className="min-h-screen bg-gray-100">
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

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <p className="text-sm text-gray-500">
                            Projetos Ativos
                        </p>
                        <p className="text-2xl font-semibold text-gray-800">
                            {stats?.total ?? 0}
                        </p>
                    </Card>

                    <Card>
                        <p className="text-sm text-gray-500">
                            Em Andamento
                        </p>
                        <p className="text-2xl font-semibold text-gray-800">
                            {stats?.inProgress ?? 0}
                        </p>
                    </Card>

                    <Card>
                        <p className="text-sm text-gray-500">
                            Concluídos
                        </p>
                        <p className="text-2xl font-semibold text-gray-800">
                            {stats?.done ?? 0}
                        </p>
                    </Card>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Projetos
                        </h2>

                        <div className="flex items-center gap-3">
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setPage(1);
                                }}
                                className="border border-gray-300 rounded px-3 py-1.5 text-sm"
                            >
                                <option value="">Todos</option>
                                <option value="pendente">Pendente</option>
                                <option value="em_andamento">Em andamento</option>
                                <option value="concluido">Concluído</option>
                            </select>

                            <Link
                                to="/projects/new"
                                className="text-sm px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
                            >
                                Novo Projeto
                            </Link>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-gray-500">Carregando...</div>
                    ) : projects.length === 0 ? (
                        <Card>
                            <p className="text-sm text-gray-500">
                                Nenhum projeto encontrado
                            </p>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {projects.map(project => (
                                <Card key={project.id}>
                                    <h3 className="font-semibold text-gray-800">
                                        {project.name}
                                    </h3>

                                    <p className="text-sm text-gray-600 mt-1">
                                        {truncateString(project.description, 500)}
                                    </p>

                                    <div className="mt-3 flex items-center justify-between">
                                        <StatusBadge status={project.status} />
                                    </div>

                                    <div className="mt-4">
                                        <ProgressBar
                                            progress={project.goals.progress}
                                        />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>

                <div className="flex justify-end gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Anterior
                    </button>

                    <button
                        onClick={() => setPage(p => p + 1)}
                        className="px-3 py-1 border rounded"
                    >
                        Próxima
                    </button>
                </div>
            </main>
        </div>
    );
}