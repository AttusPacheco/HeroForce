import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { getProjectById, updateProject, deleteProject, Project } from '../../services/projects.service';
import { getProjectGoals, createProjectGoal, updateProjectGoal, deleteProjectGoal, ProjectGoal } from '../../services/project-goals.service';

import { Card } from '../../layout/components/Card';
import { Button } from '../../layout/components/Button';
import { Input } from '../../layout/components/Input';
import { StatusBadge } from '../../layout/components/StatsBadge';
import { ProgressBar } from '../../layout/components/ProgressBar';
import { ConfirmModal } from '../../layout/components/ConfirmModal';
import { ProjectStatus } from '../../services/projects.service';

export function ProjectDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [project, setProject] = useState<Project | null>(null);
    const [goals, setGoals] = useState<ProjectGoal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [newGoalTitle, setNewGoalTitle] = useState('');
    const [newGoalDescription, setNewGoalDescription] = useState('');
    const [isCreatingGoal, setIsCreatingGoal] = useState(false);

    const [isEditingDetails, setIsEditingDetails] = useState(false);
    const [editProjectName, setEditProjectName] = useState('');
    const [editProjectDescription, setEditProjectDescription] = useState('');

    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            loadProjectData();
        }
    }, [id]);

    async function loadProjectData() {
        try {
            setLoading(true);
            const [projData, goalsData] = await Promise.all([
                getProjectById(id!),
                getProjectGoals(id!)
            ]);
            setProject(projData);
            setGoals(goalsData);
            setEditProjectName(projData.name);
            setEditProjectDescription(projData.description || '');
        } catch (err) {
            console.error(err);
            setError('Erro ao carregar detalhes do projeto');
        } finally {
            setLoading(false);
        }
    }

    async function handleStatusChange(newStatus: ProjectStatus) {
        try {
            await updateProject(id!, { status: newStatus });
            setProject(prev => prev ? { ...prev, status: newStatus } : null);
        } catch (err) {
            console.error(err);
            alert('Erro ao atualizar status do projeto');
        }
    }

    async function handleSaveProjectDetails() {
        if (!editProjectName.trim()) return;

        try {
            const updated = await updateProject(id!, {
                name: editProjectName,
                description: editProjectDescription
            });
            setProject(prev => prev ? { ...prev, ...updated } : null);
            setIsEditingDetails(false);
        } catch (err) {
            console.error(err);
            alert('Erro ao atualizar os detalhes do projeto');
        }
    }

    function handleRequestDeleteProject() {
        setIsProjectModalOpen(true);
    }

    async function confirmDeleteProject() {
        setIsProjectModalOpen(false);
        try {
            await deleteProject(id!);
            navigate('/dashboard');
        } catch (err) { }
    }

    async function handleAddGoal(e: React.FormEvent) {
        e.preventDefault();
        try {
            setIsCreatingGoal(true);
            const newGoal = await createProjectGoal(id!, {
                title: newGoalTitle,
                description: newGoalDescription,
            });
            setGoals([...goals, newGoal]);
            setNewGoalTitle('');
            setNewGoalDescription('');
        } catch (err) {
            console.error(err);
            alert('Erro ao criar meta');
        } finally {
            setIsCreatingGoal(false);
        }
    }

    async function handleGoalStatusChange(goalId: string, newStatus: string) {
        try {
            const updatedGoal = await updateProjectGoal(id!, goalId, { status: newStatus as ProjectStatus });
            setGoals(goals.map(g => g.id === goalId ? { ...g, status: updatedGoal.status } : g));
        } catch (err) {
            console.error(err);
            alert('Erro ao atualizar status da meta');
        }
    }

    function handleRequestDeleteGoal(goalId: string) {
        setGoalToDelete(goalId);
    }

    async function confirmDeleteGoal() {
        if (!goalToDelete) return;

        try {
            const idToDelete = goalToDelete;
            setGoalToDelete(null);

            await deleteProjectGoal(id!, idToDelete);
            setGoals(goals.filter(g => g.id !== idToDelete));
        } catch (err) {
            console.error(err);
            alert('Erro ao excluir meta');
        }
    }

    function calculateProgress() {
        if (goals.length === 0) return 0;
        const completed = goals.filter(g => g.status === 'concluido').length;
        return Math.round((completed / goals.length) * 100);
    }

    if (loading) return <div className="p-8 text-center text-gray-500">Carregando...</div>;
    if (error || !project) return <div className="p-8 text-center text-red-500">{error || 'Projeto não encontrado'}</div>;

    const progress = calculateProgress();

    return (
        <>
            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 w-full flex-1">
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                        ← Voltar ao Dashboard
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <div className="space-y-4">
                                {isEditingDetails ? (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Título do Projeto</label>
                                            <Input
                                                value={editProjectName}
                                                onChange={(e) => setEditProjectName(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                            <textarea
                                                value={editProjectDescription}
                                                onChange={(e) => setEditProjectDescription(e.target.value)}
                                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                rows={4}
                                            />
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <Button onClick={handleSaveProjectDetails}>Salvar</Button>
                                            <button
                                                onClick={() => {
                                                    setIsEditingDetails(false);
                                                    setEditProjectName(project.name);
                                                    setEditProjectDescription(project.description || '');
                                                }}
                                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <h2 className="text-2xl font-bold text-gray-800 break-words flex items-center gap-2">
                                                    {project.name}
                                                    <button
                                                        onClick={() => setIsEditingDetails(true)}
                                                        className="text-gray-400 hover:text-indigo-600 transition p-1"
                                                        title="Editar Projeto"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </button>
                                                </h2>
                                                <p className="text-gray-600 text-sm whitespace-pre-wrap mt-2">
                                                    {project.description}
                                                </p>
                                            </div>
                                            <StatusBadge status={project.status} />
                                        </div>
                                    </>
                                )}

                                <div className="pt-4 pb-2">
                                    <p className="text-sm text-gray-500 mb-2">Progresso do Projeto</p>
                                    <ProgressBar progress={progress} />
                                </div>

                                <div className="border-t border-gray-100 pt-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Alterar Status do Projeto
                                        </label>
                                        <select
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={project.status}
                                            onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
                                        >
                                            <option value="pendente">Pendente</option>
                                            <option value="em_andamento">Em Andamento</option>
                                            <option value="concluido">Concluído</option>
                                        </select>
                                    </div>

                                    <button
                                        onClick={handleRequestDeleteProject}
                                        className="w-full py-2 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50 transition"
                                    >
                                        Excluir Projeto
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Adicionar Nova Meta</h3>
                            <form onSubmit={handleAddGoal} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                        <Input
                                            value={newGoalTitle}
                                            onChange={(e) => setNewGoalTitle(e.target.value)}
                                            placeholder="Ex: Definir arquitetura do sistema"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (opcional)</label>
                                        <textarea
                                            value={newGoalDescription}
                                            onChange={(e) => setNewGoalDescription(e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="w-32">
                                        <Button type="submit" disabled={isCreatingGoal || !newGoalTitle.trim()}>
                                            {isCreatingGoal ? 'Adicionando...' : 'Adicionar Meta'}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </Card>

                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800">
                                Metas do Projeto ({goals.length})
                            </h3>

                            {goals.length === 0 ? (
                                <Card>
                                    <p className="text-gray-500 text-sm text-center py-4">Nenhuma meta cadastrada ainda.</p>
                                </Card>
                            ) : (
                                <div className="space-y-3">
                                    {goals.map(goal => (
                                        <Card key={goal.id}>
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <h4 className={`font-semibold ${goal.status === 'concluido' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                                        {goal.title}
                                                    </h4>
                                                    {goal.description && (
                                                        <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <select
                                                        className="border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50 focus:outline-none"
                                                        value={goal.status}
                                                        onChange={(e) => handleGoalStatusChange(goal.id, e.target.value)}
                                                    >
                                                        <option value="pendente">Pendente</option>
                                                        <option value="em_andamento">Em Andamento</option>
                                                        <option value="concluido">Concluído</option>
                                                    </select>

                                                    <button
                                                        onClick={() => handleRequestDeleteGoal(goal.id)}
                                                        className="text-red-400 hover:text-red-600 p-1"
                                                        title="Excluir Meta"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <ConfirmModal
                isOpen={isProjectModalOpen}
                title="Excluir Projeto"
                description="Tem certeza que deseja excluir este projeto? Todos os dados (como metas e progresso) serão removidos permanentemente. Esta ação não pode ser desfeita."
                onConfirm={confirmDeleteProject}
                onCancel={() => setIsProjectModalOpen(false)}
            />

            <ConfirmModal
                isOpen={goalToDelete !== null}
                title="Excluir Meta"
                description="Tem certeza que deseja excluir esta meta? Seu progresso será recalculado e a meta removida permanentemente."
                onConfirm={confirmDeleteGoal}
                onCancel={() => setGoalToDelete(null)}
            />
        </>
    );
}
