import { NodeTypes } from "@/components/types/component.types";

export const getNodeColor = (node: NodeTypes) => {
    switch (node.label || node.type) {
        case "AREA":
            return "#1E90FF";    // DodgerBlue
        case "Crime":
            return "#FF6347";    // Tomato
        case "Email":
            return "#FF4500";    // OrangeRed
        case "Location":
            return "#4682B4";    // SteelBlue
        case "Object":
            return "#8A2BE2";    // BlueViolet
        case "Officer":
            return "#FFD700";    // Gold
        case "Person":
            return "#32CD32";    // LimeGreen
        case "Phone":
            return "#20B2AA";    // LightSeaGreen
        case "PhoneCall":
            return "#FF69B4";    // HotPink
        case "PostCode":
            return "#FF7F50";    // Coral
        case "Vehicle":
            return "#DAA520";    // GoldenRod
        case "Show All":
            return "#A9A9A9";    // DarkGray
        default:
            return "orange";     // Default color
    }
};


export const centerGraph = (fgRef) => {
  if (fgRef.current) {
    fgRef.current.zoomToFit();
  }
};