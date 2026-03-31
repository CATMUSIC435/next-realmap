import { Suspense } from "react";
import SingleMap from "@/components/single-map";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  try {
    const res = await fetch(`https://dxmdvietnam.vn/wp-json/wp/v2/du-an?slug=${slug}`, { 
      next: { revalidate: 60 } 
    });
    const data = await res.json();
    
    if (!data || data.length === 0) return { title: 'Dự án không tồn tại' };
    
    const project = data[0];
    const titleText = project.title?.rendered || project.title || "Dự án";
    const imageUrl = project.acf?.banner_img || project.acf?.logo || project.acf?.hinh_anh_du_an || "";
    const descriptionText = `Xem bản đồ vị trí, thông tin chi tiết, đường đi và trải nghiệm tham quan nhà mẫu của dự án ${titleText}.`;

    return {
      title: `Vị trí dự án ${titleText}`,
      description: descriptionText,
      openGraph: {
        title: `Vị trí bản đồ và thông tin dự án ${titleText}`,
        description: descriptionText,
        url: `/du-an/${slug}`,
        siteName: "DXMD RealMap",
        images: imageUrl ? [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `Hình ảnh dự án ${titleText}`,
          }
        ] : [],
        type: 'website',
      },
      twitter: {
        card: "summary_large_image",
        title: `Vị trí bản đồ và thông tin dự án ${titleText}`,
        description: descriptionText,
        images: imageUrl ? [imageUrl] : [],
      }
    };
  } catch(e) {
    return { title: 'Bản Đồ Dự Án' };
  }
}

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
