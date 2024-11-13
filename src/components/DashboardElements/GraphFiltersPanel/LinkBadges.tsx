import { useEffect, useState } from "react";
import { fetchAllLinks } from "@/store/features/linkSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import SkeletonLoader from "../Loader/Skeleton";

const LinkBadges = ({ setData, setGraphLoading }) => {
    const dispatch = useDispatch();
    const { linksList, loading, error } = useSelector((state) => state.links);
    const [currentlyActiveLink, setCurrentlyActiveLink] = useState("SHOW ALL")
    useEffect(() => {
        dispatch(fetchAllLinks());
    }, [dispatch]);

    const handleLinks = async (link, retryCount = 3) => {
        setGraphLoading(true)
        try {
            const result = await axios.post("http://localhost:6969/api/fetch-relationships", { relationshipType: link });
            setCurrentlyActiveLink(link)
            setData(result.data)
        } catch (error) {
            console.error("Error fetching relationships:", error);
            if (retryCount > 0) {
                console.log(`Retrying... attempts remaining: ${retryCount}`);
                setTimeout(() => handleLinks(link, retryCount - 1), 1000); 
            } else {
                console.error("Failed to fetch data after retries");
            }
        } finally {
            setGraphLoading(false)
        }
    };


    if (loading) return <SkeletonLoader />;
    if (error) return <div>{error}</div>;

    return (
        <div className="mt-4">
            <h2 className="text-xl mb-3">Relationships ({linksList.length})</h2>
            <ul className="flex gap-3 flex-wrap mt-2">
                {linksList.map((link, index) => (
                    <li key={index} className="bg-slate-200 text-slate-700 hover:bg-slate-300 font-medium w-fit px-2.5 py-1 transition-all duration-300 hover:shadow-sm rounded-full hover:cursor-pointer hover:text-slate-900" onClick={() => handleLinks(link)}>
                        {link}{currentlyActiveLink === link && (
                            <span className="text-green-500 ml-2">✔️</span> 
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LinkBadges;
