"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import { REAL_ESTATE_LIST } from "@/mocks/place";

import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { CarouselEvent } from "./carousel-event";
import { LIST_IMAGE, LIST_IMAGE_PLAN, LIST_IMAGE_UTL } from "@/mocks/images";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "./ui/sheet";

const MapboxExample = ({ lat, lng }) => {
  const mapContainerRef = useRef();
  const mapRef = useRef();

  const markersRef = useRef([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    mapRef.current = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/standard",
      center: [lng, lat],
      zoom: 8,
    });

    mapRef.current.on("load", () => {

      REAL_ESTATE_LIST.forEach((estate) => {

        const el = document.createElement("div");
        el.className = "marker";

        el.addEventListener("click", () => {
          setSelected(estate);
          setIsOpen(true);
        });

        const marker = new mapboxgl.Marker(el)
          .setLngLat([estate.lng, estate.lat])
          .addTo(mapRef.current);

        markersRef.current.push(marker);

      });

    });

    return () => mapRef.current?.remove();

  }, []);

  return (
    <div className="relative h-full w-full sx">
      <div id="map" ref={mapContainerRef} style={{ height: "100%" }}></div>
      <div className="absolute top-4 left-4 bg-white/40 backdrop-blur-md rounded-md shadow-md">
        <Input type="text" placeholder="Tìm kiếm" />
      </div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="gap-1 font-merri">
          {selected && <>
            <SheetHeader className="p-0">
              <Image
                alt=""
                height={1080}
                width={1920}
                src={selected.image}
                className="w-full h-auto object-cover"
              />
              <SheetTitle className="text-3xl text-center py-4">{selected.title}</SheetTitle>
            </SheetHeader>

            <div className="px-2 md:gap-8 overflow-y-scroll overflow-x-hidden">
              <div className="w-fulll">
                <div className="text-sm text-gray-600">
                  <p className="line-clamp-3">
                    Với một bước từ Fenica, cư dân tiếp cận nhanh 2 siêu hạ tầng của TP. Hồ Chí Minh: đường Vành đai 3 & Metro Suối Tiên - Thủ Dầu Một, mở ra lối sống mới di chuyển nhanh chóng, an toàn, thân thiện môi trường.
                  </p>
                </div>
              </div>

              <div>
                <div className="max-w-xl py-4 text-xs">
                  <table className="w-full text-left border-collapse">

                    <tbody>

                      <tr className="border-b border-gray-600/80">
                        <td className="py-3 w-40 opacity-80">Vị trí:</td>
                        <td className="py-3 font-semibold">
                          Đường Trần Quang Diệu, Phường Tân Đông Hiệp, Thành phố Hồ Chí Minh
                        </td>
                      </tr>

                      <tr className="border-b border-gray-600/80">
                        <td className="py-3 opacity-80">Tổng diện tích:</td>
                        <td className="py-3 font-semibold">5.537m2</td>
                      </tr>

                      <tr className="border-b border-gray-600/80">
                        <td className="py-3 opacity-80">Quy mô:</td>
                        <td className="py-3 font-semibold">
                          2 block, 2 tầng hầm & 2 tầng TTTM
                        </td>
                      </tr>

                      <tr className="border-b border-gray-600/80">
                        <td className="py-3 opacity-80">Chiều cao:</td>
                        <td className="py-3 font-semibold">22 tầng</td>
                      </tr>

                      <tr className="border-b border-gray-600/80">
                        <td className="py-3 opacity-80">Nhà thầu:</td>
                        <td className="py-3 font-semibold">
                          Liên danh Phước Thành & CCcons
                        </td>
                      </tr>

                      <tr className="border-b border-gray-600/80">
                        <td className="py-3 opacity-80">Pháp lý sở hữu:</td>
                        <td className="py-3 font-semibold">Sở hữu lâu dài</td>
                      </tr>

                      <tr>
                        <td className="py-3 opacity-80">Căn hộ:</td>
                        <td className="py-3 font-semibold">579 căn</td>
                      </tr>

                    </tbody>

                  </table>
                </div>
              </div>

              <div>
                <Image
                  alt=""
                  height={1080}
                  width={1920}
                  src={"/images/map-new.png"}
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="w-fulll">
                <div className="text-sm text-gray-600">
                  <p className="line-clamp-3">
                    Với một bước từ Fenica, cư dân tiếp cận nhanh 2 siêu hạ tầng của TP. Hồ Chí Minh: đường Vành đai 3 & Metro Suối Tiên - Thủ Dầu Một, mở ra lối sống mới di chuyển nhanh chóng, an toàn, thân thiện môi trường.
                  </p>
                </div>
              </div>

              <div>
                <div className="py-4">
                  <CarouselEvent images={LIST_IMAGE_UTL} base="md:basis" />
                </div>
              </div>

              <div className="w-fulll">
                <div className="text-sm text-gray-600">
                  <p className="line-clamp-3">
                    Với một bước từ Fenica, cư dân tiếp cận nhanh 2 siêu hạ tầng của TP. Hồ Chí Minh: đường Vành đai 3 & Metro Suối Tiên - Thủ Dầu Một, mở ra lối sống mới di chuyển nhanh chóng, an toàn, thân thiện môi trường.
                  </p>
                </div>
              </div>

              <div>
                <div className="py-4">
                  <CarouselEvent images={LIST_IMAGE_PLAN} base="md:basis" />
                </div>
              </div>

              <div>
                <div className="py-4">
                  <CarouselEvent images={LIST_IMAGE} />
                </div>
              </div>
            </div>
          </>}
          <SheetFooter>
            <Link href="/project/1" className="w-full block">
              <Button type="submit" className="bg-blue-400 w-full">Chi tiết</Button>
            </Link>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MapboxExample;
