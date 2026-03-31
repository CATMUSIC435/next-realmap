import { Button } from "@/components/ui/button";
import { Loader2, Navigation, Map as MapIcon } from "lucide-react";

interface SingleMapCardProps {
  project: any;
  distance: string | null;
  isRouting: boolean;
  onDrawRoute: () => void;
  onOpenGoogleMaps: () => void;
  onOpenInfo: () => void;
}

export default function SingleMapCard({
  project,
  distance,
  isRouting,
  onDrawRoute,
  onOpenGoogleMaps,
  onOpenInfo
}: SingleMapCardProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-[95%] max-w-[480px] bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 border border-gray-100">
      <div className="flex-1 min-w-0 pr-2 border-r border-gray-200">
        <h1 className="text-base font-bold text-gray-900 truncate">{project.title?.rendered || project.title || "Tên dự án"}</h1>
        <p className="text-xs text-gray-500 mt-0.5 truncate flex items-center gap-1">
          {distance ? (
            <span className="font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{distance}</span>
          ) : null}
          {project.acf?.vị_tri || "Đang cập nhật vị trí"}
        </p>
      </div>
      
      <div className="flex shrink-0 gap-2">
        <Button 
          onClick={onDrawRoute}
          disabled={isRouting}
          variant="default"
          size="icon"
          title="Sử dụng vị trí của tôi"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 w-11 shadow-md shadow-blue-500/20"
        >
          {isRouting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
        </Button>

        <Button 
          onClick={onOpenInfo}
          variant="secondary"
          size="icon"
          title="Thông tin dự án"
          className="rounded-xl h-11 w-11 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-gray-700 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </Button>

        <Button 
          onClick={onOpenGoogleMaps}
          variant="outline"
          size="icon"
          title="Mở bằng Google Maps"
          className="rounded-xl h-11 w-11 border-gray-200 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
        >
          <MapIcon className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
