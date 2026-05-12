"use client";
import dynamic from "next/dynamic";

const SingleMapDynamic = dynamic(() => import("./single-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
    </div>
  ),
});

export default SingleMapDynamic;
