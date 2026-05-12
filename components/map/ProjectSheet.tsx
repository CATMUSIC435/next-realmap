"use client";
import { useMapStore } from "@/hooks/useMapStore";
import { Sheet, SheetContent, SheetFooter, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function ProjectSheet() {
  const { isSheetOpen, setIsSheetOpen, selectedProject: selected } = useMapStore();

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetContent side="right" className="w-[100vw] sm:w-[400px] md:w-[500px] overflow-y-auto no-scrollbar font-sans border-l border-gray-100 shadow-2xl p-0">
        {selected && (
          <div className="flex flex-col">
            <div className="relative w-full aspect-[4/3] bg-gray-100">
              <Image
                src={selected.originalData?.acf?.banner_img || selected.image}
                alt={selected.title}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-6 right-6 flex flex-col items-start">
                {selected.originalData?.acf?.logo_white && (
                  <div className="relative h-12 w-32 mb-2">
                     <Image src={selected.originalData.acf.logo_white} alt="Logo" fill className="object-contain object-left" />
                  </div>
                )}
                <SheetTitle className="text-2xl font-bold text-white mb-1 shadow-sm text-left">
                  {selected.originalData?.acf?.tq_title || selected.title}
                </SheetTitle>
                {selected.originalData?.acf?.tq_title_sub && (
                  <p className="text-sm text-yellow-500 font-semibold mb-2 drop-shadow-md">
                    {selected.originalData.acf.tq_title_sub}
                  </p>
                )}
                <p className="text-sm text-gray-200 flex items-center gap-1.5 opacity-90 drop-shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  {(() => {
                    const text = selected.originalData?.acf?.gt_location || selected.originalData?.acf?.vị_tri || "";
                    const isCoord = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(text);
                    if (isCoord || !text) return "Đang cập nhật vị trí";
                    return text;
                  })()}
                </p>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-6">
              {(selected.originalData?.acf?.tq_list && Array.isArray(selected.originalData.acf.tq_list) && selected.originalData.acf.tq_list.length > 0) ? (
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 space-y-3 text-sm">
                  {selected.originalData.acf.tq_list.map((item: any, idx: number) => (
                    <div key={idx} className={`flex items-center justify-between ${idx !== selected.originalData.acf.tq_list.length -1 ? 'border-b border-blue-100 pb-2' : ''}`}>
                      <div className="flex items-center gap-2">
                        {item.img && <img src={item.img} alt={item.title} className="w-4 h-4 object-contain brightness-0 opacity-50" />}
                        <span className="text-gray-500 font-medium">{item.title}</span>
                      </div>
                      <span className="font-semibold text-gray-900 text-right max-w-[60%]">{item.desc}</span>
                    </div>
                  ))}
                </div>
              ) : null}
              
              {selected.originalData?.acf?.gt_desc ? (
                <p className="text-sm text-gray-600 leading-relaxed text-justify">
                  {selected.originalData.acf.gt_desc}
                </p>
              ) : selected.originalData?.excerpt?.rendered ? (
                <div 
                  className="text-sm text-gray-600 leading-relaxed text-justify line-clamp-4"
                  dangerouslySetInnerHTML={{__html: selected.originalData.excerpt.rendered}}
                />
              ) : (
                <p className="text-sm text-gray-600 leading-relaxed text-justify line-clamp-4">
                  Để biết thêm chi tiết về {selected.title}, bảng giá hiện tại, chính sách bán hàng và tham quan thực tế, quý khách vui lòng xem thông tin chi tiết của dự án.
                </p>
              )}

              <SheetFooter className="mt-2">
                <Link href={`/du-an/${selected.originalData?.slug || selected.id}`} className="w-full">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl h-12 shadow-lg shadow-blue-500/25 transition-all font-medium text-base">
                    Xem chi tiết bản đồ
                  </Button>
                </Link>
              </SheetFooter>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
