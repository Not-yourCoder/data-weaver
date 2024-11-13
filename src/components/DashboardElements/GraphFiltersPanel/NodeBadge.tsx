import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux"
import { fetchAllNodes } from "@/store/features/nodeSlice"
import SkeletonLoader from "../Loader/Skeleton"
import { getNodeColor } from "@/utils/helpers"

type Props = {
    setData: (data: any) => void
    setGraphLoading: (loading: boolean) => void
}

const NodeBadge = ({ setData, setGraphLoading }: Props) => {
    const dispatch = useDispatch()
    const { nodesList, loading, error } = useSelector((state) => state.nodes)
    const [localLoading, setLocalLoading] = useState(false)

    useEffect(() => {
        // Only fetch if nodesList is empty
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
                            pointerEvents: localLoading ? 'none' : 'auto'
                        }}
                        className="w-fit px-2.5 py-1 font-medium text-slate-100 rounded-full hover:cursor-pointer hover:text-white hover:shadow-sm duration-300"
                        onClick={() => !localLoading && handleNodes(node)}
                    >
                        {node._fields[0][0]}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default NodeBadge