import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";

interface LocationInputProps {
  show: boolean;
  onLocationSelected: (lng: number, lat: number) => void;
  isRouting: boolean;
  error: string;
}

export default function LocationInput({
  show,
  onLocationSelected,
  isRouting,
  error: parentError
}: LocationInputProps) {
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [localError, setLocalError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!address.trim() || address.length < 3) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const query = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&autocomplete=true&limit=5&country=VN`
        );
        const json = await query.json();
        if (json.features) setSuggestions(json.features);
      } catch (err) {
        console.error("Autocomplete failed:", err);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [address]);

  const handleSearchClick = async () => {
    if (!address.trim()) return;
    setLocalError("");
    setShowSuggestions(false);
    setIsSearching(true);
    try {
      const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=1&country=VN`);
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        onLocationSelected(lng, lat);
      } else {
        setLocalError("Không tìm thấy địa điểm phù hợp.");
      }
    } catch (e) {
      setLocalError("Lỗi tìm kiếm, xin thử lại.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSuggestion = (place: any) => {
    setAddress(place.place_name);
    setShowSuggestions(false);
    setSuggestions([]);
    setLocalError("");
    const [lng, lat] = place.center;
    onLocationSelected(lng, lat);
  };

  if (!show) return null;

  const displayError = localError || parentError;
  const isBusy = isRouting || isSearching;

  return (
    <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 w-[95%] max-w-[480px] bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl flex flex-col gap-2 border border-gray-100 animate-in slide-in-from-bottom-4">
      {displayError && (
        <p className="text-sm text-red-500 font-medium px-1 flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {displayError}
        </p>
      )}
      <div className="relative">
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Nhập địa điểm bắt đầu (VD: Quận 1, TPHCM)..." 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
            className="flex-1 bg-white border-gray-200 focus-visible:ring-blue-500 rounded-xl"
            autoFocus
          />
          <Button 
            onClick={handleSearchClick} 
            disabled={isBusy || !address.trim()}
            className="rounded-xl px-4 bg-gray-900 hover:bg-gray-800 text-white"
          >
             {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>
        
        {/* Danh sách gợi ý */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden max-h-[240px] overflow-y-auto z-50">
            {suggestions.map((place) => (
              <div 
                key={place.id}
                onClick={() => handleSelectSuggestion(place)}
                className="p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer flex flex-col justify-center"
              >
                <p className="text-sm font-semibold text-gray-900 truncate">{place.text}</p>
                <p className="text-xs text-gray-500 truncate mt-0.5">{place.place_name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
