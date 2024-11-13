
const GraphLegend = () => {
    return (
        <div className='absolute left-10 bottom-10 bg-white p-2 rounded text-xs'>
            <p className='font-semibold'>Left Click: <span className='font-normal'>
                Show node information</span></p>
            <p className='font-semibold'>Note: <span className='font-normal'>
                Node sizes indicate their level of importance.</span></p>
        </div>
    )
}

export default GraphLegend