'use client';

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface MapBoxProps {
    lat: number;
    lng: number;
    zoom?: number;
    onChange?: (lat: number, lng: number) => void; // callback khi marker di chuyển
}

export default function MapBox({ lat, lng, zoom = 12, onChange }: Readonly<MapBoxProps>) {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Khởi tạo map
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [lng, lat],
            zoom,
        });

        // Marker draggable
        markerRef.current = new mapboxgl.Marker({ draggable: true })
            .setLngLat([lng, lat])
            .addTo(mapRef.current);

        // Lắng nghe sự kiện kéo marker
        markerRef.current.on("dragend", () => {
            const pos = markerRef.current!.getLngLat();
            onChange?.(pos.lat, pos.lng);
        });

        return () => {
            mapRef.current?.remove();
        };
    }, []);

    return (
        <div
            ref={mapContainerRef}
            className="w-full h-full rounded-xl overflow-hidden"
        />
    );
}
