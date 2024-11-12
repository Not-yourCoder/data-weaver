/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d';
import { NodeTypes, } from '../types/component.types';
import { PanelLeftOpen, PanelRightOpen, SquareSquare, ZoomIn, ZoomOut } from 'lucide-react';
import * as d3 from 'd3-force';
import Search from '../DashboardElements/Search';
import InformationPanel from '../DashboardElements/InformationPanel/InformationPanel';
import Loader from '../DashboardElements/Loader/Loader';
import { getNodeColor } from '@/utils/helpers';
import memoizeOne from 'memoize-one';

type Props = {
    data: any
    graphLoading: boolean
    setGraphLoading: Dispatch<SetStateAction<boolean>>
}
const LinkAnalysisVisualization = ({ data, graphLoading, setGraphLoading }: Props) => {
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



    // useEffect(() => {
    //     dispatch(fetchGraphData());
    // }, [dispatch]);


    // useEffect(() => {
    //     setGraphData({ nodes, links });
    // }, [nodes, links]);

    useEffect(() => {
        if (data) {
            setGraphData(data);
        }
        setOpenSidebar(false)
    }, [data]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setGraphLoading(true);
                const response = await fetch('http://localhost:6969/api/graph');
                const data = await response.json();
                setOriginalData(data);
                setGraphData({ nodes: data.nodes, links: data.links });
            } catch (error) {
                console.error('Error fetching graph data:', error);
            } finally {
                setGraphLoading(false)
            }
        };

        fetchData();
    }, [setGraphLoading]);

    useEffect(() => {
        if (fgRef.current) {
            const radius = 100;
            const linkDistance = 400;

            fgRef.current
                .d3Force('charge', d3.forceManyBody().strength(-300))
                .d3Force('link', d3.forceLink().distance(linkDistance).strength(1))
                .d3Force('collision', d3.forceCollide().radius(radius));
        }
    }, [graphData]);

    const handleSidebarOpen = () => {
        setOpenSidebar(!openSidebar)
    }
    function onEngineStop() {
        const fg = fgRef.current;
        fg?.zoomToFit(500);
    }

    // const handleNodeDoubleClick = (node: NodeTypes) => {
    //     const connectedLinks = originalData.links.filter(link => link.source === node.id || link.target === node.id);
    //     const connectedNodeIds = new Set(connectedLinks.flatMap(link => [link.source, link.target]));

    //     // Get connected nodes and links without duplicates
    //     const newNodes = originalData.nodes.filter(n => connectedNodeIds.has(n.id) && !graphData.nodes.some(g => g.id === n.id));
    //     const newLinks = connectedLinks.filter(link => !graphData.links.some(g => g.source === link.source && g.target === link.target));

    //     // Update graph data to include new nodes and links
    //     setGraphData(prevData => ({
    //         nodes: [...prevData.nodes, ...newNodes],
    //         links: [...prevData.links, ...newLinks],
    //     }));

    //     // Apply forces to bring connected nodes closer to the clicked node
    //     if (fgRef.current) {
    //         fgRef.current
    //             .d3Force('charge', d3.forceManyBody().strength(150))
    //             .d3Force('link')
    //             ?.distance(link => (connectedNodeIds.has(link.source.id) && connectedNodeIds.has(link.target.id) ? 50 : 200)); // Connected nodes closer
    //     }
    // };

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

        // if (currentTime - lastClickTime < 250) {
        //     handleNodeDoubleClick(node)
        // }
        if (fgRef.current) {
            fgRef.current.centerAt(node.x, node.y, 1000);
            fgRef.current.zoom(1, 1000);
        }

        setSelectedNode(node);
        handleNodeHover(node);
        setOpenSidebar(true);
        setLastClickTime(currentTime);
    };

    const getNodeSize = memoizeOne((node: any) => {
        const crimeSeverity = node.properties ? Math.abs(node.properties.id.low - node.properties.id.high) : Math.abs(node.id.low - node.id.high);

        const minSize = 10;
        const maxSize = 50;

        const size = Math.min(Math.max(crimeSeverity, minSize), maxSize);

        return size;
    });

    const getLinkColor = (link: any) => {
        return highlightLinks.has(link) ? "#ffffff" : "#999";
    };

    const getLinkWidth = (link: any) => {
        return highlightLinks.has(link) ? 4 : 1;
    };
    const getLinkParticleSpeed = (link: any) => {
        return highlightLinks.has(link) ? 0.01 : 0.002;
    };


    const centerGraph = () => {
        if (fgRef.current) {
            fgRef.current.zoomToFit()
        }
    };

    const zoomIn = () => {
        if (fgRef.current) {
            fgRef.current.zoom(fgRef.current.zoom() * 1.1, 500);
        }
    };

    const zoomOut = () => {
        if (fgRef.current) {
            fgRef.current.zoom(fgRef.current.zoom() / 1.1, 500);
        }
    };

    const nodeCanvasObject = memoizeOne((node: NodeTypes, ctx: CanvasRenderingContext2D) => {
        const highlight = highlightNodes.has(node.id) || node === hoveredNode;
        const selected = selectedNode?.id === node.id;
        const size = getNodeSize(node);

        // Pulsating effect for the selected node
        if (selected) {
            const time = Date.now() / 500;
            const pulseRadius = size + Math.sin(time * 2) * 20 + 10;

            ctx.beginPath();
            ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2, false);
            ctx.fillStyle = 'rgba(0, 255, 0, 0.4)';
            ctx.fill();

            const pulseFactor = Math.sin(Date.now() / 500) * 0.5 + 0.5;
            const baseColor = "#00FF00";
            const highlightColor = hexToRgb(baseColor);
            const pulsatingColor = `rgb(${highlightColor.r * pulseFactor}, ${highlightColor.g * pulseFactor}, ${highlightColor.b * pulseFactor})`;

            ctx.beginPath();
            ctx.arc(node.x, node.y, size, 0, Math.PI * 2, false);
            ctx.fillStyle = pulsatingColor;
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(node.x, node.y, size, 0, Math.PI * 2, false);
            ctx.fillStyle = getNodeColor(node) || "#ffffff";
            ctx.fill();
        }

        if (highlight || selected) {
            ctx.lineWidth = 12;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            ctx.lineWidth = 2;
            ctx.strokeStyle = node.__indexColor || "#ffffff";
            ctx.stroke();
        }
    });

    // Helper function to convert hex color to rgb format
    function hexToRgb(hex: string): { r: number; g: number; b: number } {
        const match = /^#([a-fA-F0-9]{6})$/.exec(hex);
        if (!match) return { r: 0, g: 0, b: 0 };
        const [r, g, b] = match[1].match(/.{2}/g)?.map(x => parseInt(x, 16)) || [];
        return { r, g, b };
    }


    if (graphLoading) return <Loader />
    return (
        <div className="relative h-full border-2 rounded-lg p-4">
            <Search className="absolute top-0 left-[25%] z-50 mt-4 w-6/12 p-2 rounded" setGraphData={setGraphData} setGraphLoading={setGraphLoading} />
            <ForceGraph2D
                ref={fgRef}
                graphData={graphData}
                width={1620}
                height={900}
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
                    const size = getNodeSize(node) || 60;
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
            <div className='absolute top-4 flex flex-col gap-1'>
                {/* <RealignNodes graphData={graphData} setGraphData={setGraphData} /> */}
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
                {/* <div className=' bg-white rounded-md hover:shadow-sm p-2 border-2 transition-all duration-200 cursor-pointer'>
                    <Home />
                </div> */}
            </div>
            <div className='absolute left-10 bottom-10 bg-white p-2 rounded text-xs'>
                <p className='font-semibold'>Left Click: <span className='font-normal'>
                    Show node information</span></p>
                <p className='font-semibold'>Note: <span className='font-normal'>
                    Node sizes indicate their level of importance.</span></p>
            </div>
            <div className='flex border'>
                <div className='absolute right-5 top-5 p-2 bg-white rounded border hover:cursor-pointer' onClick={handleSidebarOpen}>
                    {openSidebar ?
                        <PanelRightOpen />
                        :
                        <PanelLeftOpen />
                    }
                </div>
                <div
                    className={`absolute right-2 p-4 top-16 w-3/12 bg-white h-[25rem] rounded border shadow-md ${openSidebar ? "" : "pointer-events-none"} transition-all duration-300 scrollbar ${openSidebar
                        ? 'translate-x-[-10px] opacity-100'
                        : 'translate-x-0 opacity-0'
                        }`}
                >
                    {selectedNode ? (
                        <InformationPanel node={selectedNode} properties={selectedNode.properties} title={selectedNode.label} />
                    ) : (
                        <div className='flex flex-col gap-2 max-h-full p-2 overflow-auto scrollbar'>
                            <div>
                                <h1 className='text-xl mb-1'>Nodes <span>({graphData.nodes.length})</span></h1>
                                <div className='flex flex-wrap gap-2'>
                                    {
                                        [...new Set(graphData.nodes.map(node => node.label))].map((label, index) => (
                                            <span
                                                key={index}
                                                style={{ backgroundColor: getNodeColor({ label: label }) }}
                                                className="text-white hover:bg-slate-300 font-medium w-fit px-2.5 py-1 transition-all duration-300 hover:shadow-sm rounded-full hover:cursor-pointer hover:text-slate-900"
                                            >
                                                {label}
                                            </span>
                                        ))
                                    }
                                </div>
                            </div>
                            <div>
                                <h1 className='text-xl mb-2 '>Relationships <span>({graphData.links.length})</span></h1>
                                <div className='flex flex-wrap gap-2'>
                                    {
                                        [...new Set(graphData.links.map(link => link.type))].map((type, index) => (
                                            <span
                                                key={index}
                                                className="bg-slate-200 text-slate-700 hover:bg-slate-300 font-medium w-fit px-2.5 py-1 transition-all duration-300 hover:shadow-sm rounded-full hover:cursor-pointer hover:text-slate-900"
                                            >
                                                {type}
                                            </span>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    )
                    }
                </div>
            </div>
        </div >
    );
};

export default React.memo(LinkAnalysisVisualization);
