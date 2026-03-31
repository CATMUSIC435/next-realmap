import { Button } from "@/components/ui/button";
import { Loader2, Navigation, Map as MapIcon, Play, ExternalLink } from "lucide-react";

interface SingleMapCardProps {
  project: any;
  distance: string | null;
  isRouting: boolean;
  routeType?: 'project' | 'model';
  onRouteTypeChange?: (type: 'project' | 'model') => void;
  onDrawRoute: () => void;
  onOpenGoogleMaps: () => void;
  onOpenInfo: () => void;
  onOpenVideo?: () => void;
}

export default function SingleMapCard({
  project,
  distance,
  isRouting,
  routeType = 'project',
  onRouteTypeChange,
  onDrawRoute,
  onOpenGoogleMaps,
  onOpenInfo,
  onOpenVideo
}: SingleMapCardProps) {
  const hasModel = !!project.acf?.vị_tri_nha_mẫu;

  const displayLocationText = routeType === 'model' && hasModel 
    ? project.acf.vị_tri_nha_mẫu 
    : project.acf?.vị_tri || "Đang cập nhật vị trí";

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-[96%] max-w-[480px] bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl flex items-center justify-between gap-2 border border-gray-100">
      <div className="flex-1 min-w-0 pr-2 border-r border-gray-200">
        <div className="flex items-center gap-2 pr-1">
          <h1 className="text-sm sm:text-base font-bold text-gray-900 truncate">
            {project.title?.rendered || project.title || "Tên dự án"}
          </h1>
          {project.acf?.link_page && (
            <a 
              href={project.acf.link_page.startsWith('http') ? project.acf.link_page : `https://${project.acf.link_page}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 rounded p-1 transition-colors border border-blue-200"
              title="Lướt xem Web Dự Án"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
        <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 truncate flex items-center gap-1">
          {distance ? (
            <span className="font-semibold text-blue-600 bg-blue-50 px-1 py-0.5 rounded">{distance}</span>
          ) : null}
          <span className="truncate">{displayLocationText}</span>
        </p>

        {hasModel && onRouteTypeChange && (
          <div className="flex gap-2 mt-1.5 bg-gray-100 p-0.5 rounded-md w-fit">
            <button 
              onClick={() => onRouteTypeChange('project')}
              className={`text-[10px] px-2 py-0.5 rounded-sm transition-colors ${routeType === 'project' ? 'bg-white shadow-sm font-bold text-blue-600' : 'text-gray-500 hover:bg-gray-200'}`}
            >Vị trí</button>
            <button 
              onClick={() => onRouteTypeChange('model')}
              className={`text-[10px] px-2 py-0.5 rounded-sm transition-colors ${routeType === 'model' ? 'bg-white shadow-sm font-bold text-rose-600' : 'text-gray-500 hover:bg-gray-200'}`}
            >Nhà mẫu</button>
          </div>
        )}
      </div>
      
      <div className="flex shrink-0 gap-1.5 sm:gap-2">
        <Button 
          onClick={onDrawRoute}
          disabled={isRouting}
          variant="default"
          size="icon"
          title="Sử dụng vị trí của tôi"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-[10px] sm:rounded-xl h-10 w-10 sm:h-11 sm:w-11 shadow-md shadow-blue-500/20"
        >
          {isRouting ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />}
        </Button>

        <Button 
          onClick={onOpenInfo}
          variant="secondary"
          size="icon"
          title="Thông tin dự án"
          className="rounded-[10px] sm:rounded-xl h-10 w-10 sm:h-11 sm:w-11 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-gray-700 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </Button>

        {(project.acf?.video_tiktok || project.acf?.video_youtube) && (
          <Button 
            onClick={onOpenVideo}
            variant="outline"
            size="icon"
            title="Xem Video Review"
            className="rounded-[10px] sm:rounded-xl h-10 w-10 sm:h-11 sm:w-11 border-gray-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 hover:border-red-200 relative group overflow-hidden"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            <span className="absolute top-1 right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full animate-pulse border sm:border-2 border-white"></span>
          </Button>
        )}

        <Button 
          onClick={onOpenGoogleMaps}
          variant="outline"
          size="icon"
          title="Mở bằng Google Maps"
          className="rounded-[10px] sm:rounded-xl h-10 w-10 sm:h-11 sm:w-11 border-gray-200 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
        >
          <MapIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>
    </div>
  );
}
