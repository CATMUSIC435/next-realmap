import { Suspense } from "react";
import EventMap from "@/components/events/EventMap";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { slugify } from "@/lib/utils";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string; eventSlug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug, eventSlug } = resolvedParams;
  
  try {
    const res = await fetch(`https://dxmdvietnam.vn/wp-json/wp/v2/du-an?slug=${slug}`, { 
      next: { revalidate: 60 } 
    });
    const data = await res.json();
    
    if (!data || data.length === 0) return { title: 'Sự kiện không tồn tại' };
    
    const project = data[0];
    const eventsData = project.acf?.events || project.events || [];
    
    const event = eventsData.find((e: any) => slugify(e.name_event) === eventSlug);
    if (!event) return { title: 'Sự kiện không tồn tại' };

    const eventTitle = event.name_event || "Sự kiện";
    const projectNameText = project.title?.rendered || project.title || "Dự án";
    const imageUrl = event.banner_event?.url || project.acf?.banner_img || "";
    const descriptionText = event.description_event || `Xem bản đồ chỉ đường và thông tin chi tiết sự kiện ${eventTitle} thuộc dự án ${projectNameText}.`;

    return {
      title: `${eventTitle} - ${projectNameText}`,
      description: descriptionText,
      openGraph: {
        title: `${eventTitle} - ${projectNameText}`,
        description: descriptionText,
        url: `/du-an/${slug}/${eventSlug}`,
        siteName: "DXMD RealMap",
        images: imageUrl ? [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `Hình ảnh sự kiện ${eventTitle}`,
          }
        ] : [],
        type: 'website',
      },
    };
  } catch(e) {
    return { title: 'Bản Đồ Sự Kiện' };
  }
}

export default async function EventPage({ params }: { params: Promise<{ slug: string; eventSlug: string }> }) {
  const resolvedParams = await params;
  const { slug, eventSlug } = resolvedParams;
  
  try {
    const res = await fetch(`https://dxmdvietnam.vn/wp-json/wp/v2/du-an?slug=${slug}`, { 
      next: { revalidate: 60 } 
    });
    
    if (!res.ok) return notFound();

    const data = await res.json();
    if (!data || data.length === 0) return notFound();

    const project = data[0];
    const eventsData = project.acf?.events || project.events || [];
    
    const event = eventsData.find((e: any) => slugify(e.name_event) === eventSlug);
    if (!event) return notFound();
    
    // Parse event coordinates
    let coords = null;
    if (event.location_events) {
      const parts = event.location_events.split(",");
      if (parts.length >= 2) coords = { lat: parseFloat(parts[0]), lng: parseFloat(parts[1]) };
    }
    
    // Fallback to project coordinates if event doesn't have specific ones
    if (!coords || isNaN(coords.lat) || isNaN(coords.lng)) {
      if (project.acf?.vị_tri) {
        const parts = project.acf.vị_tri.split(",");
        if (parts.length >= 2) coords = { lat: parseFloat(parts[0]), lng: parseFloat(parts[1]) };
      }
    }

    if (!coords || isNaN(coords.lat) || isNaN(coords.lng)) {
      coords = { lat: 10.7769, lng: 106.7009 }; // HCM fallback
    }

    const cleanProject = {
      id: project.id,
      title: project.title?.rendered || project.title,
      slug: project.slug,
      acf: project.acf || {}
    };

    // pass slugified name inside event for sharing purpose
    const cleanEvent = { ...event, slug: eventSlug };

    return (
      <div className="h-screen w-screen bg-gray-50 overflow-hidden">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-gray-100"><div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div></div>}>
          <EventMap 
            project={cleanProject} 
            event={cleanEvent}
            lat={coords.lat} 
            lng={coords.lng} 
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch event for mapping:", error);
    return notFound();
  }
}
