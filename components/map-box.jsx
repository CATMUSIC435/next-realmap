"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";

import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { LIST_IMAGE, LIST_IMAGE_PLAN, LIST_IMAGE_UTL } from "@/mocks/images";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "./ui/sheet";
import { useProjects } from "@/hooks/useProjects";

const MapboxExample = ({ lat, lng }) => {
  const mapContainerRef = useRef();
  const mapRef = useRef();

  const markersRef = useRef([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [highlightedId, setHighlightedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { projects } = useProjects();

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;
    return projects.filter(project =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  useEffect(() => {
    markersRef.current.forEach(({ innerEl, id, elContainer }) => {
      if (id === highlightedId) {
        innerEl.style.boxShadow = "0 0 15px 5px rgba(59, 130, 246, 0.8)";
        innerEl.style.borderColor = "#3b82f6";
        innerEl.style.transform = "scale(1.2)";
        elContainer.style.zIndex = "50";
      } else {
        innerEl.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
        innerEl.style.borderColor = "white";
        innerEl.style.transform = "scale(1)";
        elContainer.style.zIndex = "10";
      }
    });

    if (highlightedId && mapRef.current) {
      const selectedProject = projects.find(p => p.id === highlightedId);
      if (selectedProject) {
        mapRef.current.flyTo({
          center: [selectedProject.lng, selectedProject.lat],
          zoom: 14,
          speed: 1.2
        });
      }
    }
  }, [highlightedId, projects]);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    mapRef.current = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/standard",
      center: [lng, lat],
      zoom: 12,
    });

    return () => mapRef.current?.remove();

  }, [lat, lng]);

  useEffect(() => {
    if (!mapRef.current) return;

    const addMarkers = () => {
      markersRef.current.forEach((m) => m.marker.remove());
      markersRef.current = [];

      filteredProjects.forEach((estate) => {
        // Container cho mapbox control (Mapbox sẽ set inline transform lên đây)
        // Cần có kích thước chính xác để Mapbox tính toán origin "center" đúng vị trí
        const elContainer = document.createElement("div");
        elContainer.className = "w-12 h-12 cursor-pointer transition-all duration-300 z-10 hover:z-20";

        // Phần nội dung (chứa hình ảnh, áp dụng hiệu ứng scale/shadow)
        const innerEl = document.createElement("div");
        innerEl.className = "w-full h-full rounded-full bg-white border-2 border-white shadow-md overflow-hidden transition-all duration-300 hover:scale-[1.15]";
        innerEl.style.backgroundImage = `url(${estate.image})`;
        innerEl.style.backgroundSize = "cover";
        innerEl.style.backgroundPosition = "center";

        elContainer.appendChild(innerEl);

        elContainer.addEventListener("click", (e) => {
          e.stopPropagation();
          setHighlightedId(estate.id);
          setSelected(estate);
          setIsOpen(true);
        });

        const marker = new mapboxgl.Marker(elContainer)
          .setLngLat([estate.lng, estate.lat])
          .addTo(mapRef.current);

        markersRef.current.push({ marker, elContainer, innerEl, id: estate.id });
      });
    };

    if (mapRef.current.isStyleLoaded()) {
      addMarkers();
    } else {
      mapRef.current.on("load", addMarkers);
    }
  }, [filteredProjects]);

  return (
    <div className="relative h-full w-full sx">
      <div id="map" ref={mapContainerRef} style={{ height: "100%" }}></div>

      {/* Nút mở Sidebar khi bị ẩn */}
      <div className={`absolute top-4 left-4 z-10 transition-all duration-500 transform ${!isSidebarOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'}`}>
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
      <div className={`absolute top-4 left-4 bottom-4 w-[280px] z-10 transition-all duration-500 ease-in-out origin-left ${isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0 pointer-events-none scale-95'}`}>
        <div className="h-full bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/60">
          <div className="p-4 border-b border-gray-200/60 bg-white/50 flex items-center gap-2">
            <Input
              type="text"
              placeholder="Tìm kiếm dự án..."
              className="flex-1 bg-white/90 shadow-sm border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="ghost" size="icon" className="shrink-0 h-10 w-10 text-gray-500 rounded-lg hover:bg-gray-200/50 transition-colors" onClick={() => setIsSidebarOpen(false)} title="Thu gọn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`flex items-center gap-3 p-3 border-b border-gray-100/80 cursor-pointer transition-all hover:bg-gray-50/90 ${highlightedId === project.id ? 'bg-blue-50/80 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'}`}
                onClick={() => {
                  setHighlightedId(project.id);
                  setSelected(project);
                  setIsOpen(true);
                }}
              >
                <div className="relative w-[64px] h-[48px] rounded-lg overflow-hidden shrink-0 shadow-sm border border-gray-100">
                  <Image src={project.image} alt={project.title} fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-sm truncate transition-colors ${highlightedId === project.id ? 'text-blue-700' : 'text-gray-800'}`}>
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-500 truncate mt-1">
                    {project.originalData?.acf?.vị_tri ? project.originalData.acf.vị_tri.split(',')[0] : "Hồ Chí Minh"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sheet hiển thị thông tin dự án bên phải */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[500px] overflow-y-auto no-scrollbar font-sans border-l border-gray-100 shadow-2xl p-0">
          {selected && (
            <div className="flex flex-col">
              <div className="relative w-full aspect-[4/3] bg-gray-100">
                <Image
                  src={selected.image}
                  alt={selected.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-6 right-6">
                  <SheetTitle className="text-2xl font-bold text-white mb-1 shadow-sm text-left">{selected.title}</SheetTitle>
                  <p className="text-sm text-gray-200 flex items-center gap-1.5 opacity-90 drop-shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    {selected.originalData?.acf?.vị_tri ? selected.originalData.acf.vị_tri.split(',')[0] : "Đang cập nhật vị trí"}
                  </p>
                </div>
              </div>

              <div className="p-6 flex flex-col gap-6">
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 space-y-3 text-sm">
                  <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                    <span className="text-gray-500 font-medium">Chủ đầu tư</span>
                    <span className="font-semibold text-gray-900 text-right">{selected.originalData?.acf?.chu_dau_tu || "Đang cập nhật"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                    <span className="text-gray-500 font-medium">Quy mô</span>
                    <span className="font-semibold text-gray-900 text-right">{selected.originalData?.acf?.quy_mo || "Đang cập nhật"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                    <span className="text-gray-500 font-medium">Pháp lý</span>
                    <span className="font-semibold text-gray-900 text-right">{selected.originalData?.acf?.phap_ly || "Sở hữu lâu dài"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">Tổng sản phẩm</span>
                    <span className="font-semibold text-blue-700 text-right">{selected.originalData?.acf?.san_pham || "Đang cập nhật"}</span>
                  </div>
                </div>
                
                {selected.originalData?.excerpt?.rendered ? (
                  <div 
                    className="text-sm text-gray-600 leading-relaxed text-justify line-clamp-4"
                    dangerouslySetInnerHTML={{__html: selected.originalData.excerpt.rendered}}
                  />
                ) : (
                  <p className="text-sm text-gray-600 leading-relaxed text-justify line-clamp-4">
                    Để biết thêm chi tiết về {selected.title}, bảng giá hiện tại, chính sách bán hàng và tham quan thực tế, quý khách vui lòng xem thông tin chi tiết của dự án.
                  </p>
                )}

                <SheetFooter className="mt-2">
                  <Link href={`/project/${selected.id}`} className="w-full">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl h-12 shadow-lg shadow-blue-500/25 transition-all font-medium text-base">
                      Xem chi tiết sơ đồ
                    </Button>
                  </Link>
                </SheetFooter>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MapboxExample;
