import Link from "next/link";
import FunctionalitiesSection from "@/components/FunctionalitiesSection";

export default function FaqTaskManagement() {
    return (
        <FunctionalitiesSection 
            title="Gerencie suas tarefas"
            description="O gerenciamento de tarefas é a funcionalidade mais importante do Task Manager.
                        Aqui você pode criar, editar, deletar e mover suas tarefas para o seu dia a dia.
                        As tarefas contam com título, descrição, nível de prioridade e status para trackear o progresso."
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