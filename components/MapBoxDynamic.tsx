"use client";
import dynamic from "next/dynamic";

const MapBoxDynamic = dynamic(() => import("./map-box"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full bg-gray-50 text-gray-500 font-medium">
      Đang tải bản đồ...
    </div>
  ),
});

export default MapBoxDynamic;
