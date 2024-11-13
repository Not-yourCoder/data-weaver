import { PanelRightOpen, PanelLeftOpen } from 'lucide-react'
import InformationPanel from './InformationPanel'
import NodeStatistics from './NodeStaticstics'
import RelationshipStatistics from './RelationshipStatistics'


type GraphInfoPanelProps = {
    openSidebar: boolean
    handleSidebarOpen: () => void
    selectedNode: any // Add proper type
    graphData: {
        nodes: any[]
        links: any[]
    }
}

const GraphInfoPanel = ({
    openSidebar,
    handleSidebarOpen,
    selectedNode,
    graphData
}: GraphInfoPanelProps) => {
    return (
        <div className='flex border'>
            <div
                className='absolute right-5 top-5 p-2 bg-white rounded border hover:cursor-pointer'
                onClick={handleSidebarOpen}
            >
                {openSidebar ? <PanelRightOpen /> : <PanelLeftOpen />}
            </div>
            <div
                className={`absolute right-2 p-2 top-16 w-[20rem] bg-white h-[25rem] rounded border shadow-md 
                ${openSidebar ? "" : "pointer-events-none"} 
                transition-all duration-300 scrollbar 
                ${openSidebar ? 'translate-x-[-10px] opacity-100' : 'translate-x-0 opacity-0'}`}
            >
                {openSidebar && (
                    <div className='flex flex-col gap-2 max-h-full p-2 overflow-auto scrollbar'>
                        {selectedNode ? (
                            <InformationPanel
                                node={selectedNode}
                                properties={selectedNode?.properties}
                                title={selectedNode?.label}
                            />
                        ) : (
                            <>
                                <NodeStatistics
                                    nodes={graphData.nodes}
                                />
                                <RelationshipStatistics
                                    links={graphData.links}
                                />
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default GraphInfoPanel