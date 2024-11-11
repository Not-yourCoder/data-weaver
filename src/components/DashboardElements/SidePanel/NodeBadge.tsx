import { useEffect, useState } from "react";
import axios from "axios";
import { getAllNodes } from "../query-hooks";

const NodeBadge = ({ setData }) => {
    const [nodes, setNodes] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    const showAllNode = {
        keys: ["nodeTypes"],
        length: 1,
        _fields: [["Show All"]],
        _fieldLookup: { nodeTypes: 0 }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllNodes();
                setNodes([...data.records, showAllNode]);
                console.log("Data Records", data.records)
            } catch (err) {
                setError("Failed to fetch node types");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleNodes = async (node) => {
        const label = node._fields[0][0]
        const response = await axios.post("http://localhost:6969/api/fetch-nodes", { label })
        console.log(response.data)
        setData(response.data)
    }
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Nodes</h2>
            <ul className="flex gap-2 flex-wrap mt-2">
                {nodes.map((node, index) => (
                    <li key={index} className="bg-red-500 w-fit px-2.5 py-1 font-semibold text-slate-100 rounded-full hover:cursor-pointer hover:bg-red-600 hover:text-white hover:shadow-sm duration-300" onClick={() => handleNodes(node)}>
                        {node._fields[0][0]}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NodeBadge;
