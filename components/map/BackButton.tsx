import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  return (
    <div className="absolute top-4 left-4 z-10">
      <Link href="/">
        <Button variant="outline" className="bg-white/95 backdrop-blur-md shadow-lg rounded-xl flex items-center gap-2 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Về bản đồ lớn
        </Button>
      </Link>
    </div>
  );
}
