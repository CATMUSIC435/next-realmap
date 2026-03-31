import { useState, useEffect } from "react";

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("https://dxmdvietnam.vn/wp-json/wp/v2/du-an?per_page=100");
        const data = await res.json();
        
        const formattedProjects = data.map((d: any) => {
          let coords = null;
          
          if (d.acf["vị_tri"]) {
            const parts = d.acf["vị_tri"].split(",");
            if (parts.length >= 2) coords = { lat: parseFloat(parts[0]), lng: parseFloat(parts[1]) };
          }

          if (!coords || isNaN(coords.lat) || isNaN(coords.lng)) {
            // Default random around HCM center
            coords = {
              lat: 10.7769 + (Math.random() - 0.5) * 0.1,
              lng: 106.7009 + (Math.random() - 0.5) * 0.1,
            };
          }

          const title = (d.title.rendered || "").replace(/&#8211;/g, "-").replace(/&#038;/g, "&");
          const image = d.acf.banner_img || d.acf.logo || "/images/diamond-boulevard-dark-1.png";

          return {
            id: d.id,
            title: title,
            image: image,
            lat: coords.lat,
            lng: coords.lng,
            originalData: d,
          };
        });
        
        setProjects(formattedProjects);
      } catch (err: any) {
        console.error(err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, isLoading, error };
};
