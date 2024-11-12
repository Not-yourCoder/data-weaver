import { Skeleton } from "@/components/ui/skeleton"

type Props = {}

const SkeletonLoader = (props: Props) => {
    function getRandomWidths(count) {
        const widths = [];
        for (let i = 0; i < count; i++) {
            widths.push(Math.floor(Math.random() * (140 - 70 + 1)) + 70);
        }
        return widths;
    }

    // Generate an array of 5 random widths, one for each Skeleton
    const randomWidths = getRandomWidths(18);

    return (
        <div className="mb-4">
            <Skeleton className="rounded-full w-36 h-7 my-4"
            />
            <div className="w-full flex flex-wrap gap-2">
                {randomWidths.map((width, index) => (
                    <Skeleton
                        key={index}
                        style={{ width: `${width}px`, height: "30px" }}
                        className="rounded-full"
                    />
                ))}
            </div>
        </div>
    );
}

export default SkeletonLoader;
