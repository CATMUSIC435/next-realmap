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
          setIsSheetOpen(true);
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

      <ProjectSidebar filteredProjects={filteredProjects} />
      <ProjectSheet />
    </div>
  );
};

export default MapboxExample;
