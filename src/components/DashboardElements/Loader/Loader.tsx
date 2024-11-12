import { MagnifyingGlass } from "react-loader-spinner";

type Props = {}

const Loader = (props: Props) => {
    return (
        <div className='absolute left-[60%] top-[50%]'>
            <MagnifyingGlass
                visible={true}
                height="80"
                width="80"
                ariaLabel="magnifying-glass-loading"
                wrapperStyle={{}}
                wrapperClass="magnifying-glass-wrapper"
                glassColor="#c0efff"
                color="#e15b64"
            />
        </div>
    )
}

export default Loader