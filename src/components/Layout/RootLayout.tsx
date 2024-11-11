import { useState } from 'react';
import LinkAnalysisVisualization from '../Dashboard/LinkAnalysisVisualization';
import SidePanel from '../DashboardElements/SidePanel';
import { ResizablePanel, ResizablePanelGroup } from '../ui/resizable';

const RootLayout = () => {
    const [data, setData] = useState();
    return (
        <div className="flex flex-col h-screen">
            <header className="h-16 border-b flex items-center px-4 bg-background">
                <h1 className="text-xl font-bold">DataWeaver</h1>
            </header>

            <ResizablePanelGroup direction="horizontal" className="flex-1">
                {/* Sidebar */}
                <ResizablePanel defaultSize={20} minSize={15} className="h-full">
                    <div className="h-full border-r p-4">
                        <h2 className="font-semibold mb-4">Filters</h2>
                        <SidePanel setData={setData} />
                    </div>
                </ResizablePanel>

                {/* Main Content */}
                <ResizablePanel defaultSize={80} className="h-full p-4">
                    <div className="h-full bg-red-100 rounded-lg">
                        <LinkAnalysisVisualization data={data} />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default RootLayout;
