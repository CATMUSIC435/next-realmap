import MapBox from "@/components/map-box";

export default function Home() {

  const position = { lat: 10.8286061, lng: 106.713313 };
  return (
    <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-between bg-white dark:bg-black sm:items-start">
        <div className="h-screen w-screen">
          <MapBox
            lat={position.lat}
            lng={position.lng}
          />
        </div>
      </main>
    </div>
  );
}
