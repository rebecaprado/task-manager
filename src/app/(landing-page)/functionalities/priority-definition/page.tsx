import Link from "next/link";
import FunctionalitiesSection from "@/components/FunctionalitiesSection";

export default function FaqPriorityDefinition() {
    return (
        <FunctionalitiesSection 
            title="Defina suas prioridades"
            description="A definição de prioridades é uma funcionalidade essencial para o gerenciamento de tarefas.
                        Além de ajudar na ordenação dos seus afazeres, ela também contribui para a melhorar a produtividade e a reduzir o estresse.
                        Aqui, a prioridade é definida pelo usuário, sendo possível escolher entre baixa, média e alta."
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