import { useState } from 'react';
import LinkAnalysisVisualization from '../Dashboard/LinkAnalysisVisualization';
import { ResizablePanel, ResizablePanelGroup } from '../ui/resizable';
import SidePanel from '../DashboardElements/SidePanel/SidePanel';

const RootLayout = () => {
    const [data, setData] = useState();
    const [graphLoading, setGraphLoading] = useState<boolean>(true);
    return (
        <div className="flex flex-col h-screen  max-w-screen">
            <header className="h-14 bg-slate-400 border-b flex items-center px-4 bg-background">
                <h1 className="text-4xl text-white">DataWeaver</h1>
            </header>

            <ResizablePanelGroup direction="horizontal" className="flex-1">
                {/* Sidebar */}
                <ResizablePanel defaultSize={20} minSize={15} className="h-full">
                    <div className="h-full border-r p-4">
                        <h2 className="font-semibold mb-4 text-2xl">Filters</h2>
                        <SidePanel setData={setData} setGraphLoading={setGraphLoading} />
                    </div>
                </ResizablePanel>

                {/* Main Content */}
                <ResizablePanel defaultSize={80} className=" m-4 bg-slate-200 rounded-lg p-4">
                    <LinkAnalysisVisualization data={data} graphLoading={graphLoading} setGraphLoading={setGraphLoading} />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default RootLayout;
