import { centerGraph } from '@/utils/helpers';
import { SquareSquare, ZoomIn, ZoomOut } from 'lucide-react';

type Props = {
    graphData: any
    fgRef: any
    zoomIn: () => void
    zoomOut: () => void
}

const Interactions = ({ graphData, fgRef, zoomIn, zoomOut }: Props) => {
    const isGraphDataLoaded = graphData && graphData.nodes?.length > 0;
    return (
        <div className='absolute top-4 flex flex-col gap-1'>
            {/* <RealignNodes graphData={graphData} setGraphData={setGraphData} /> */}
            <div className=' bg-white rounded-md hover:shadow-sm p-2 border-2 transition-all duration-200 cursor-pointer' onClick={() => {
                if (isGraphDataLoaded) {
                    centerGraph(fgRef);
                    return
                }
                console.log("Hold on a moment")
            }}>
                <SquareSquare />
            </div>
            <div className=' bg-white rounded-md hover:shadow-sm p-2 border-2 transition-all duration-200 cursor-pointer' onClick={zoomIn}>
                <ZoomIn />
            </div>
            <div className=' bg-white rounded-md hover:shadow-sm p-2 border-2 transition-all duration-200 cursor-pointer' onClick={zoomOut}>
                <ZoomOut />
            </div>
        </div>
    )
}

export default Interactions