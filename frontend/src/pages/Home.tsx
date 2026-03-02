import {PublicLayout} from "../layout/PublicLayout.tsx";

export function Home() {
    return (
        <PublicLayout>
            <div className="bg-white p-8 rounded shadow space-y-6 text-center">
                <h2 className="text-3xl font-extrabold text-blue-600">
                    HeroForce
                </h2>

                <p className="text-gray-600">
                    Gerencie projetos heroicos, acompanhe metas e evolua seus resultados.
                </p>

                <div className="flex flex-col gap-3">
                    <a
                        href="/login"
                        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Entrar
                    </a>

                    <a
                        href="/register"
                        className="border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50"
                    >
                        Criar conta
                    </a>
                </div>
            </div>
        </PublicLayout>
    );
}