import Image from 'next/image';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext
} from "@/components/ui/carousel"
import { cn } from '@/lib/utils';

type CarouselEventProps = {
    images: string[];
    base?: string;
}
export function CarouselEvent({ images , base = "md:basis-1/2"}: CarouselEventProps) {
    return (
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full"
        >
            <CarouselContent>
                {images.map((_, index) => (
                    <CarouselItem key={index} className={cn(base)}>
                        <div className="p-1">
                            <Image
                                src={_}
                                alt=""
                                width={1920}
                                height={1080}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselNext />
        </Carousel>
    )
}
