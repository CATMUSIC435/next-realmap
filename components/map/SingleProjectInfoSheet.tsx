"use client";
import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface SingleProjectInfoSheetProps {
  slug: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const SingleProjectInfoSheet = ({
  slug,
  isOpen,
  onOpenChange
}: SingleProjectInfoSheetProps) => {
  const [projectData, setProjectData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("tong-quan");

  useEffect(() => {
    if (isOpen && !projectData && !isLoading) {
      const fetchProject = async () => {
        setIsLoading(true);
        setError("");
        try {
          const res = await fetch(`https://dxmdvietnam.vn/wp-json/wp/v2/du-an?slug=${slug}`);
          const data = await res.json();
          if (data && data.length > 0) {
            setProjectData(data[0]);
          } else {
            setError("Không tìm thấy thông tin chi tiết dự án.");
          }
        } catch (err) {
          console.error("Failed to fetch project info:", err);
          setError("Lỗi khi tải thông tin dự án.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchProject();
    }
  }, [isOpen, slug, projectData]);

  // Reset tab when newly opened
  useEffect(() => {
    if (isOpen) {
      setActiveTab("tong-quan");
    }
  }, [isOpen]);

  const tabs = [
    { id: "tong-quan", label: "Tổng quan" },
    { id: "vi-tri", label: "Vị trí" },
    { id: "tien-ich", label: "Tiện ích" },
    { id: "mat-bang", label: "Mặt bằng" },
    { id: "san-pham", label: "Thiết kế" },
    { id: "thu-vien", label: "Thư viện ảnh" },
  ];

  const acf = projectData?.acf || {};

  // Standard Typography classes for safely rendering WordPress HTML Content responsively
  const htmlProseClasses = "prose max-w-none prose-sm sm:prose-base prose-img:w-full prose-img:h-auto prose-img:rounded-xl prose-a:text-blue-600 prose-p:break-words text-gray-700 text-justify leading-relaxed sm:leading-loose";

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px] overflow-y-auto overflow-x-hidden no-scrollbar font-sans border-l border-gray-200 shadow-2xl p-0 bg-white">
        <SheetTitle className="sr-only">Chi tiết dự án</SheetTitle>
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-blue-600 bg-white">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm font-medium">Đang tải thông tin...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="p-8 text-center text-red-500 bg-white h-full flex items-center justify-center">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {projectData && !isLoading && (
          <div className="flex flex-col min-h-full bg-white relative pb-12">
            
            {/* Header Sticky - Tabs Navigation */}
            <div className="sticky top-0 z-[100] bg-white/95 backdrop-blur-xl border-b border-gray-200 pt-16 sm:pt-14 pb-1 sm:pb-3 px-4 sm:px-6 flex items-end gap-5 sm:gap-8 overflow-x-auto no-scrollbar shadow-sm min-h-[75px] sm:min-h-[80px] overscroll-contain touch-pan-x snap-x snap-mandatory">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap px-2 sm:px-1 pb-3 sm:pb-2 text-[14px] sm:text-[16px] font-bold transition-all duration-300 uppercase tracking-wider sm:tracking-widest relative outline-none snap-center
                      ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}
                    `}
                  >
                    {tab.label}
                    {isActive && (
                      <span className="absolute bottom-[-13px] left-0 w-full h-[3px] bg-blue-600 rounded-t-md shadow-[0_0_10px_rgba(37,99,235,0.5)]"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content Container */}
            <div className="flex-1 bg-white">
              
              {/* TAB: TỔNG QUAN */}
              {activeTab === "tong-quan" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Banner */}
                  <div className="relative w-full aspect-video sm:aspect-[21/9] bg-gray-100">
                    <Image
                      src={acf.banner_img || acf.logo || '/images/default.jpg'}
                      alt={projectData.title?.rendered || "Dự án"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6 flex flex-col items-start px-2">
                      {acf.logo_white && (
                        <div className="relative h-14 w-40 mb-3">
                           <Image src={acf.logo_white} alt="Logo" fill className="object-contain object-left drop-shadow-lg" />
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-4 mb-2">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white shadow-sm text-left">
                          {acf.tq_title || projectData.title?.rendered}
                        </h2>
                        {acf.link_page && (
                          <a 
                            href={acf.link_page.startsWith('http') ? acf.link_page : `https://${acf.link_page}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 text-[10px] sm:text-xs font-bold uppercase rounded-full transition-all shadow-lg hover:shadow-xl"
                          >
                            Web Dự Án
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          </a>
                        )}
                      </div>
                      {acf.tq_title_sub && (
                        <p className="text-base sm:text-lg text-yellow-500 font-semibold mb-3 drop-shadow-md tracking-wider uppercase">
                          {acf.tq_title_sub}
                        </p>
                      )}
                      <p className="text-sm sm:text-base text-gray-200 flex items-center gap-2 opacity-95 drop-shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        {acf.vị_tri || acf.gt_location || "Đang cập nhật vị trí"}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 flex flex-col gap-8 max-w-[800px] mx-auto">
                    {/* Danh sách thông số nổi bật */}
                    {(acf.tq_list && Array.isArray(acf.tq_list) && acf.tq_list.length > 0) ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {acf.tq_list.map((item: any, idx: number) => (
                          <div key={idx} className="bg-blue-50/40 p-5 rounded-2xl border border-blue-50/80 flex items-start gap-3 hover:bg-blue-50/80 transition-colors">
                            <div className="p-2 bg-white rounded-xl shadow-sm border border-blue-100/50 shrink-0">
                               {item.img ? <img src={item.img} alt={item.title} className="w-5 h-5 object-contain opacity-70" /> : <div className="w-5 h-5 bg-blue-100 rounded-full"/>}
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-semibold text-blue-600/80 uppercase tracking-widest">{item.title}</span>
                              <span className="font-semibold text-gray-900 text-sm leading-relaxed">{item.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    
                    {/* Giới thiệu text */}
                    <div className="mt-8">
                      {acf.gt_desc ? (
                        <p className="text-base leading-loose text-justify whitespace-pre-line text-gray-700">
                          {acf.gt_desc}
                        </p>
                      ) : projectData.excerpt?.rendered ? (
                        <div className={htmlProseClasses} dangerouslySetInnerHTML={{__html: projectData.excerpt.rendered}} />
                      ) : (
                        <p className="text-base text-gray-500 italic">Đang cập nhật thông tin giới thiệu.</p>
                      )}
                      
                      {projectData.content?.rendered && (
                        <div 
                          className={`mt-6 ${htmlProseClasses}`}
                          dangerouslySetInnerHTML={{__html: projectData.content.rendered}}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: VỊ TRÍ */}
              {activeTab === "vi-tri" && (
                <div className="p-6 sm:p-8 max-w-[800px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-6 border-l-4 border-blue-600 pl-4">
                     <h2 className="text-2xl font-bold text-gray-900">{acf.vt_title || "Vị Trí Dự Án"}</h2>
                     {acf.vt_title_sub && <p className="text-blue-600 font-semibold mt-1 uppercase text-sm">{acf.vt_title_sub}</p>}
                  </div>
                  
                  {acf.vt_img && (
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-xl mb-8 border border-gray-100">
                      <Image src={acf.vt_img} alt="Vị trí" fill className="object-cover" />
                    </div>
                  )}

                  {acf.vt_content && (
                    <div className={htmlProseClasses} dangerouslySetInnerHTML={{__html: acf.vt_content}} />
                  )}
                </div>
              )}

              {/* TAB: TIỆN ÍCH */}
              {activeTab === "tien-ich" && (
                <div className="p-6 sm:p-8 max-w-[800px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-6 border-l-4 border-green-500 pl-4">
                     <h2 className="text-2xl font-bold text-gray-900">{acf.ti_title || "Tiện Ích Nội Khu"}</h2>
                     {acf.ti_title_sub && <p className="text-green-600 font-semibold mt-1 uppercase text-sm">{acf.ti_title_sub}</p>}
                  </div>

                  {acf.ti_desc && (
                    <div className={`${htmlProseClasses} mb-8`} dangerouslySetInnerHTML={{__html: acf.ti_desc}} />
                  )}

                  {(acf.ti_list && Array.isArray(acf.ti_list)) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {acf.ti_list.map((item: any, idx: number) => (
                        <div key={idx} className="group relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white aspect-[4/3]">
                          {item.img && (
                            <Image src={item.img} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                          )}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-900/90 to-transparent p-5 pt-12">
                            <h3 className="text-white font-bold text-lg">{item.title}</h3>
                            {item.sub_title && <p className="text-green-400 text-sm font-medium">{item.sub_title}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: MẶT BẰNG */}
              {activeTab === "mat-bang" && (
                <div className="p-6 sm:p-8 max-w-[800px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-6 border-l-4 border-orange-500 pl-4">
                     <h2 className="text-2xl font-bold text-gray-900">{acf.mb_title || "Mặt Bằng Dự Án"}</h2>
                     {acf.mb_title_sub && <p className="text-orange-600 font-semibold mt-1 uppercase text-sm">{acf.mb_title_sub}</p>}
                  </div>

                  {acf.mb_content && (
                    <div className={`${htmlProseClasses} mb-8`} dangerouslySetInnerHTML={{__html: acf.mb_content}} />
                  )}

                  {acf.mb_img && (
                    <div className="relative w-full aspect-auto min-h-[400px] sm:min-h-[500px] rounded-3xl overflow-hidden bg-gray-50 border border-gray-200">
                      <Image src={acf.mb_img} alt="Mặt bằng" fill className="object-contain" />
                    </div>
                  )}
                </div>
              )}

              {/* TAB: SẢN PHẨM / THIẾT KẾ */}
              {activeTab === "san-pham" && (
                <div className="p-6 sm:p-8 max-w-[800px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="mb-6 border-l-4 border-purple-600 pl-4">
                     <h2 className="text-2xl font-bold text-gray-900">{acf.sp_title || "Thiết Kế Căn Hộ"}</h2>
                     {acf.sp_title_sub && <p className="text-purple-600 font-semibold mt-1 uppercase text-sm">{acf.sp_title_sub}</p>}
                  </div>

                  {acf.sp_desc && (
                    <div className={`${htmlProseClasses} mb-8`} dangerouslySetInnerHTML={{__html: acf.sp_desc}} />
                  )}

                  {(acf.sp_list && Array.isArray(acf.sp_list)) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {acf.sp_list.map((item: any, idx: number) => (
                        <div key={idx} className="flex flex-col gap-4">
                          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-gray-100 group">
                            {item.img ? (
                              <Image src={item.img} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">No Image</div>
                            )}
                          </div>
                          <h3 className="text-center font-bold text-gray-800 text-lg">{item.title}</h3>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: THƯ VIỆN ẢNH */}
              {activeTab === "thu-vien" && (
                <div className="p-6 sm:p-8 mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="mb-8 border-l-4 border-rose-500 pl-4">
                     <h2 className="text-2xl font-bold text-gray-900">Thư Viện Hình Ảnh</h2>
                     <p className="text-rose-600 font-semibold mt-1 uppercase text-sm">Hình ảnh thực tế & phối cảnh</p>
                  </div>

                  {(acf.tv_imgs && Array.isArray(acf.tv_imgs) && acf.tv_imgs.length > 0) ? (
                    <div className="columns-1 sm:columns-2 gap-6 space-y-6">
                      {acf.tv_imgs.map((item: any, idx: number) => (
                        <div key={idx} className="break-inside-avoid relative group rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                           <div className="relative w-full">
                              <img src={item.img} alt={item.title || `Gallery ${idx}`} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" />
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <p className="text-white font-medium text-center">{item.title}</p>
                              </div>
                           </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-center py-10">Dự án chưa cập nhật thư viện ảnh.</p>
                  )}
                </div>
              )}

            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default React.memo(SingleProjectInfoSheet);
