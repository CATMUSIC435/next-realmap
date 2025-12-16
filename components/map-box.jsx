"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import { REAL_ESTATE_LIST } from "@/mocks/place";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { CarouselEvent } from "./carousel-event";
import { LIST_IMAGE } from "@/mocks/images";
import { Input } from "./ui/input";

const MapboxExample = ({ lat, lng }) => {
  const mapContainerRef = useRef();
  const mapRef = useRef();

  const markersRef = useRef([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    mapRef.current = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/standard",
      center: [lng, lat],
      zoom: 8,
    });

    REAL_ESTATE_LIST.forEach((estate) => {
      // Marker HTML
      const el = document.createElement("div");
      el.className = "estate-marker";
      el.innerHTML = `
        <div class="w-16 rounded-md overflow-hidden bg-white/40 shadow backdrop-blur-md">
          <img src="${estate.image}" class="w-full h-10 object-cover" />
          <div class=" text-2xs p-1 text-center line-clamp-2 font-sans font-medium">
            ${estate.title}
          </div>
        </div>
      `;

      el.onclick = () => {
        setSelected(estate);
        setOpen(true);
      };

      const marker = new mapboxgl.Marker(el)
        .setLngLat([estate.lng, estate.lat])
        .addTo(mapRef.current);
      markersRef.current.push(marker);
    });

    return () => mapRef.current?.remove();
  }, []);

  return (
    <div className="relative h-full w-full">
      <div id="map" ref={mapContainerRef} style={{ height: "100%" }}></div>
      <div className="absolute top-4 left-4 bg-white/40 backdrop-blur-md rounded-md shadow-md">
        <Input type="text" placeholder="Tìm kiếm" />
      </div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          {selected && (
            <>
              <DrawerHeader>
                <DrawerTitle className="text-2xl">{selected.title}</DrawerTitle>
              </DrawerHeader>

              <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-y-4 md:gap-8">
                <div>
                  <Image
                    alt=""
                    height={1080}
                    width={1920}
                    src={selected.image}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>
                <div className="w-fulll">
                  <div className="flex justify-between">
                    <div className="text-lg font-semibold text-red-600">
                      {selected.price}
                    </div>
                    <div>
                      <Link href={`/project/${selected.id}`}>
                        <Button
                          variant="outline"
                          className=" bg-sky-400 text-white rounded-sm"
                        >
                          Chi tiết
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 flex flex-col gap-2 mt-4">
                    <h3 className="font-medium">
                      Vị trí đẹp – pháp lý rõ ràng – hỗ trợ vay
                    </h3>
                    <p className="text-xs">
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                      Hic veritatis quasi assumenda autem? Tempore, corrupti
                      inventore sunt fugiat ipsum assumenda ipsam minima dolor,
                      unde, blanditiis quo ratione dignissimos rem. Magnam.
                    </p>
                  </div>
                </div>

                <div className="col-span-2 px-16">
                  <div>
                    <CarouselEvent images={LIST_IMAGE} />
                  </div>
                </div>
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MapboxExample;
