import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "ui/accordion";
import Link from "next/link";

export default function FaqPage() {
    return (
        <Accordion type="single" collapsible className="max-w-sm mx-auto my-8 sm:my-16">
            <p className="text-2xl font-bold text-center mx-8 sm:mx-16">FAQ</p>
            <AccordionItem value="item-1" className="border-b border-gray-200">
                <AccordionTrigger>O que é o Task Manager?</AccordionTrigger>
                <AccordionContent>
                    O Task Manager é um gerenciador de tarefas gratuito, criado para ajudar pessoas a organizar suas tarefas de forma eficiente e produtiva.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-b border-gray-200">
                <AccordionTrigger>Como começo a usar?</AccordionTrigger>
                <AccordionContent>
                    É simples, basta criar uma conta <Link href="/sign-up" className="underline hover:text-gray-500">aqui</Link> e começar a usar.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-b border-gray-200">
                <AccordionTrigger>O Task Manager é pago?</AccordionTrigger>
                <AccordionContent>
                    Não, o Task Manager é gratuito e sempre será.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-b border-gray-200">
                <AccordionTrigger>Posso usar o Task Manager em qualquer dispositivo?</AccordionTrigger>
                <AccordionContent>
                    Sim, o Task Manager é compatível com todos os dispositivos, desde computadores até smartphones.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}