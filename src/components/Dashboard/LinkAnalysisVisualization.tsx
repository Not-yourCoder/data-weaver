// LinkAnalysisVisualization.tsx
import React, { useEffect, useRef, useState } from 'react';
import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d';
import { CrimeProperties, LocationProperties, NodeTypes, OfficerProperties } from '../types/component.types';
import { PanelLeftOpen, PanelRightOpen, SearchIcon, SquareSquare, ZoomIn, ZoomOut } from 'lucide-react';
import * as d3 from 'd3-force';
import Search from '../DashboardElements/Search';

const LinkAnalysisVisualization: React.FC = ({ data }) => {
    // Refs
    const fgRef = useRef<ForceGraphMethods<NodeTypes, any> | undefined>(undefined);

    // States
    const [graphData, setGraphData] = useState<{ nodes: NodeTypes[], links: any[] }>({ nodes: [], links: [] });
    const [originalData, setOriginalData] = useState<{ nodes: NodeTypes[], links: any[] }>({ nodes: [], links: [] });
    const [hoveredNode, setHoveredNode] = useState<NodeTypes | null>(null);
    const [selectedNode, setSelectedNode] = useState<NodeTypes | null>(null);
    const [highlightNodes, setHighlightNodes] = useState<Set<string>>(new Set());
    const [highlightLinks, setHighlightLinks] = useState<Set<string>>(new Set());
    const [lastClickTime, setLastClickTime] = useState(0);
    const [openSidebar, setOpenSidebar] = useState<boolean>(false)


    useEffect(() => {
        if (data) {
            setGraphData(data);
        }
    }, [data]);
    console.log("Data from SidePanel", data)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:6969/api/graph');
                const data = await response.json();
                setOriginalData(data);
                setGraphData({ nodes: data.nodes, links: [] });
            } catch (error) {
                console.error('Error fetching graph data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (fgRef.current) {
            const radius = 100; // Radius around each node to avoid overlap
            const linkDistance = 400; // Distance between linked nodes

            fgRef.current
                .d3Force('charge', d3.forceManyBody().strength(-150)) // Increase repulsion between nodes
                .d3Force('link', d3.forceLink().distance(linkDistance).strength(1)) // Increase link distance
                .d3Force('collision', d3.forceCollide().radius(radius)); // Collision force to prevent overlap
        }
    }, [graphData]);

    const handleSidebarOpen = () => {
        setOpenSidebar(!openSidebar)
    }
    function onEngineStop() {
        const fg = fgRef.current;
        fg?.zoomToFit(500);
    }

    const handleNodeDoubleClick = (node: NodeTypes) => {
        const connectedLinks = originalData.links.filter(link => link.source === node.id || link.target === node.id);
        const connectedNodeIds = new Set(connectedLinks.flatMap(link => [link.source, link.target]));

        // Get connected nodes and links without duplicates
        const newNodes = originalData.nodes.filter(n => connectedNodeIds.has(n.id) && !graphData.nodes.some(g => g.id === n.id));
        const newLinks = connectedLinks.filter(link => !graphData.links.some(g => g.source === link.source && g.target === link.target));

        // Update graph data to include new nodes and links
        setGraphData(prevData => ({
            nodes: [...prevData.nodes, ...newNodes],
            links: [...prevData.links, ...newLinks],
        }));

        // Apply forces to bring connected nodes closer to the clicked node
        if (fgRef.current) {
            fgRef.current
                .d3Force('charge', d3.forceManyBody().strength(-150))
                .d3Force('link')
                ?.distance(link => (connectedNodeIds.has(link.source.id) && connectedNodeIds.has(link.target.id) ? 50 : 200)); // Connected nodes closer
        }
    };

    const handleNodeHover = (node: NodeTypes | null) => {
        if (node) {
            const relatedNodes = new Set<string>();
            const relatedLinks = new Set<string>();

            graphData.links.forEach((link) => {
                if (link.source.id === node.id) {
                    relatedNodes.add(link.target.id);
                    relatedLinks.add(link);
                } else if (link.target.id === node.id) {
                    relatedNodes.add(link.source.id);
                    relatedLinks.add(link);
                }
            });

            setHoveredNode(node);
            setHighlightNodes(relatedNodes);
            setHighlightLinks(relatedLinks);
        } else {
            setHoveredNode(null);
            setHighlightNodes(new Set());
            setHighlightLinks(new Set());
        }
    };

    const handleNodeClick = (node: NodeTypes) => {
        const currentTime = Date.now()

        if (currentTime - lastClickTime < 300) {
            handleNodeDoubleClick(node)
        }
        setSelectedNode(node);
        handleNodeHover(node);
        setLastClickTime(currentTime);
    };

    const getNodeSize = (node: NodeTypes) => {
        return highlightNodes.has(node.id) || node === hoveredNode ? 72 : 60; // Enlarge on hover
    };
    const getNodeColor = (node: NodeTypes) => {

        if (node.id === selectedNode?.id) {
            return "green";
        }
        return node.__indexColor;
    };
    const getLinkColor = (link: any) => {
        return highlightLinks.has(link) ? "#ffffff" : "#999"; // White color for highlighted links
    };

    const getLinkWidth = (link: any) => {
        return highlightLinks.has(link) ? 3 : 1; // Thicker width for highlighted links
    };
    const getLinkParticleSpeed = (link: any) => {
        return highlightLinks.has(link) ? 0.01 : 0.002; // Speed up particles on hover
    };


    // Function to center the graph on a specific node
    const centerGraph = () => {
        if (fgRef.current) {
            fgRef.current.zoomToFit()
        }
    };

    const zoomIn = () => {
        if (fgRef.current) {
            fgRef.current.zoom(fgRef.current.zoom() * 1.1, 500); // Zoom in by 10% over 500ms
        }
    };

    // Zoom Out by a factor of 1.1
    const zoomOut = () => {
        if (fgRef.current) {
            fgRef.current.zoom(fgRef.current.zoom() / 1.1, 500); // Zoom out by 10% over 500ms
        }
    };
    const nodeCanvasObject = (node: NodeTypes, ctx: CanvasRenderingContext2D) => {
        const highlight = highlightNodes.has(node.id) || node === hoveredNode;
        const size = getNodeSize(node);

        // Draw the node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2, false);
        ctx.fillStyle = getNodeColor(node); // Default color
        ctx.fill();

        if (highlight) {
            // Draw a thick white border around the node
            ctx.lineWidth = 30; // Set border thickness
            ctx.strokeStyle = '#ffffff'; // White border color
            ctx.stroke();

            // Optional: Draw an inner red border for additional emphasis
            ctx.lineWidth = 2; // Set inner border thickness
            ctx.strokeStyle = node.__indexColor; // Inner border color
            ctx.stroke();
        }
    };

    const typeInfo = graphData.nodes.reduce((acc, node) => {
        const type = node.type || 'Unknown'; // Default to 'Unknown' if no type
        const color = node.__indexColor || '#CCCCCC'; // Default color if no color is provided

        if (!acc[type]) {
            acc[type] = { count: 0, color };
        }
        acc[type].count += 1;
        return acc;
    }, {});
    console.log(graphData)
    console.log(typeInfo)
    // Function to display node details
    function getNodeInfo(node: NodeTypes) {
        switch (node.label) {
            case "Crime":
                {
                    const crimeProps = node.properties as CrimeProperties;
                    return (
                        <>
                            <h3>Crime Information</h3>
                            <p>Date: {crimeProps.date}</p>
                            <p>Type: {crimeProps.type}</p>
                            <p>Outcome: {crimeProps.last_outcome}</p>
                        </>
                    );
                }

            case "Officer":
                {
                    const officerProps = node.properties as OfficerProperties;
                    return (
                        <>
                            <h3>Officer Information</h3>
                            <p>Name: {officerProps.name} {officerProps.surname}</p>
                            <p>Rank: {officerProps.rank}</p>
                            <p>Badge No: {officerProps.badge_no}</p>
                        </>
                    );
                }

            case "Location":
                {
                    const locationProps = node.properties as LocationProperties;
                    return (
                        <>
                            <h3>Location Information</h3>
                            <p>Address: {locationProps.address}</p>
                            <p>Coordinates: ({locationProps.latitude}, {locationProps.longitude})</p>
                            <p>Postcode: {locationProps.postcode}</p>
                        </>
                    );
                }

            default:
                return <p>Unknown Node Type</p>;
        }
    }
    return (
        <div className="relative h-full border-2 rounded-lg p-4">
            <Search className="absolute top-0 left-[25%] z-50 mt-4 w-6/12 p-2 rounded" setHighlightNodes={setHighlightNodes} setHighlightLinks={setHighlightLinks} setGraphData={setGraphData} />
            {/* Force Graph */}

            <ForceGraph2D
                ref={fgRef}
                graphData={graphData}
                // backgroundColor='rgba(0,0,0,0.5)'
                nodeLabel={(node) => node.label}
                nodeColor={getNodeColor}
                linkWidth={(link) => getLinkWidth(link)}
                linkDirectionalArrowLength={6}
                linkDirectionalArrowRelPos={1}
                linkDirectionalParticles={3}
                linkDirectionalParticleWidth={6}
                linkDirectionalParticleSpeed={getLinkParticleSpeed}
                linkLabel={link => link.type}
                linkColor={getLinkColor}
                onEngineStop={onEngineStop}
                warmupTicks={250}
                cooldownTime={0}
                onNodeHover={handleNodeHover}
                onNodeClick={handleNodeClick}
                nodeCanvasObject={nodeCanvasObject}
                nodePointerAreaPaint={(node, color, ctx) => {
                    // Define a larger area for hover detection
                    const size = getNodeSize(node);
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, size + 5, 0, 2 * Math.PI, false);
                    ctx.fill();
                }}
                onNodeDrag={(node, translate) => {
                    // Prevent default zoom and pan behavior
                    translate[0] = 0;
                    translate[1] = 0;
                }}
                onNodeDragEnd={(node) => {
                    node.fx = node.x;
                    node.fy = node.y;
                }}
                onBackgroundClick={() => setSelectedNode(null)}
            />

            {/* Sidebar for node details */}
            {selectedNode && (
                <div className="absolute right-0 top-28 w-1/4 h-fit bg-gray-100 p-4 shadow-lg overflow-auto border rounded-md ">
                    <button onClick={() => setSelectedNode(null)} className="absolute top-2 right-2 text-lg">✖</button>
                    {getNodeInfo(selectedNode)}
                </div>
            )}
            <div className='absolute top-4 flex flex-col gap-1'>

                <div className=' bg-white rounded-md hover:shadow-sm p-2 border-2 transition-all duration-200 cursor-pointer' onClick={() => {
                    if (graphData.nodes.length > 0) {
                        centerGraph();
                    }
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
            <div className='absolute left-10 bottom-10 bg-white p-2 rounded text-xs'>
                <p className='font-semibold'>Left Click: <span className='font-normal'>
                    Show node information</span></p>
                <p className='font-semibold'>Double Click: <span className='font-normal'>
                    Show connected links and nodes</span></p>
                <p className='font-semibold'>Right Click: <span className='font-normal'>
                    Nothing as of now</span></p>
            </div>
            <div className='flex border'>
                <div className='absolute right-5 top-5 p-2 bg-white rounded border hover:cursor-pointer' onClick={handleSidebarOpen}>
                    {openSidebar ?
                        <PanelRightOpen />
                        :
                        <PanelLeftOpen />
                    }
                </div>
                <div className={`absolute right-12 p-4 top-24 bg-white h-72 overflow-y-auto rounded border shadow-md transition-all duration-300 overflow-hidden w-4/12 ${openSidebar ? "translate-x-10 opacity-100" : "translate-x-0 opacity-0"
                    }`}>
                    <h1 className='font-semibold text-xl mb-2'>Results Overview</h1>
                    <div className='flex flex-wrap items-center gap-1'>
                        <span className='px-4 pb-1 text-lg bg-blue-700 text-white font-semibold rounded-full w-fit'>{graphData.nodes.length}</span>
                        {Object.entries(typeInfo).map(([type, info]) => (
                            <span
                                style={{ background: info.color }}
                                key={type}
                                className="px-4 pb-1 text-lg text-white font-semibold rounded-full w-fit"
                            >
                                {type} ({info.count})
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default LinkAnalysisVisualization;
