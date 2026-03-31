"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Loader2, ExternalLink, Image as ImageIcon } from "lucide-react";

interface SingleProjectVideoSheetProps {
  slug: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectData?: any; // Dữ liệu dự án đã lấy được từ map gốc
}

// Component con hiển thị thẻ tin tức (tự động lấy ảnh từ API)
function NewsCard({ link, idx, getNewsTitle }: { link: string; idx: number; getNewsTitle: any }) {
  const [data, setData] = useState<{ title?: string; image?: string; description?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const validLink = link.startsWith('http') ? link : `https://${link}`;
  const domain = new URL(validLink).hostname.replace('www.', '');

  useEffect(() => {
    const fetchLinkPreview = async () => {
      try {
        const res = await fetch(`/api/link-preview?url=${encodeURIComponent(validLink)}`);
        const result = await res.json();
        if (result && !result.error) {
          setData(result);
        }
      } catch (err) {
        console.error("Lỗi tải thông tin bài báo:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLinkPreview();
  }, [validLink]);

  const displayTitle = data?.title || getNewsTitle(validLink, idx);

  return (
    <a 
      href={validLink} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex flex-col rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all group bg-white h-full"
    >
      <div className="relative w-full aspect-[16/9] bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
        {loading ? (
          <div className="animate-pulse bg-gray-200 w-full h-full"></div>
        ) : data?.image ? (
          <img src={data.image} alt={displayTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full bg-blue-50/50 flex flex-col items-center justify-center text-blue-300 gap-2">
            <ImageIcon className="w-10 h-10" />
            <span className="text-xs font-semibold uppercase">{domain}</span>
          </div>
        )}
      </div>
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <span className="text-[10px] sm:text-xs font-bold text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-1">
          <ExternalLink className="w-3 h-3" />
          {domain}
        </span>
        <h3 className="text-gray-900 font-bold text-base sm:text-[17px] leading-snug group-hover:text-blue-700 line-clamp-2" title={displayTitle}>
          {displayTitle}
        </h3>
        {data?.description && (
          <p className="text-gray-500 text-sm mt-3 line-clamp-2 leading-relaxed">{data.description}</p>
        )}
      </div>
    </a>
  );
}

const SingleProjectVideoSheet = ({
  slug,
  isOpen,
  onOpenChange,
  projectData
}: SingleProjectVideoSheetProps) => {
  const [activeTab, setActiveTab] = useState("video");
  
  // Reset tab when newly opened
  useEffect(() => {
    if (isOpen) setActiveTab("video");
  }, [isOpen]);

  const acf = projectData?.acf || {};

  // Helper functions for parsing URLs into Embed IDs
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\n]+)/);
    return match ? match[1] : null;
  };

  const getTiktokId = (url: string) => {
    if (!url) return null;
    const match = url.match(/video\/(\d+)/);
    return match ? match[1] : null;
  };

  // Hàm chuyển đổi dữ liệu thô (có thể phân tách bằng dấu phẩy, khoảng trắng hoặc xuống dòng) thành mảng links
  const parseLinks = (data: any) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "string") {
      // Tách theo dấu phẩy hoặc xuống dòng
      return data.split(/[\n,]+/).map(url => url.trim()).filter(Boolean);
    }
    return [];
  };

  // Hàm tạo ra tiêu đề đẹp từ cái URL của bài báo (Ví dụ: 24h.com.vn - Bai Toan Lai Suat)
  const getNewsTitle = (url: string, index: number) => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      const domain = urlObj.hostname.replace('www.', '');
      
      // Lấy phần đường dẫn cuối cùng
      const pathSegments = urlObj.pathname.split('/').filter(Boolean);
      let lastSegment = pathSegments[pathSegments.length - 1] || '';
      lastSegment = lastSegment.replace(/\.html?|\.php|\.chn|\.htm/g, '').replace(/-/g, ' ');
      
      // Chữ cái đầu viết hoa
      if (lastSegment) {
        lastSegment = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
      }
      
      return lastSegment ? `${domain}: ${lastSegment.substring(0, 70)}...` : `Tin tức từ ${domain}`;
    } catch {
      return `Bài báo tham khảo số ${index + 1}`;
    }
  };

  const ytVideos = parseLinks(acf.video_youtube);
  const ttVideos = parseLinks(acf.video_tiktok);
  const newsLinks = parseLinks(acf.tin_tuc); // Thay thế key đúng với cấu hình ACF của bạn
  const fbLinks = parseLinks(acf.facebook_post); // Thay thế key đúng với cấu hình ACF của bạn

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="w-[98vw] sm:w-[94vw] max-w-[1200px] h-[92vh] max-h-[1200px] overflow-y-auto overflow-x-hidden no-scrollbar font-sans border border-gray-200 shadow-2xl p-0 bg-white sm:rounded-2xl flex flex-col gap-0 outline-none">
        <DialogTitle className="sr-only">Video Review Dự Án</DialogTitle>
        
        <div className="flex flex-col flex-1 bg-white relative pb-12 rounded-t-2xl">
            
            {/* Header Sticky Container */}
            <div className="sticky top-0 z-[100] bg-white/95 backdrop-blur-xl border-b border-gray-200 pt-16 sm:pt-12 pb-0 px-6 shadow-sm flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Thư Viện Truyền Thông</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{projectData?.title?.rendered || projectData?.title || slug}</p>
                    {acf.link_page && (
                      <a 
                        href={acf.link_page.startsWith('http') ? acf.link_page : `https://${acf.link_page}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 text-[10px] sm:text-xs font-bold uppercase rounded-full transition-all"
                      >
                        Web Dự án <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Tabs Navigation */}
              <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                {[
                  { id: "video", label: "Video Review" },
                  { id: "news", label: "Tin tức" },
                  { id: "facebook", label: "Facebook Post" }
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`pb-3 text-sm sm:text-base font-bold transition-all duration-300 uppercase tracking-wider relative whitespace-nowrap outline-none
                        ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}
                      `}
                    >
                      {tab.label}
                      {isActive && (
                        <span className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-blue-600 rounded-t-md shadow-[0_0_10px_rgba(37,99,235,0.5)]"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 bg-white">
                <div className="p-6 sm:p-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                  
                  {/* TAB VIDEO */}
                  {activeTab === "video" && (
                    <>
                      {ytVideos.length === 0 && ttVideos.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 border border-gray-200 shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800 mb-2">Chưa có Video đánh giá</h3>
                          <p className="text-gray-500 max-w-sm">Quản trị viên đang cập nhật các video review tốt nhất cho dự án này. Vui lòng quay lại sau.</p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-12">
                      
                      {/* YOUTUBE SECTION */}
                      {ytVideos.length > 0 && (
                        <div className="space-y-6">
                           <div className="flex items-center gap-3">
                             <div className="p-2 bg-red-100 rounded-lg text-red-600">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#fff"/></svg>
                             </div>
                             <h3 className="text-xl font-bold text-gray-800 tracking-tight">Trải nghiệm trên YouTube</h3>
                           </div>
                           
                           <Carousel opts={{ align: "start", loop: false }} className="w-full relative px-0 sm:px-12">
                             <CarouselContent className="ml-0 sm:-ml-4 px-4 sm:px-0">
                               {ytVideos.map((item: any, idx: number) => {
                                 const urlString = typeof item === 'string' ? item : (item.url || item.link || "");
                                 const id = getYoutubeId(urlString);
                                 if (!id) return null;
                                 return (
                                   <CarouselItem key={`yt-${idx}`} className="pl-3 sm:pl-4 basis-[90%] md:basis-1/2 lg:basis-1/2">
                                     <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-black aspect-video relative group">
                                        <iframe 
                                          className="absolute inset-0 w-full h-full"
                                          src={`https://www.youtube.com/embed/${id}?autoplay=0&rel=0`}
                                          title={`YouTube video player ${idx}`}
                                          frameBorder="0"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowFullScreen
                                        ></iframe>
                                     </div>
                                   </CarouselItem>
                                 );
                               })}
                             </CarouselContent>
                             <div className="flex justify-center gap-4 mt-6 sm:mt-0 sm:absolute sm:top-1/2 sm:-translate-y-1/2 sm:w-full sm:left-0 sm:right-0 sm:justify-between pointer-events-none px-0 sm:px-2">
                               <CarouselPrevious className="pointer-events-auto static sm:absolute shrink-0 left-0 translate-y-0 sm:-translate-y-1/2 translate-x-0 h-12 w-12 sm:h-12 sm:w-12 bg-white text-gray-800 shadow-md border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200" />
                               <CarouselNext className="pointer-events-auto static sm:absolute shrink-0 right-0 translate-y-0 sm:-translate-y-1/2 translate-x-0 h-12 w-12 sm:h-12 sm:w-12 bg-white text-gray-800 shadow-md border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200" />
                             </div>
                           </Carousel>
                        </div>
                      )}

                      {/* TIKTOK SECTION */}
                      {ttVideos.length > 0 && (
                        <div className="space-y-6">
                           <div className="flex items-center gap-3">
                             <div className="p-2 bg-black rounded-lg text-white">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 6.26 6.32 6.32 6.32 0 0 0 6.32-6.32V10a8.16 8.16 0 0 0 4.25 1.25V7.79a5.1 5.1 0 0 1-2.24-1.1z"/></svg>
                             </div>
                             <h3 className="text-xl font-bold text-gray-800 tracking-tight">Review ngắn từ TikTok</h3>
                           </div>

                           <Carousel opts={{ align: "start", loop: false }} className="w-full relative px-0 sm:px-12 mt-4">
                             <CarouselContent className="ml-0 sm:-ml-4 px-4 sm:px-0">
                               {ttVideos.map((item: any, idx: number) => {
                                 const urlString = typeof item === 'string' ? item : (item.url || item.link || "");
                                 const id = getTiktokId(urlString);
                                 if (!id) return null;
                                 return (
                                   <CarouselItem key={`tt-${idx}`} className="pl-3 sm:pl-4 basis-[90%] sm:basis-1/2 lg:basis-1/2">
                                     <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-gray-50 flex justify-center w-full min-h-[650px]">
                                        <iframe 
                                          className="w-full h-[650px] sm:h-[720px] md:h-[820px] max-w-[450px]"
                                          src={`https://www.tiktok.com/embed/v2/${id}`}
                                          allow="encrypted-media;"
                                          title={`TikTok video ${idx}`}
                                        ></iframe>
                                     </div>
                                   </CarouselItem>
                                 );
                               })}
                             </CarouselContent>
                             <div className="flex justify-center gap-4 mt-6 sm:mt-0 sm:absolute sm:top-1/2 sm:-translate-y-1/2 sm:w-full sm:left-0 sm:right-0 sm:justify-between pointer-events-none px-0 sm:px-2">
                               <CarouselPrevious className="pointer-events-auto static sm:absolute shrink-0 left-0 translate-y-0 sm:-translate-y-1/2 translate-x-0 h-12 w-12 sm:h-12 sm:w-12 bg-white text-gray-800 shadow-md border border-gray-200 hover:bg-gray-100" />
                               <CarouselNext className="pointer-events-auto static sm:absolute shrink-0 right-0 translate-y-0 sm:-translate-y-1/2 translate-x-0 h-12 w-12 sm:h-12 sm:w-12 bg-white text-gray-800 shadow-md border border-gray-200 hover:bg-gray-100" />
                             </div>
                           </Carousel>
                        </div>
                      )}

                    </div>
                  )}
                  </>
                  )}

                  {/* TAB TIN TỨC */}
                  {activeTab === "news" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {newsLinks.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                          <h3 className="text-lg font-bold text-gray-800 mb-2">Chưa có tin tức</h3>
                          <p className="text-gray-500">Dự án này chưa được cập nhật bài báo nào.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
                          {newsLinks.map((link: string, idx: number) => (
                            <NewsCard 
                              key={idx} 
                              link={link} 
                              idx={idx} 
                              getNewsTitle={getNewsTitle} 
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB FACEBOOK */}
                  {activeTab === "facebook" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
                      {fbLinks.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                          <h3 className="text-lg font-bold text-gray-800 mb-2">Chưa có bài đăng Facebook</h3>
                          <p className="text-gray-500">Dự án này chưa được cập nhật chiến dịch mạng xã hội.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full place-items-center">
                          {fbLinks.map((inputStr: string, idx: number) => {
                            let iframeSrc = inputStr;
                            
                            // Nếu đầu vào có chứa thẻ <iframe src="..."> thì bóc tách lấy riêng URL src
                            const srcMatch = inputStr.match(/src=["'](.*?)["']/i);
                            if (srcMatch) {
                              // Giải mã &amp; nếu có để link hoạt động đúng chuẩn
                              iframeSrc = srcMatch[1].replace(/&amp;/g, '&');
                            } else {
                              // Nếu người dùng chỉ dán cái link (Trường hợp cũ)
                              const validLink = inputStr.startsWith('http') ? inputStr : `https://${inputStr}`;
                              iframeSrc = `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(validLink)}&show_text=true&width=500`;
                            }

                            return (
                              <div key={idx} className="w-full max-w-[500px] overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white flex justify-center">
                                <iframe
                                  src={iframeSrc}
                                  width="500"
                                  height="650"
                                  style={{ border: 'none', overflow: 'hidden', width: '100%', minHeight: '500px' }}
                                  scrolling="no"
                                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                  loading="lazy"
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                </div>
            </div>
          </div>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(SingleProjectVideoSheet);
