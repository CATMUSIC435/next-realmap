import { CarouselEvent } from "@/components/carousel-event";
import { LIST_IMAGE, LIST_IMAGE_PLAN, LIST_IMAGE_UTL } from "@/mocks/images";
import Image from "next/image";

export default function Project() {
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
                    <div className="absolute top-0 lefft-0">
                        <h2 className="text-4xl font-bold w-full text-center">Diamond Boulevard</h2>
                    </div>
                </div>

                <div className="px-2 md:gap-8 overflow-y-scroll overflow-x-hidden">
                    <div className="w-fulll">
                        <div className="text-sm text-gray-600">
                            <p className="line-clamp-3">
                                Với một bước từ Fenica, cư dân tiếp cận nhanh 2 siêu hạ tầng của TP. Hồ Chí Minh: đường Vành đai 3 & Metro Suối Tiên - Thủ Dầu Một, mở ra lối sống mới di chuyển nhanh chóng, an toàn, thân thiện môi trường.
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="max-w-xl py-4 text-xs">
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
                            <p className="line-clamp-3">
                                Với một bước từ Fenica, cư dân tiếp cận nhanh 2 siêu hạ tầng của TP. Hồ Chí Minh: đường Vành đai 3 & Metro Suối Tiên - Thủ Dầu Một, mở ra lối sống mới di chuyển nhanh chóng, an toàn, thân thiện môi trường.
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="py-4">
                            <CarouselEvent images={LIST_IMAGE_PLAN} base="md:basis" />
                        </div>
                    </div>

                    <div>
                        <div className="py-4">
                            <CarouselEvent images={LIST_IMAGE} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
