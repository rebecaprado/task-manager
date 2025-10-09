import Image from "next/image";
import { ReactNode } from "react";

export default function FunctionalitiesSection({
    title,
    description,
    call,
    imagePath,
    children,
}: {
    title: string;
    description: string;
    call: string;
    imagePath: string;
    children: ReactNode;
}) {
    return (
        <>
            <div className="flex flex-col sm:flex-row">
                <div className="flex flex-col items-center justify-center mt-8 sm:mt-10 mx-4 sm:mx-8">
                    <h1 className="underline text-2xl font-bold text-center mb-4">{title}</h1>
                    <p className="text-md sm:text-xl text-center mb-4">{description}</p>
                    <p className="text-md sm:text-xl text-center font-bold mt-4 sm:mt-6">{call}</p>
                    {children}
                </div>
                <div className="flex justify-end">
                        <Image
                            src={imagePath}
                            alt={title}
                            width={1080}
                            height={1350}
                            className="max-w-xs sm:max-w-md aspect-[4/5] h-auto rounded-md my-8 sm:my-10 shadow-md mx-auto sm:mx-4 md:mx-8" />
                </div>
            </div>
        </>
    );
}

