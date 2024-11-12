import { Copy } from 'lucide-react';

const InformationPanel = ({ title, properties }) => {
    const handleCopy = () => {
        // Creating the content to be copied
        const content = Object.keys(properties)
            .map((key) => `${key}: ${properties[key]}`)
            .join("\n");

        navigator.clipboard.writeText(content)
            .then(() => {
                alert("Content copied to clipboard!");
            })
            .catch((error) => {
                alert("Failed to copy content: " + error);
            });
    };

    return (
        <div>
            <h3 className="font-medium">{title} Information</h3>
            {Object.keys(properties).map((key) => (
                <p key={key}>{key}: {properties[key]}</p>
            ))}
            <button onClick={handleCopy} className=" bg-white p-1 rounded-lg border hover:shadow-sm">
                <Copy size={18} />
            </button>
        </div>
    );
};

export default InformationPanel