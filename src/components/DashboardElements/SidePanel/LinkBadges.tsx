import { useEffect, useState } from "react";
import axios from "axios";
import { getAllLinks } from "../query-hooks";

const LinkBadges = ({ setData }) => {
    const [links, setLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllLinks();
                setLinks(data.relationshipTypes);
                console.log("All Links", data.relationshipTypes)
            } catch (err) {
                setError("Failed to fetch node types");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLinks = async (relationshipType: string) => {
        const response = await axios.post("http://localhost:6969/api/post-link", { relationshipType })
        console.log(response.data)
        setData(response.data)
    }
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="mt-4">
            <h2 className="text-xl mb-3">Relationships</h2>
            <ul className="flex gap-3 flex-wrap mt-2">
                {links.map((link, index) => (
                    <li key={index} className="bg-slate-200 text-slate-700 hover:bg-slate-300 font-semibold w-fit px-2.5 py-1 transition-all duration-300 hover:shadow-sm rounded-full hover:cursor-pointer hover:text-slate-900" onClick={() => handleLinks(link)}>
                        {link}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LinkBadges;
