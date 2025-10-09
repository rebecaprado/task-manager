import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex shadow-md flex-col items-center justify-center mt-8 sm:mt-[5vh] mx-4 sm:mx-[5vw] mb-16 sm:mb-[15vh] min-h-[70vh] sm:min-h-[80vh] bg-[#e9ecef]">
      <h1 className="text-4xl sm:text-9xl italic font-bold mb-6 sm:mb-10">Task Manager</h1>
      <p className="text-lg sm:text-4xl text-center">Gerencie suas tarefas com facilidade</p>
      <div className="flex flex-row items-center justify-center mt-8 sm:mt-10">
        <Link href="/sign-up">
          <button className="bg-black text-white px-4 py-2 rounded-md">Comece agora</button>
        </Link>
      </div>
    </div>
  )
} 