import { ClipLoader } from "react-spinners";

function ButtonLoader() {
    return (
        <div className="flex items-center justify-center">
            <ClipLoader size={16} color="#ffffff" />
        </div>
    );
}

export default ButtonLoader;