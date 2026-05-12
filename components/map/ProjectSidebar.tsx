"use client";
import { useMapStore } from "@/hooks/useMapStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface ProjectSidebarProps {
  filteredProjects: any[];
}

export default function ProjectSidebar({ filteredProjects }: ProjectSidebarProps) {
  const {
    searchQuery,
    setSearchQuery,
    isSidebarOpen,
    setIsSidebarOpen,
    highlightedId,
    setHighlightedId,
    setSelectedProject,
    setIsSheetOpen
  } = useMapStore();

  return (
    <>
      {/* Nút mở Sidebar khi bị ẩn */}
      <div
        className={`absolute top-4 left-4 z-10 transition-all duration-500 transform ${!isSidebarOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'
          }`}
      >
        <Button
          variant="outline"
          size="icon"
          className="bg-white/90 backdrop-blur-md shadow-lg rounded-xl h-12 w-12 border-gray-200/60"
          onClick={() => setIsSidebarOpen(true)}
          title="Hiện danh sách dự án"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 3H3" /><path d="M21 12H3" /><path d="M21 21H3" /><path d="m14 8 4 4-4 4" /></svg>
        </Button>
      </div>

      {/* Sidebar danh sách dự án */}
      <div
        className={`absolute top-4 left-4 bottom-4 w-[240px] sm:w-[280px] z-10 transition-all duration-500 ease-in-out origin-left ${isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0 pointer-events-none scale-95'
          }`}
      >
        <div className="h-full bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/60">
          <div className="p-3 sm:p-4 border-b border-gray-200/60 bg-white/50 flex items-center gap-1.5 sm:gap-2">
            <Input
              type="text"
              placeholder="Tìm kiếm dự án..."
              className="flex-1 bg-white/90 shadow-sm border-gray-200 h-9 sm:h-10 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 h-9 w-9 sm:h-10 sm:w-10 text-gray-500 rounded-lg hover:bg-gray-200/50 transition-colors"
              onClick={() => setIsSidebarOpen(false)}
              title="Thu gọn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 border-b border-gray-100/80 cursor-pointer transition-all hover:bg-gray-50/90 ${highlightedId === project.id ? 'bg-blue-50/80 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'
                  }`}
                onClick={() => {
                  setHighlightedId(project.id);
                  setSelectedProject(project);
                  if (window.innerWidth < 768) {
                    setIsSidebarOpen(false);
                  } else {
                    setIsSheetOpen(true);
                  }
                }}
              >
                <div className="relative w-[52px] h-[38px] sm:w-[64px] sm:h-[48px] rounded-lg overflow-hidden shrink-0 shadow-sm border border-gray-100">
                  <Image src={project.image} alt={project.title} fill sizes="(max-width: 640px) 52px, 64px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-[13px] sm:text-sm truncate transition-colors ${highlightedId === project.id ? 'text-blue-700' : 'text-gray-800'
                    }`}>
                    {project.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-400 truncate mt-0.5">
                    {(() => {
                      const text = project.originalData?.acf?.gt_location || project.originalData?.acf?.vị_tri || "";
                      const isCoord = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(text);
                      if (isCoord || !text) return "Đang cập nhật vị trí";
                      return text.split(',')[0];
                    })()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
