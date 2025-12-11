import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';



function Redirect() {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(8);

    useEffect(() => {
        if (countdown === 0) {
            navigate('/login');
        }
        const timer = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    return (
        <div className="flex flex-col items-center justify-center mt-10">
            <div className="p-6 bg-white border rounded-lg shadow-md text-center max-w-md">
                <h2 className="text-lg font-semibold text-gray-800">
                    You are not logged in.
                </h2>

                <p className="text-gray-600 mt-2">
                    Redirecting to login page in{" "}
                    <span className="font-bold text-gray-800">{countdown}</span> seconds...
                </p>

                <h3 className="mt-4 text-gray-700 font-medium">or Click below</h3>

                <button
                    className="
                    mt-3 
                    px-4 py-2 
                    rounded-lg 
                    bg-green-600 
                    text-white 
                    font-medium
                    hover:bg-green-700 
                    hover:shadow-lg 
                    transition
                "
                    onClick={() => navigate('/login')}
                >
                    Login / Register
                </button>
            </div>
        </div>
    );
}

export default Redirect;