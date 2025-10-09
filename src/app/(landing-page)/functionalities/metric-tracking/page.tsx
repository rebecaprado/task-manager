import Link from "next/link";
import FunctionalitiesSection from "@/components/FunctionalitiesSection";

export default function FaqMetricTracking() {
    return (
        <FunctionalitiesSection 
            title="Acompanhe suas métricas"
            description="O acompanhamento de métricas é essencial para entender o seu desempenho e tomar decisões estratégicas.
                        Com o Task Manager, você acompanha suas métricas de produtividade, como tempo gasto em cada tarefa, quantidade de tarefas concluídas, entre outras."
            call="Quer testar? Crie uma conta e comece a gerenciar suas tarefas agora mesmo!"
            imagePath="/gerencie-seu-tempo.png"
        >
            <div className="mt-4">
                <Link href="/sign-up">
                    <button type="button" className="bg-black text-white px-4 py-2 rounded-md">Comece agora</button>
                </Link>
            </div>
        </FunctionalitiesSection>
    );
}