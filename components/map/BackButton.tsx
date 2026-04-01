import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  url?: string;
  text?: string;
}

export default function BackButton({ url = "/", text = "Về bản đồ lớn" }: BackButtonProps) {
  return (
    <div className="absolute top-4 left-4 z-10">
      <Link href={url}>
        <Button variant="outline" className="bg-white/95 backdrop-blur-md shadow-lg rounded-xl flex items-center gap-2 font-medium text-sm sm:text-base h-9 sm:h-10 px-3 sm:px-4">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          {text}
        </Button>
      </Link>
    </div>
  );
}
