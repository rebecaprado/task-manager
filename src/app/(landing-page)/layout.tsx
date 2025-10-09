import Image from "next/image";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "ui/navigation-menu";

export default function LpLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <nav className="flex flex-wrap items-center gap-4 bg-[#f1efe7] shadow-md px-2 py-2">
                <Link href="/">
                    <Image
                        src="/taskmanagerlogo.png"
                        alt="Task Manager Logo"
                        width={1050}
                        height={600}
                        className="w-24 sm:w-32 md:w-36 aspect-[16/9]"
                    />
                </Link>
        
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="hover:bg-gray-200 rounded-md px-4 py-2">Funcionalidades</NavigationMenuTrigger>
                                <NavigationMenuContent className="bg-stone-100">
                                    <NavigationMenuLink asChild>
                                        <Link href="/functionalities/task-management">Gerenciamento de tarefas</Link>
                                    </NavigationMenuLink>
                                    <NavigationMenuLink asChild>
                                        <Link href="/functionalities/priority-definition">Definição de prioridades</Link>
                                    </NavigationMenuLink>
                                    <NavigationMenuLink asChild>
                                        <Link href="/functionalities/metric-tracking">Acompanhamento de métricas</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
        
                <Link href="/faq" className="hover:bg-gray-200 rounded-md px-4 py-2">FAQ</Link>
        
                <Link 
                href="/sign-in"
                className="ml-auto mr-5 px-4 py-2 text-black rounded hover:bg-gray-200 transition"
                >Entre</Link>
            </nav>
            <main>{children}</main>
        </>
    );
  }