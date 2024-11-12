import NodeBadge from './NodeBadge'
import LinkBadges from './LinkBadges'


const SidePanel = ({ setData, setGraphLoading }) => {
    return (
        <div>
            <NodeBadge setData={setData} setGraphLoading={setGraphLoading} />
            <LinkBadges setData={setData} setGraphLoading={setGraphLoading} />
        </div>
    )
}

export default SidePanel