'use client'

import { SidebarProvider, SidebarTrigger, useSidebar } from "ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "ui/tooltip"
import DashboardSidebar from "taskmanager/components/DashboardSidebar";

function SidebarTriggerWithTooltip() {
  const { open } = useSidebar();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <SidebarTrigger />
      </TooltipTrigger>
      <TooltipContent>
        {open ? "Fechar menu" : "Abrir menu"}
      </TooltipContent>
    </Tooltip>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="mb-4 sm:mb-6 md:mb-8 lg:mb-10">
          <SidebarTriggerWithTooltip />
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}
