import LinkAnalysisVisualization from '../Graph/LinkAnalysisVisualization';
import Test from '../Graph/Test';
import { ResizablePanel, ResizablePanelGroup } from '../ui/resizable';

const RootLayout = () => {
    return (
        <div className="h-screen flex flex-col border">
            <div className="h-16 border-b flex items-center px-4 bg-background">
                <h1 className="text-xl font-bold">DataWeaver</h1>
            </div>

            <ResizablePanelGroup direction="horizontal" className="flex-1">
                <ResizablePanel defaultSize={20} minSize={15}>
                    <div className="h-full border-r p-4">
                        <h2 className="font-semibold mb-4">Filters</h2>
                    </div>
                </ResizablePanel>

                <ResizablePanel defaultSize={80}>
                    <div className="h-full p-4">
                        {/* <LinkAnalysisVisualization /> */}
                        <Test />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default RootLayout;