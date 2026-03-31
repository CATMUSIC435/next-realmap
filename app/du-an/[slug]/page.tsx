import SingleMap from "@/components/single-map";
import { notFound } from "next/navigation";

export default async function ProjectSingleMapPage({ params }: { params: { slug: string } }) {
  // In Next.js App Router (newer versions), params might need to be awaited or used directly
  const slug = params.slug || (await params).slug;
  
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
        <SingleMap 
          project={cleanProject} 
          lat={coords.lat} 
          lng={coords.lng} 
        />
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch project for mapping:", error);
    return notFound();
  }
}
