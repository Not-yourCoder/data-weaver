import { CheckCircle, Copy } from "lucide-react";
import { useState } from "react";

type Props = {
    node: any
    title: string
    properties: any
}
const InformationPanel = ({ node, title, properties }: Props) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const content = Object.entries(properties)
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join("\n");

        navigator.clipboard.writeText(content)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((error) => {
                alert("Failed to copy content: " + error);
            });
    };

    return (
        <div>
            <h1 className="text-2xl font-medium mb-2">Node Details</h1>
            <div className="w-full overflow-auto h-[20rem] scrollbar border p-2 rounded-lg">
                <div className='flex items-center justify-between'>
                    <h3 className="font-medium text-lg">{title || "Node"} Information</h3>
                    <button onClick={handleCopy} className="bg-white border p-2 duration-200 rounded-lg border-white hover:shadow-sm hover:border-slate-300 ">
                        <Copy size={18} />
                    </button>
                </div>
                <div
                    className={`absolute flex items-center gap-1 bg-white px-4 z-40 py-2 border rounded-lg shadow-md left-[38%] bottom-5 transition-all duration-300 transform ${copied ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                >
                    <span>Copied</span>
                    <span>
                        <CheckCircle size={18} className="bg-green-600 rounded-full text-white" />
                    </span>
                </div>
                <div className="mt-2">
                    {properties ? (
                        Object.entries(properties).map(([key, value], index) => (
                            <p key={key} className="py-2 border-t border-b overflow-auto scrollbar">
                                <span className="font-medium capitalize">{key}:</span> {JSON.stringify(value)}
                            </p>
                        ))
                    ) : (
                        Object.keys(node).slice(0, 4).map((key) => (
                            <p key={key} className="py-2 border-t border-b overflow-auto scrollbar">
                                <span className="font-medium capitalize">{key}:</span> {JSON.stringify(node[key])}
                            </p>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default InformationPanel;
