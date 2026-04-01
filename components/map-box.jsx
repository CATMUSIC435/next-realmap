"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";

import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { LIST_IMAGE, LIST_IMAGE_PLAN, LIST_IMAGE_UTL } from "@/mocks/images";
import { useProjects } from "@/hooks/useProjects";
import { useMapStore } from "@/hooks/useMapStore";
import dynamic from "next/dynamic";
import ProjectSidebar from "./map/ProjectSidebar";

const ProjectSheet = dynamic(() => import("./map/ProjectSheet"), { ssr: false });

const MapboxExample = ({ lat, lng }) => {
  const mapContainerRef = useRef();
  const mapRef = useRef();
  const markersRef = useRef([]);

  const {
    searchQuery,
    setSearchQuery,
    isSidebarOpen,
    setIsSidebarOpen,
    isSheetOpen,
    setIsSheetOpen,
    selectedProject: selected,
    setSelectedProject: setSelected,
    highlightedId,
    setHighlightedId
  } = useMapStore();

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
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: 12,
    });

    return () => mapRef.current?.remove();

  }, [lat, lng]);

  useEffect(() => {
    if (!mapRef.current || projects.length === 0) return;

    const addMarkers = () => {
      // Phá cũ tạo mới chỉ chạy 1 lần khi mảng projects API thay đổi (lần đầu load), cực nhẹ
      markersRef.current.forEach((m) => m.marker.remove());
      markersRef.current = [];

      projects.forEach((estate) => {
        const elContainer = document.createElement("div");
        elContainer.className = "w-12 h-12 cursor-pointer transition-all duration-300 z-10 hover:z-20";
        // Check hiển thị lần đầu
        elContainer.style.display = 'block';

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
          setIsSheetOpen(true);
        });

        const marker = new mapboxgl.Marker(elContainer)
          .setLngLat([estate.lng, estate.lat])
          .addTo(mapRef.current);

        markersRef.current.push({ marker, elContainer, innerEl, id: estate.id });
      });
      
      // Kích hoạt lại vòng lặp cập nhật display ngay sau khi tạo xong (đề phòng việc search đã diễn ra)
      markersRef.current.forEach(({ elContainer, id }) => {
        const isVisible = filteredProjects.some(p => p.id === id);
        elContainer.style.display = isVisible ? 'block' : 'none';
      });
    };

    if (mapRef.current.isStyleLoaded()) {
      addMarkers();
    } else {
      mapRef.current.on("load", addMarkers);
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]); // Chỉ phụ thuộc vào projects gốc, không phụ thuộc filteredProjects

  // Effect thứ hai siêu nhanh: Chỉ lặp qua DOM List và CSS Toggles, Render Speed 0ms
  useEffect(() => {
    markersRef.current.forEach(({ elContainer, id }) => {
      const isVisible = filteredProjects.some(p => p.id === id);
      elContainer.style.display = isVisible ? 'block' : 'none';
      if (!isVisible) {
        elContainer.style.zIndex = '10'; // trả về index nếu đang bị hide
      }
    });
  }, [filteredProjects]);

  return (
    <div className="relative h-full w-full sx">
      <div id="map" ref={mapContainerRef} style={{ height: "100%" }}></div>

      <ProjectSidebar filteredProjects={filteredProjects} />
      <ProjectSheet />
    </div>
  );
};

export default MapboxExample;
