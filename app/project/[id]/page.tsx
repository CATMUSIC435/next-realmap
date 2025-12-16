import Image from "next/image";

export default function ProjectDetail() {
    return (
        <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
            <main className="flex min-h-screen w-full flex-col items-center justify-between bg-white dark:bg-black sm:items-start">
                <div className="h-screen w-screen overflow-hidden">
                    <Image
                        alt=""
                        height={1080}
                        width={1920}
                        src="/images/diamond-boulevard-dark-1.png"
                        className="w-full h-auto object-cover"
                    />
                </div>
            </main>
        </div>
    );
}
