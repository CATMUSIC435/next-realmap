'use client';

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface MapBoxProps {
    lat: number;
    lng: number;
    zoom?: number;
    onChange?: (lat: number, lng: number) => void;
}

const MAP_STYLES: Record<string, string> = {
    Streets: "mapbox://styles/mapbox/streets-v12",
    Satellite: "mapbox://styles/mapbox/satellite-streets-v12",
    Light: "mapbox://styles/mapbox/light-v11",
    Dark: "mapbox://styles/mapbox/dark-v11",
};

export default function MapBox({
    lat,
    lng,
    zoom = 15,
    onChange,
}: Readonly<MapBoxProps>) {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [style, setStyle] = useState(MAP_STYLES.Streets);

    useEffect(() => {
        if (mapRef.current || !mapContainerRef.current) return;
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: style,
            center: [106.70014, 10.87065],
            zoom: 10,
            pitch: 45,
            bearing: -17.6,
            antialias: true,
        });

        new mapboxgl.Marker({ color: "#d4ae6f" })
            .setLngLat([106.70014, 10.87065])
            .addTo(mapRef.current);

        mapRef.current.on("load", () => {
            mapRef.current?.resize();
        });


    }, []);


    // 🔁 Đổi map style
    // useEffect(() => {
    //     if (!mapRef.current) return;
    //     mapRef.current.setStyle(style);
    // }, [style]);

    return (
        <div className="relative w-full h-full">
            <div
                id="map"
                ref={mapContainerRef}
                className="w-full h-full overflow-hidden"
            />
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-2xl rounded-md p-1 space-y-3 shadow-lg text-sm">
                {/* Map style */}
                <Select
                    value={style}
                    onValueChange={(value) => setStyle(value)}
                >
                    <SelectContent className="bg-white/20 backdrop-blur-md">
                        {Object.entries(MAP_STYLES).map(([name, url]) => (
                            <SelectItem key={url} value={url}>
                                {name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                    <SelectTrigger className="w-32">
                        <SelectValue placeholder="Map Style" />
                    </SelectTrigger>
                </Select>
            </div>
        </div>
    );
}
