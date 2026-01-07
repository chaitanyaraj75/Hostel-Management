import { ScaleLoader } from "react-spinners";

function PageLoader() {
    return <div className="absolute flex inset-0 items-center justify-center">
        <ScaleLoader
            color="#2b13e0"
            loading
        />
    </div>
}

export default PageLoader