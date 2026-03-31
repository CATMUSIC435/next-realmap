import { Suspense } from "react";
import SingleMap from "@/components/single-map";
import { notFound } from "next/navigation";

export default async function ProjectSingleMapPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  try {
    const res = await fetch(`https://dxmdvietnam.vn/wp-json/wp/v2/du-an?slug=${slug}`, { 
      next: { revalidate: 60 } 
    });
    
    if (!res.ok) {
      return notFound();
    }

    const data = await res.json();
    if (!data || data.length === 0) {
      return notFound();
    }

    const project = data[0];
    
    // Parse coordinates
    let coords = null;
    if (project.acf?.vị_tri) {
      const parts = project.acf.vị_tri.split(",");
      if (parts.length >= 2) coords = { lat: parseFloat(parts[0]), lng: parseFloat(parts[1]) };
    }
    
    if (!coords || isNaN(coords.lat) || isNaN(coords.lng)) {
      coords = { lat: 10.7769, lng: 106.7009 }; // HCM fallback
    }

    // Prepare a clean object for the Client Component to avoid passing non-serializable data
    const cleanProject = {
      id: project.id,
      title: project.title?.rendered || project.title,
      slug: project.slug,
      acf: project.acf || {}
    };

    return (
      <div className="h-screen w-screen bg-gray-50 overflow-hidden">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-gray-100"><div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div></div>}>
          <SingleMap 
            project={cleanProject} 
            lat={coords.lat} 
            lng={coords.lng} 
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch project for mapping:", error);
    return notFound();
  }
}
