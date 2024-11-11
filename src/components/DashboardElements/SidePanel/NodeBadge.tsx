import { useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllNodes } from "@/store/features/nodeSlice";

const NodeBadge = ({ setData }) => {
    const dispatch = useDispatch();
    const { nodesList, loading, error } = useSelector((state) => state.nodes);

    useEffect(() => {
        dispatch(fetchAllNodes());
    }, [dispatch]);

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
                {nodesList.map((node, index) => (
                    <li key={index} className="bg-red-500 w-fit px-2.5 py-1 font-semibold text-slate-100 rounded-full hover:cursor-pointer hover:bg-red-600 hover:text-white hover:shadow-sm duration-300" onClick={() => handleNodes(node)}>
                        {node._fields[0][0]}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NodeBadge;
