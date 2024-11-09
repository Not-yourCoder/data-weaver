// LinkAnalysisVisualization.tsx
import React, { useEffect, useRef, useState } from 'react';
import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d';
import { CrimeProperties, LocationProperties, NodeTypes, OfficerProperties } from '../types/component.types';
import { SearchIcon, ZoomIn, ZoomOut } from 'lucide-react';

const LinkAnalysisVisualization: React.FC = () => {
    // Refs
    const fgRef = useRef<ForceGraphMethods<NodeTypes, any> | undefined>(undefined);

    // States
    const [graphData, setGraphData] = useState<{ nodes: NodeTypes[], links: any[] }>({ nodes: [], links: [] });
    const [hoveredNode, setHoveredNode] = useState<NodeTypes | null>(null);
    const [selectedNode, setSelectedNode] = useState<NodeTypes | null>(null);
    const [highlightNodes, setHighlightNodes] = useState<Set<string>>(new Set());
    const [highlightLinks, setHighlightLinks] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:6969/api/graph');
                const data = await response.json();
                setGraphData(data);
            } catch (error) {
                console.error('Error fetching graph data:', error);
            }
        };

        fetchData();
    }, []);

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

    const handleNodeClick = (node: NodeTypes | null) => {
        setSelectedNode(node);
        handleNodeHover(node);
    };

    const getNodeSize = (node: NodeTypes) => {
        return highlightNodes.has(node.id) || node === hoveredNode ? 12 : 8; // Enlarge on hover
    };
    const getNodeColor = (node: NodeTypes) => {
        // Active node is either the hovered or selected node
        if (node === hoveredNode) {
            return '#00ff00'; // Active node color (green)
        }
        console.log("Selected node is true", node === selectedNode)
        if (node.id === selectedNode?.id) {
            return node.__indexColor; // Active node color (green)
        }
        return 'red'; // Default color for inactive nodes
    };
    const getLinkColor = (link: any) => {
        return highlightLinks.has(link) ? "red" : "#999"
    }
    const getLinkParticleSpeed = (link: any) => {
        return highlightLinks.has(link) ? 0.01 : 0.002; // Speed up particles on hover
    };
    const getLinkWidth = (link: string) => (highlightLinks.has(link) ? 4 : 1);


    // Function to center the graph on a specific node
    const centerGraphOnNode = (node: NodeTypes) => {
        if (fgRef.current && node) {
            fgRef.current.centerAt(node.x, node.y, 500); // 1000 is the duration of the animation
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
        ctx.fillStyle = '#ff9800'; // Default color
        ctx.fill();

        if (highlight) {
            // Draw a thick border around the node
            ctx.lineWidth = 4; // Set border thickness
            ctx.strokeStyle = '#ff0000'; // Border color
            ctx.stroke();
        }
    };
    console.log(graphData)
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
        <div className="relative w-full h-screen flex">
            {/* Force Graph */}
            <ForceGraph2D
                ref={fgRef}
                graphData={graphData}
                nodeRelSize={8}
                nodeLabel={(node) => node.label}
                nodeColor={getNodeColor}
                linkWidth={(link) => getLinkWidth(link)}
                linkDirectionalArrowLength={6}
                linkDirectionalArrowRelPos={1}
                linkDirectionalParticles={3}
                linkDirectionalParticleSpeed={getLinkParticleSpeed}
                linkLabel={link => link.type}
                linkColor={getLinkColor}
                onNodeHover={handleNodeHover}
                onNodeClick={handleNodeClick}
                nodeCanvasObject={nodeCanvasObject}
            />

            {/* Sidebar for node details */}
            {selectedNode && (
                <div className="absolute right-0 top-0 w-1/4 h-fit bg-gray-100 p-4 shadow-lg overflow-auto border rounded-md ">
                    <button onClick={() => setSelectedNode(null)} className="absolute top-2 right-2 text-lg">✖</button>
                    {getNodeInfo(selectedNode)}
                </div>
            )}
            <div className='absolute bg-white rounded-md hover:shadow-sm p-2 border-2 transition-all duration-200 cursor-pointer' onClick={() => {
                if (graphData.nodes.length > 0) {
                    centerGraphOnNode(graphData.nodes[0]); // Center on the first node in the graph
                }
            }}>
                <SearchIcon />
            </div>
            <div className='absolute top-12 bg-white rounded-md hover:shadow-sm p-2 border-2 transition-all duration-200 cursor-pointer' onClick={zoomIn}>
                <ZoomIn />
            </div>
            <div className='absolute top-24 bg-white rounded-md hover:shadow-sm p-2 border-2 transition-all duration-200 cursor-pointer' onClick={zoomOut}>
                <ZoomOut />
            </div>
        </div >
    );
};

export default LinkAnalysisVisualization;
