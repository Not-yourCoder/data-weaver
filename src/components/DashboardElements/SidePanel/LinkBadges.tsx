import { useEffect } from "react";
import { fetchAllLinks, fetchNodesbyLinks } from "@/store/features/linkSlice";
import { useDispatch, useSelector } from "react-redux";

const LinkBadges = ({ setData }) => {
    const dispatch = useDispatch();
    const { linksList, loading, error } = useSelector((state) => state.links);

    useEffect(() => {
        dispatch(fetchAllLinks());
    }, [dispatch]);

    const handleLinks = async (link) => {
        const result = await dispatch(fetchNodesbyLinks(link));
        console.log("Links Data", result.payload)
        setData(result.payload);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="mt-4">
            <h2 className="text-xl mb-3">Relationships</h2>
            <ul className="flex gap-3 flex-wrap mt-2">
                {linksList.map((link, index) => (
                    <li key={index} className="bg-slate-200 text-slate-700 hover:bg-slate-300 font-semibold w-fit px-2.5 py-1 transition-all duration-300 hover:shadow-sm rounded-full hover:cursor-pointer hover:text-slate-900" onClick={() => handleLinks(link)}>
                        {link}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LinkBadges;
