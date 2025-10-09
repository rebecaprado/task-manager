import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "ui/sidebar";
import { Home, LayoutList, User, List, Kanban } from "lucide-react";
import Image from "next/image";
import SignOutButton from "auth/components/SignOutButton";

// Menu items
const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Criar tarefa",
      url: "/dashboard/add-task",
      icon: LayoutList,
    },
    {
      title: "Kanban Board",
      url: "/dashboard/tasks",
      icon: Kanban,
    },
    {
      title: "Lista de Tarefas",
      url: "/dashboard/tasks-list",
      icon: List,
    },
    {
      title: "Perfil",
      url: "/dashboard/profile",
      icon: User,
    },
]

export default function DashboardSidebar() {
    return (
        <Sidebar collapsible="offcanvas">
          <SidebarContent className="bg-[#f1efe7]">
            <SidebarGroup>
            <Image
                src="/taskmanagerlogo.png" 
                alt="Task Manager Logo"
                width={1050}
                height={600}
                className="mx-auto w-20 sm:w-24 md:w-32 lg:w-36 aspect-[16/9]"
              />
              <SidebarGroupLabel className="justify-center font-bold text-sm sm:text-base md:text-lg lg:text-xl text-black my-2 sm:my-3 md:my-4">Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1 sm:space-y-2">
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base">
                          <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            {/* Botão de Sair */}
            <SidebarGroup className="mt-auto">
              <SidebarGroupContent className="px-3 sm:px-4 py-2 sm:py-3">
                <SignOutButton />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      )
}