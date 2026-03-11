import { CarouselEvent } from "@/components/carousel-event";
import { LIST_IMAGE, LIST_IMAGE_PLAN, LIST_IMAGE_UTL } from "@/mocks/images";
import Image from "next/image";

export default function ProjectDetail() {
    return (
        <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
            <main className="flex min-h-screen w-full flex-col items-center justify-between bg-white dark:bg-black sm:items-start">
                <div className="h-auto w-screen relative">
                    <Image
                        alt=""
                        height={1080}
                        width={1920}
                        src="/images/diamond-boulevard-dark-1.png"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-[20%] left-0 w-screen">
                        <h2 className="text-white text-6xl font-bold w-full text-center">Diamond Boulevard</h2>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto w-full font-merri">
                    <div className="px-2 md:gap-8 overflow-y-scroll overflow-x-hidden">
                        <div className="w-full py-4">
                            <div className="text-gray-600">
                                <p className="line-clamp-3">
                                    Với một bước từ Fenica, cư dân tiếp cận nhanh 2 siêu hạ tầng của TP. Hồ Chí Minh: đường Vành đai 3 & Metro Suối Tiên - Thủ Dầu Một, mở ra lối sống mới di chuyển nhanh chóng, an toàn, thân thiện môi trường.
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="max-w-xl py-4 mx-auto">
                                <table className="w-full text-left border-collapse">

                                    <tbody>

                                        <tr className="border-b border-gray-600/80">
                                            <td className="py-3 w-40 opacity-80">Vị trí:</td>
                                            <td className="py-3 font-semibold">
                                                Đường Trần Quang Diệu, Phường Tân Đông Hiệp, Thành phố Hồ Chí Minh
                                            </td>
                                        </tr>

                                        <tr className="border-b border-gray-600/80">
                                            <td className="py-3 opacity-80">Tổng diện tích:</td>
                                            <td className="py-3 font-semibold">5.537m2</td>
                                        </tr>

                                        <tr className="border-b border-gray-600/80">
                                            <td className="py-3 opacity-80">Quy mô:</td>
                                            <td className="py-3 font-semibold">
                                                2 block, 2 tầng hầm & 2 tầng TTTM
                                            </td>
                                        </tr>

                                        <tr className="border-b border-gray-600/80">
                                            <td className="py-3 opacity-80">Chiều cao:</td>
                                            <td className="py-3 font-semibold">22 tầng</td>
                                        </tr>

                                        <tr className="border-b border-gray-600/80">
                                            <td className="py-3 opacity-80">Nhà thầu:</td>
                                            <td className="py-3 font-semibold">
                                                Liên danh Phước Thành & CCcons
                                            </td>
                                        </tr>

                                        <tr className="border-b border-gray-600/80">
                                            <td className="py-3 opacity-80">Pháp lý sở hữu:</td>
                                            <td className="py-3 font-semibold">Sở hữu lâu dài</td>
                                        </tr>

                                        <tr>
                                            <td className="py-3 opacity-80">Căn hộ:</td>
                                            <td className="py-3 font-semibold">579 căn</td>
                                        </tr>

                                    </tbody>

                                </table>
                            </div>
                        </div>

                        <div>
                            <Image
                                alt=""
                                height={1080}
                                width={1920}
                                src={"/images/map-new.png"}
                                className="w-full h-auto object-cover"
                            />
                        </div>

                        <div className="w-fulll">
                            <div className="text-sm text-gray-600">
                                <h3 className="text-xl font-bold py-2 text-center">Nhịp sống năng động giữa trung tâm phồn hoa</h3>
                                <p className="line-clamp-3">
                                    Với một bước từ Fenica, cư dân tiếp cận nhanh 2 siêu hạ tầng của TP. Hồ Chí Minh: đường Vành đai 3 & Metro Suối Tiên - Thủ Dầu Một, mở ra lối sống mới di chuyển nhanh chóng, an toàn, thân thiện môi trường.
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="py-4">
                                <CarouselEvent images={LIST_IMAGE_UTL} base="md:basis" />
                            </div>
                        </div>

                        <div className="w-fulll">
                            <div className="text-sm text-gray-600">
                                <h3 className="text-xl font-bold py-2 text-center">Nhịp sống năng động giữa trung tâm phồn hoa</h3>
                                <p className="line-clamp-3">
                                    Sở hữu ngay mặt tiền Quốc lộ 13 – Trục thương mại sôi động bậc nhất, Diamond Boulevard kết nối trực tiếp với chuỗi tiện ích hàng đầu như: Ga Metro C7, Aeon Mall, Lotte Mart, Bệnh viện Quốc tế Becamex… mở ra mạng lưới di chuyển nhanh chóng đến mọi điểm nóng của TP.HCM.
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="py-4">
                                <CarouselEvent images={LIST_IMAGE_PLAN} base="md:basis" />
                            </div>
                        </div>

                        <div className="w-fulll">
                            <div className="text-sm text-gray-600">
                                <h3 className="text-xl font-bold py-2 text-center">Tiện ích ngoại khu</h3>
                                <p className="line-clamp-3">
                                    Sở hữu ngay mặt tiền Quốc lộ 13 – Trục thương mại sôi động bậc nhất, Diamond Boulevard kết nối trực tiếp với chuỗi tiện ích hàng đầu như: Ga Metro C7, Aeon Mall, Lotte Mart, Bệnh viện Quốc tế Becamex… mở ra mạng lưới di chuyển nhanh chóng đến mọi điểm nóng của TP.HCM.
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="py-4">
                                <CarouselEvent images={LIST_IMAGE} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
