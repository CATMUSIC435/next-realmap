"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import BackButton from "../map/BackButton";
import LocationInput from "../map/LocationInput";
import EventMapCard from "./EventMapCard";
import ProjectShareButton from "../map/ProjectShareButton";

interface EventMapProps {
  project: any;
  event: any;
  lat: number;
  lng: number;
}

export default function EventMap({ project, event, lat, lng }: EventMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);

  const [isRouting, setIsRouting] = useState(false);
  const [routeDistance, setRouteDistance] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [locationError, setLocationError] = useState("");
  const userLocationRef = useRef<{lng: number, lat: number} | null>(null);

  const getTargetCoords = () => {
    return { tLat: lat, tLng: lng };
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: 16,
      });
    }

    const addMarker = () => {
      if (markerRef.current) markerRef.current.remove();

      const elContainer = document.createElement("div");
      elContainer.className = "relative w-20 h-20 cursor-pointer z-30 flex items-center justify-center flex-col group animate-bounce-slow";

      const innerEl = document.createElement("div");
      innerEl.className = "w-14 h-14 rounded-full bg-rose-50 border-[3px] border-rose-500 shadow-xl overflow-hidden transition-transform duration-300 group-hover:scale-110 flex items-center justify-center";
      
      const imgUrl = event.banner_event?.url || project.acf?.logo || '/images/default.jpg';
      innerEl.style.backgroundImage = `url(${imgUrl})`;
      innerEl.style.backgroundSize = "cover";
      innerEl.style.backgroundPosition = "center";
      
      const labelEl = document.createElement("div");
      labelEl.className = "absolute -bottom-6 whitespace-nowrap bg-rose-600/95 backdrop-blur-md text-white px-3 py-1 text-[11px] font-bold rounded-full shadow-lg border-2 border-white uppercase tracking-wider transition-transform duration-300 group-hover:-translate-y-1 max-w-[150px] truncate";
      labelEl.innerText = event.time_event || "Sự kiện";

      elContainer.appendChild(innerEl);
      elContainer.appendChild(labelEl);

      if (mapRef.current) {
        markerRef.current = new mapboxgl.Marker({ element: elContainer })
          .setLngLat([lng, lat])
          .addTo(mapRef.current);
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
  }, [lat, lng, event, project]);

  const handleGoogleMapsDirections = () => {
    const { tLat, tLng } = getTargetCoords();
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${tLat},${tLng}`, '_blank');
  };

  const handleGrabDirections = () => {
    const { tLat, tLng } = getTargetCoords();
    const destName = encodeURIComponent(event.name_event || "Sự kiện");
    window.open(`https://app.grab.com/action/open?screenType=BOOKING&dropOffLatitude=${tLat}&dropOffLongitude=${tLng}&dropOffTitle=${destName}`, '_blank');
  };

  const handleXanhSMDirections = () => {
    alert("Tính năng gọi xe Xanh SM đang được cập nhật!");
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
            paint: { 'line-color': '#e11d48', 'line-width': 6, 'line-opacity': 0.8 }
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

  const drawMapboxRoute = () => {
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError("Trình duyệt không hỗ trợ định vị.");
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
        setLocationError("Đã từ chối quyền truy cập vị trí.");
        setShowManualInput(true);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleLocationSelected = async (sLng: number, sLat: number) => {
    setIsRouting(true);
    setLocationError("");
    try {
      await renderRouteOnMap(sLng, sLat);
    } catch (err) {
      console.error(err);
      setLocationError("Lỗi tìm đường, xin thử lại sau.");
    } finally {
      setIsRouting(false);
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-50">
      <div ref={mapContainerRef} className="w-full h-full" />

      <BackButton url={`/du-an/${project.slug}`} text={`Về dự án ${project.title}`} />

      <LocationInput 
        show={showManualInput}
        onLocationSelected={handleLocationSelected}
        isRouting={isRouting}
        error={locationError}
      />

      <EventMapCard
        projectSlug={project.slug}
        projectName={project.title}
        event={event}
        distance={routeDistance}
        isRouting={isRouting}
        onDrawRoute={drawMapboxRoute}
        onOpenGoogleMaps={handleGoogleMapsDirections}
        onOpenGrab={handleGrabDirections}
        onOpenXanhSM={handleXanhSMDirections}
      />

      <ProjectShareButton 
        slug={`${project.slug}/${event.slug}`} 
        title={event.name_event || "Sự kiện"} 
      />
    </div>
  );
}
