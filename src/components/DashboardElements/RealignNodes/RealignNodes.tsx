import { AlignHorizontalDistributeCenter } from 'lucide-react';
import { useEffect, useState } from 'react';

const RealignNodes = ({ graphData, setGraphData, }) => {
    const [originalPositions, setOriginalPositions] = useState({});

    useEffect(() => {
        // Save the initial positions when graphData is first loaded
        const initialPositions = {};
        graphData.nodes.forEach(node => {
            initialPositions[node.id] = { x: node.x, y: node.y };
        });
        setOriginalPositions(initialPositions);
    }, [graphData.nodes]);

    const realignNodes = () => {
        // Reset node positions
        const resetNodes = graphData.nodes.map(node => ({
            ...node,
            x: originalPositions[node.id].x,
            y: originalPositions[node.id].y,
        }));

        // Update links to point to the new node positions
        const resetLinks = graphData.links.map(link => ({
            ...link,
            source: resetNodes.find(node => node.id === link.source.id),
            target: resetNodes.find(node => node.id === link.target.id),
        }));

        // Update graph data with reset nodes and links
        setGraphData({ nodes: resetNodes, links: resetLinks });
    };

    return (
        <div className={` bg-white p-2 rounded-lg border hover:shadow-sm top-36`}>
            <button onClick={realignNodes}><AlignHorizontalDistributeCenter /></button>
        </div>
    );
};

export default RealignNodes;
