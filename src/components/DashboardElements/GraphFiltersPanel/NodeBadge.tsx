import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux"
import { fetchAllNodes } from "@/store/features/nodeSlice"
import SkeletonLoader from "../Loader/Skeleton"
import { getNodeColor } from "@/utils/helpers"
import { RootState } from "@/store/store"

type Props = {
    setData: (data: any) => void
    setGraphLoading: (loading: boolean) => void
}

const NodeBadge = ({ setData, setGraphLoading }: Props) => {
    const dispatch = useDispatch()
    const [currentlyActiveNode, setCurrentlyActiveNode] = useState<string>("Show All");
    const [localLoading, setLocalLoading] = useState(false)
    const { nodesList, loading, error } = useSelector((state: RootState) => state.nodes)

    useEffect(() => {
        if (!nodesList.length) {
            dispatch(fetchAllNodes())
        }
    }, [dispatch, nodesList.length])

    const handleNodes = useCallback(async (node, retryCount = 3) => {
        const label = node._fields[0][0]
        setLocalLoading(true)
        setGraphLoading(true)

        try {
            const response = await axios.post("http://localhost:6969/api/fetch-nodes", { label })
            setCurrentlyActiveNode(label)
            setData(response.data)
        } catch (err) {
            console.error("Error occurred:", err)
            if (retryCount > 0) {
                console.log(`Retrying... attempts remaining: ${retryCount}`)
                setTimeout(() => handleNodes(node, retryCount - 1), 1000)
            } else {
                console.error("Failed to fetch data after retries")
            }
        } finally {
            setLocalLoading(false)
            setGraphLoading(false)
        }
    }, [setData, setGraphLoading])

    if (loading) return <SkeletonLoader />
    if (error) return <div>{error}</div>

    console.log(currentlyActiveNode)
    return (
        <div>
            <h2 className="text-xl mb-3">Nodes ({nodesList.length})</h2>
            <ul className="flex gap-2 flex-wrap mt-2">
                {nodesList.map((node, index) => (
                    <li
                        key={index}
                        style={{
                            backgroundColor: getNodeColor({ label: node._fields[0][0] }),
                            opacity: localLoading ? 0.5 : 1,
                            pointerEvents: localLoading ? 'none' : 'auto',
                        }}
                        className=" flex items-center w-fit px-2.5 py-1 font-medium text-slate-100 rounded-full hover:cursor-pointer hover:text-white hover:shadow-sm duration-300"
                        onClick={() => !localLoading && handleNodes(node)}
                    >
                        {node._fields[0][0]}{currentlyActiveNode === node._fields[0][0] && (
                            <span className="text-green-500 ml-2">✔️</span> // or any other icon you prefer
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default NodeBadge