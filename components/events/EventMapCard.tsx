import { Button } from "@/components/ui/button";
import { Loader2, Navigation, Map as MapIcon, ChevronUp, Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface EventMapCardProps {
  event: any;
  projectSlug: string;
  projectName: string;
  distance: string | null;
  isRouting: boolean;
  onDrawRoute: () => void;
  onOpenGoogleMaps: () => void;
  onOpenGrab?: () => void;
  onOpenXanhSM?: () => void;
}

export default function EventMapCard({
  event,
  projectSlug,
  projectName,
  distance,
  isRouting,
  onDrawRoute,
  onOpenGoogleMaps,
  onOpenGrab,
  onOpenXanhSM
}: EventMapCardProps) {
  const [showMapMenu, setShowMapMenu] = useState(false);
  const mapMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (mapMenuRef.current && !mapMenuRef.current.contains(e.target as Node)) {
        setShowMapMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const eventTitle = event.name_event || "Sự kiện";
  const displayLocationText = event.description_event || "Chỉ đường đến sự kiện";

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-[96%] max-w-[480px] bg-white/95 backdrop-blur-md p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl flex items-center justify-between gap-1.5 sm:gap-2 border border-gray-100">
      <div className="flex-1 min-w-0 pr-1.5 sm:pr-2 border-r border-gray-200">
        <div className="flex flex-col">
          <Link href={`/du-an/${projectSlug}`} className="text-[10px] text-blue-600 font-bold uppercase hover:underline flex items-center gap-1 mb-1 w-fit">
            <ArrowLeft className="w-3 h-3" />
            {projectName}
          </Link>
          <h1 className="text-[13px] sm:text-base font-bold text-gray-900 truncate" title={eventTitle}>
            {eventTitle}
          </h1>
          {event.time_event && (
            <span className="text-[10px] sm:text-[11px] font-bold text-rose-600 uppercase tracking-widest mt-1 flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              {event.time_event}
            </span>
          )}
          <p className="text-[11px] sm:text-xs text-gray-500 mt-1 truncate flex items-center gap-1">
            {distance ? (
              <span className="font-semibold text-blue-600 bg-blue-50 px-1 py-0.5 rounded">{distance}</span>
            ) : null}
            <span className="truncate">{displayLocationText}</span>
          </p>
        </div>
      </div>
      
      <div className="flex shrink-0 gap-1 sm:gap-2 pl-1.5 sm:pl-0">
        <Button 
          onClick={onDrawRoute}
          disabled={isRouting}
          variant="default"
          size="icon"
          title="Sử dụng vị trí của tôi"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-[10px] sm:rounded-xl h-9 w-9 sm:h-11 sm:w-11 shadow-md shadow-blue-500/20"
        >
          {isRouting ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />}
        </Button>

        <div className="relative" ref={mapMenuRef}>
          <Button 
            onClick={() => setShowMapMenu(!showMapMenu)}
            variant="outline"
            size="icon"
            title="Tùy chọn di chuyển"
            className="rounded-[10px] sm:rounded-xl h-9 w-9 sm:h-11 sm:w-11 border-gray-200 hover:bg-green-50 hover:text-green-600 hover:border-green-200 relative"
          >
            <MapIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full border border-gray-200 shadow-sm w-4 h-4 flex items-center justify-center">
              <ChevronUp className="w-3 h-3 text-gray-500" />
            </div>
          </Button>

          {showMapMenu && (
            <div className="absolute bottom-[calc(100%+0.5rem)] right-0 w-48 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
              <div className="flex flex-col py-1.5">
                <button
                  onClick={() => {
                    setShowMapMenu(false);
                    onOpenGrab?.();
                  }}
                  className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-green-50 text-left transition-colors w-full"
                >
                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <span className="text-green-600 font-bold text-[13px]">G</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Đặt Grab</span>
                </button>

                <button
                  onClick={() => {
                    setShowMapMenu(false);
                    onOpenXanhSM?.();
                  }}
                  className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-cyan-50 text-left transition-colors w-full"
                >
                  <div className="w-7 h-7 rounded-full bg-cyan-100 flex items-center justify-center shrink-0">
                    <span className="text-cyan-600 font-bold text-[13px]">X</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Đặt Xanh SM</span>
                </button>

                <div className="h-px bg-gray-100 my-1 mx-3"></div>

                <button
                  onClick={() => {
                    setShowMapMenu(false);
                    onOpenGoogleMaps();
                  }}
                  className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-blue-50 text-left transition-colors w-full"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <MapIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Google Maps</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
