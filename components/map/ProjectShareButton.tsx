"use client";
import { useState, useRef, useEffect } from "react";
import { Share2, Facebook, Twitter, Copy, Check, MessageCircle } from "lucide-react";

interface ProjectShareButtonProps {
  slug: string;
  title: string;
}

export default function ProjectShareButton({ slug, title }: ProjectShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(`https://dxmdvietnam.vn/du-an/${slug}`);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    // Luôn lấy URL hiện tại chính xác 100% khi chạy ở Client
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`,
    zalo: `https://zalo.me/share?url=${encodeURIComponent(currentUrl)}`
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch(e) {
      console.error("Copy failed", e);
    }
  };

  return (
    <div 
      ref={menuRef}
      className="absolute top-24 right-4 sm:top-28 sm:right-6 z-[60] flex flex-col items-center gap-2"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Main Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-gray-800 shadow-xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 hover:text-blue-600 transition-all z-10"
        title="Chia sẻ mạng xã hội"
      >
        <Share2 className="w-5 h-5" />
      </button>

      {/* Expanded items */}
      <div 
        className={`flex flex-col gap-2.5 bg-white/50 backdrop-blur-md p-1.5 rounded-full border border-gray-100/50 shadow-lg transition-all duration-300 origin-top
          ${isOpen 
            ? "translate-y-0 opacity-100 pointer-events-auto" 
            : "-translate-y-4 opacity-0 pointer-events-none absolute top-12"
          }
        `}
      >
        <a 
          href={shareLinks.facebook} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          title="Chia sẻ lên Facebook"
        >
           <Facebook className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
        </a>
        
        <a 
          href={shareLinks.zalo} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          title="Gửi Zalo"
        >
           {/* Custom Text/Icon for Zalo */}
           <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-current opacity-90" />
           <span className="sr-only">Zalo</span>
        </a>

        <a 
          href={shareLinks.twitter} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          title="Đăng Tweet"
        >
           <Twitter className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
        </a>

        <button 
          onClick={handleCopy} 
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform ${copied ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}
          title="Copy Link"
        >
           {copied ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
      </div>
    </div>
  );
}
