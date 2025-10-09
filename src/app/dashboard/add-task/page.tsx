"use client"

import { useAuth } from "hooks/use-auth";
import AddTaskForm from "taskmanager/components/AddTaskForm";
import { Loader2 } from "lucide-react";

export default function AddTaskPage() {
    const { user, loading, error } = useAuth("/sign-in")

    if (loading) return <Loader2 className="animate-spin" />
    if (error) return <p className="text-red-500">{error}</p>
    if (!user) return null 

    return (
        <AddTaskForm user={user} />
    );
}
