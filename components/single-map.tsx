"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import BackButton from "./map/BackButton";
import LocationInput from "./map/LocationInput";
import SingleMapCard from "./map/SingleMapCard";
import dynamic from "next/dynamic";

const SingleProjectInfoSheet = dynamic(() => import("./map/SingleProjectInfoSheet"), { ssr: false });
const SingleProjectVideoSheet = dynamic(() => import("./map/SingleProjectVideoSheet"), { ssr: false });
import ProjectShareButton from "./map/ProjectShareButton";

export default function SingleMap({ project, lat, lng }: { project: any, lat: number, lng: number }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const modelMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isRouting, setIsRouting] = useState(false);
  const [routeDistance, setRouteDistance] = useState<string | null>(null);
  const [routeType, setRouteTypeState] = useState<'project' | 'model'>(
    searchParams.get('dest') === 'model' ? 'model' : 'project'
  );

  const setRouteType = useCallback((type: 'project' | 'model') => {
    setRouteTypeState(type);
    // Sử dụng History API thay vì Next Router để ngăn Next.js re-render page gậy giật/reload map
    window.history.replaceState(null, '', `${pathname}?dest=${type}`);
  }, [pathname]);

  const [showManualInput, setShowManualInput] = useState(false);
  const [locationError, setLocationError] = useState("");
  const userLocationRef = useRef<{lng: number, lat: number} | null>(null);

  // Mở Sheet thông tin
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: 15,
      });
    }

    const addMarker = () => {
      if (markerRef.current) markerRef.current.remove();
      if (modelMarkerRef.current) modelMarkerRef.current.remove();

      const hasModelCoords = !!project.acf?.vị_tri_nha_mẫu;
      const isSameLocation = hasModelCoords && project.acf?.vị_tri_nha_mẫu === project.acf?.vị_tri;

      // --- PROJECT MARKER ---
      const elContainer = document.createElement("div");
      elContainer.className = "relative w-16 h-16 cursor-pointer z-30 flex items-center justify-center flex-col group";

      const innerEl = document.createElement("div");
      innerEl.className = "w-14 h-14 rounded-full bg-white border-[3px] border-blue-600 shadow-xl overflow-hidden transition-transform duration-300 group-hover:scale-110 group-hover:shadow-2xl";
      innerEl.style.backgroundImage = `url(${project.acf?.banner_img || project.acf?.logo || project.image || '/images/default.jpg'})`;
      innerEl.style.backgroundSize = "cover";
      innerEl.style.backgroundPosition = "center";
      
      const labelEl = document.createElement("div");
      labelEl.className = "absolute -bottom-8 whitespace-nowrap bg-blue-600/95 backdrop-blur-md text-white px-3 py-1 text-[11px] font-bold rounded-full shadow-lg border-2 border-white uppercase tracking-wider transition-transform duration-300 group-hover:-translate-y-1";
      labelEl.innerText = "Vị Trí Dự Án";

      elContainer.appendChild(innerEl);
      elContainer.appendChild(labelEl);

      elContainer.addEventListener("click", () => setIsInfoOpen(true));

      if (mapRef.current) {
        markerRef.current = new mapboxgl.Marker({ element: elContainer })
          .setLngLat([lng, lat])
          .addTo(mapRef.current);
      }

      // --- MODEL HOUSE MARKER ---
      if (hasModelCoords) {
        const parts = project.acf.vị_tri_nha_mẫu.split(",");
        if (parts.length >= 2) {
          const modelLat = parseFloat(parts[0]);
          const modelLng = parseFloat(parts[1]);

          const modelContainer = document.createElement("div");
          modelContainer.className = "relative w-16 h-16 cursor-pointer z-20 flex items-center justify-center flex-col group";
          
          const innerModelEl = document.createElement("div");
          innerModelEl.className = "w-11 h-11 rounded-full bg-rose-50 border-[3px] border-rose-500 shadow-xl flex items-center justify-center text-rose-500 font-bold bg-white transition-transform duration-300 group-hover:scale-110 group-hover:shadow-2xl";
          innerModelEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`;
          
          const labelModelEl = document.createElement("div");
          labelModelEl.className = "absolute -bottom-8 whitespace-nowrap bg-rose-600/95 backdrop-blur-md text-white px-3 py-1 text-[11px] font-bold rounded-full shadow-lg border-2 border-white uppercase tracking-wider transition-transform duration-300 group-hover:-translate-y-1";
          labelModelEl.innerText = "Nhà Mẫu / Sales";

          modelContainer.appendChild(innerModelEl);
          modelContainer.appendChild(labelModelEl);

          modelContainer.addEventListener("click", () => setIsInfoOpen(true));

          // If they overlap exactly, offset the model house marker by ~70 pixels to the right
          const pointOffset: mapboxgl.PointLike = isSameLocation ? [70, 0] : [0, 0];

          if (mapRef.current) {
            modelMarkerRef.current = new mapboxgl.Marker({ element: modelContainer, offset: pointOffset })
              .setLngLat([modelLng, modelLat])
              .addTo(mapRef.current);
            
            // Adjust bounds to fit both markers if they are different
            if (!isSameLocation) {
              const bounds = new mapboxgl.LngLatBounds([lng, lat], [lng, lat]);
              bounds.extend([modelLng, modelLat]);
              mapRef.current.fitBounds(bounds, { padding: 100, maxZoom: 15 });
            }
          }
        }
      }
    };

    if (mapRef.current.isStyleLoaded()) {
      addMarker();
    } else {
      mapRef.current.on("load", addMarker);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, project]);

  const getTargetCoords = () => {
    if (routeType === 'model' && project.acf?.vị_tri_nha_mẫu) {
      const parts = project.acf.vị_tri_nha_mẫu.split(",");
      if (parts.length >= 2) {
        return { tLat: parseFloat(parts[0]), tLng: parseFloat(parts[1]) };
      }
    }
    return { tLat: lat, tLng: lng };
  };

  const handleGoogleMapsDirections = () => {
    const { tLat, tLng } = getTargetCoords();
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${tLat},${tLng}`, '_blank');
  };

  const handleGrabDirections = () => {
    const { tLat, tLng } = getTargetCoords();
    const destName = encodeURIComponent(project.title?.rendered || project.title || "Dự án");
    window.open(`https://app.grab.com/action/open?screenType=BOOKING&dropOffLatitude=${tLat}&dropOffLongitude=${tLng}&dropOffTitle=${destName}`, '_blank');
  };

  const handleXanhSMDirections = () => {
    alert("Tính năng gọi xe Xanh SM đang được tích hợp. Vui lòng thử lại sau!");
  };

  const renderRouteOnMap = async (userLng: number, userLat: number) => {
    userLocationRef.current = { lng: userLng, lat: userLat };
    const { tLat, tLng } = getTargetCoords();
    try {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${userLng},${userLat};${tLng},${tLat}?steps=true&geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
        { method: 'GET' }
      );
      const json = await query.json();
      if (!json.routes || json.routes.length === 0) {
        alert("Không thể tìm thấy đường đi từ vị trí này!");
        return;
      }

      const data = json.routes[0];
      const route = data.geometry;

      if (data.distance) {
        setRouteDistance((data.distance / 1000).toFixed(1) + " km");
      }

      if (mapRef.current) {
        if (userMarkerRef.current) userMarkerRef.current.remove();

        const userEl = document.createElement("div");
        userEl.className = "w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg shadow-blue-500/50 flex items-center justify-center animate-pulse";
        userMarkerRef.current = new mapboxgl.Marker(userEl)
          .setLngLat([userLng, userLat])
          .addTo(mapRef.current);

        if (mapRef.current.getSource('route')) {
          (mapRef.current.getSource('route') as mapboxgl.GeoJSONSource).setData(route);
        } else {
          mapRef.current.addLayer({
            id: 'route',
            type: 'line',
            source: {
              type: 'geojson',
              data: route
            },
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': '#2563eb', 'line-width': 6, 'line-opacity': 0.8 }
          });
        }

        const bounds = new mapboxgl.LngLatBounds([userLng, userLat], [userLng, userLat]);
        bounds.extend([tLng, tLat]);
        mapRef.current.fitBounds(bounds, { padding: 80, speed: 1.2 });
      }
    } catch (err) {
      console.error("Failed to fetch Mapbox directions:", err);
      alert("Không thể tải tuyến đường, vui lòng thử lại sau.");
    }
  };

  useEffect(() => {
    if (userLocationRef.current) {
      renderRouteOnMap(userLocationRef.current.lng, userLocationRef.current.lat);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeType]);

  const drawMapboxRoute = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Trình duyệt không hỗ trợ định vị. Vui lòng tự nhập vị trí.");
      setShowManualInput(true);
      return;
    }

    setIsRouting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await renderRouteOnMap(position.coords.longitude, position.coords.latitude);
        setIsRouting(false);
      },
      (error) => {
        console.error(error);
        setIsRouting(false);
        setLocationError("Đã từ chối quyền truy cập vị trí. Vui lòng nhập thủ công.");
        setShowManualInput(true);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleLocationSelected = async (lng: number, lat: number) => {
    setIsRouting(true);
    setLocationError("");
    try {
      await renderRouteOnMap(lng, lat);
    } catch (err) {
      console.error("Routing from suggestion failed:", err);
      setLocationError("Lỗi tìm đường, xin thử lại sau.");
    } finally {
      setIsRouting(false);
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-50">
      <div ref={mapContainerRef} className="w-full h-full" />

      <BackButton />

      <LocationInput 
        show={showManualInput}
        onLocationSelected={handleLocationSelected}
        isRouting={isRouting}
        error={locationError}
      />

      <SingleMapCard
        project={project}
        distance={routeDistance}
        isRouting={isRouting}
        routeType={routeType}
        onRouteTypeChange={setRouteType}
        onDrawRoute={drawMapboxRoute}
        onOpenGoogleMaps={handleGoogleMapsDirections}
        onOpenGrab={handleGrabDirections}
        onOpenXanhSM={handleXanhSMDirections}
        onOpenInfo={() => setIsInfoOpen(true)}
        onOpenVideo={() => setIsVideoOpen(true)}
      />

      <SingleProjectInfoSheet 
        slug={project.slug} 
        isOpen={isInfoOpen} 
        onOpenChange={setIsInfoOpen} 
      />

      <SingleProjectVideoSheet 
        slug={project.slug} 
        isOpen={isVideoOpen} 
        onOpenChange={setIsVideoOpen} 
        projectData={project}
      />

      <ProjectShareButton 
        slug={project.slug} 
        title={project.title?.rendered || project.title || "Dự án"} 
      />
    </div>
  );
}
