import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext
} from "@/components/ui/carousel"
import { SquareArrowUpRight } from "lucide-react";
import { FacebookPost } from "./facebook-post";

type CarouselEventProps = {
    images: string[];
}
export function CarouselEvent({ images }: CarouselEventProps) {
    return (
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full max-w-xl"
        >
            <CarouselContent>
                {images.map((_, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 relative">
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-1 relative">
                                    <Image
                                        src={_}
                                        alt=""
                                        width={1920}
                                        height={1080}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="absolute top-2 right-2">
                            <Tooltip>
                                <TooltipTrigger>
                                    <SquareArrowUpRight className="text-cyan-600" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="w-80 h-80 bg-white overflow-y-auto overflow-x-hidden">
                                        <FacebookPost url="https://www.facebook.com/photo/?fbid=1268228988655902&set=pb.100064064377647"
                                            width={190} />
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselNext />
        </Carousel>
    )
}
