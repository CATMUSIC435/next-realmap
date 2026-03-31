import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";

interface LocationInputProps {
  show: boolean;
  address: string;
  onAddressChange: (val: string) => void;
  error: string;
  suggestions: any[];
  onSelectSuggestion: (place: any) => void;
  showSuggestions: boolean;
  setShowSuggestions: (val: boolean) => void;
  isRouting: boolean;
  onSearch: () => void;
}

export default function LocationInput({
  show,
  address,
  onAddressChange,
  error,
  suggestions,
  onSelectSuggestion,
  showSuggestions,
  setShowSuggestions,
  isRouting,
  onSearch
}: LocationInputProps) {
  if (!show) return null;

  return (
    <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 w-[95%] max-w-[480px] bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl flex flex-col gap-2 border border-gray-100 animate-in slide-in-from-bottom-4">
      {error && (
        <p className="text-sm text-red-500 font-medium px-1 flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </p>
      )}
      <div className="relative">
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Nhập địa điểm bắt đầu (VD: Quận 1, TPHCM)..." 
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            className="flex-1 bg-white border-gray-200 focus-visible:ring-blue-500 rounded-xl"
            autoFocus
          />
          <Button 
            onClick={onSearch} 
            disabled={isRouting || !address.trim()}
            className="rounded-xl px-4 bg-gray-900 hover:bg-gray-800 text-white"
          >
             {isRouting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>
        
        {/* Danh sách gợi ý */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden max-h-[240px] overflow-y-auto z-50">
            {suggestions.map((place) => (
              <div 
                key={place.id}
                onClick={() => onSelectSuggestion(place)}
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
