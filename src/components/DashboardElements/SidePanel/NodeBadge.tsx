import { useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllNodes } from "@/store/features/nodeSlice";
import SkeletonLoader from "../Loader/Skeleton";
import { getNodeColor } from "@/utils/helpers";

const NodeBadge = ({ setData, setGraphLoading }) => {
    const dispatch = useDispatch();
    const { nodesList, loading, error } = useSelector((state) => state.nodes);

    useEffect(() => {
        dispatch(fetchAllNodes());
    }, [dispatch]);

    const handleNodes = async (node, retryCount = 3) => {
        const label = node._fields[0][0];
        setGraphLoading(true);

        try {
            const response = await axios.post("http://localhost:6969/api/fetch-nodes", { label });
            setData(response.data);
        } catch (err) {
            console.error("Error occurred:", err);
            if (retryCount > 0) {
                console.log(`Retrying... attempts remaining: ${retryCount}`);
                setTimeout(() => handleNodes(node, retryCount - 1), 1000); // Retry after 1 second
            } else {
                console.error("Failed to fetch data after retries");
            }
        } finally {
            setGraphLoading(false);
        }
    };

    if (loading) return <SkeletonLoader />;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2 className="text-xl mb-3">Nodes ({nodesList.length})</h2>
            <ul className="flex gap-2 flex-wrap mt-2">
                {nodesList.map((node, index) => (
                    <li
                        key={index}
                        style={{ backgroundColor: getNodeColor({ label: node._fields[0][0] }) }}
                        className="w-fit px-2.5 py-1 font-medium text-slate-100 rounded-full hover:cursor-pointer hover:text-white hover:shadow-sm duration-300"
                        onClick={() => handleNodes(node)}
                    >
                        {node._fields[0][0]}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NodeBadge;
