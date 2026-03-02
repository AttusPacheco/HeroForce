import { useAuth } from '../auth/AuthContext';
import {Card} from "../layout/components/Card.tsx";

export function Dashboard() {
    const { user } = useAuth();

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
                        <p className="text-sm text-gray-500">Projetos Ativos</p>
                        <p className="text-2xl font-semibold text-gray-800">3</p>
                    </Card>

                    <Card>
                        <p className="text-sm text-gray-500">Em Andamento</p>
                        <p className="text-2xl font-semibold text-gray-800">2</p>
                    </Card>

                    <Card>
                        <p className="text-sm text-gray-500">Concluídos</p>
                        <p className="text-2xl font-semibold text-gray-800">1</p>
                    </Card>
                </section>

                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Projetos
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <h3 className="font-semibold text-gray-800">
                                Projeto Alpha
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Sistema de gestão heroica
                            </p>

                            <span className="inline-block mt-3 text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                                Em andamento
                            </span>
                        </Card>

                        <Card>
                            <h3 className="font-semibold text-gray-800">
                                Projeto Beta
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Plataforma de vendas
                            </p>

                            <span className="inline-block mt-3 text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                                Concluído
                            </span>
                        </Card>
                    </div>
                </section>
            </main>
        </div>
    );
}