import { getNodeColor } from "@/utils/helpers"

const NodeStatistics = ({ nodes }) => {
    return (
        <div>
            <h1 className='text-xl mb-1'>Nodes <span>({nodes.length})</span></h1>
            <div className='flex flex-wrap gap-2'>
                {[...new Set(nodes.map(node => node.label))].map((label, index) => (
                    <span
                        key={index}
                        style={{ backgroundColor: getNodeColor({ label }) }}
                        className="text-white hover:bg-slate-300 font-medium w-fit px-2.5 py-1 transition-all duration-300 hover:shadow-sm rounded-full hover:cursor-pointer hover:text-slate-900"
                    >
                        {label}
                    </span>
                ))}
            </div>
        </div>
    )
}
export default NodeStatistics