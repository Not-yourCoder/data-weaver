// LinkAnalysisVisualization.js
import { getNodes, getRelationships } from '@/services/dataTransformation';
import { useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const LinkAnalysisVisualization = () => {
    const fgRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            const nodes = await getNodes();
            const relationships = await getRelationships();
            fgRef.current.graphData({ nodes, links: relationships });
        };
        fetchData();
    }, []);

    return (
        <ForceGraph2D
            ref={fgRef}
            backgroundColor="#87CEEB"
            nodeLabel="id"
            linkWidth={2}
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            linkDirectionalParticles={4}
            linkDirectionalParticleSpeed={0.004}
        />
    );
};

export default LinkAnalysisVisualization;