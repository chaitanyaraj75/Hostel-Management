import { Helmet } from 'react-helmet';
import { useEffect } from "react";

function Home() {
    useEffect(() => {
        document.title = "Home | Hostel Management";
    }, []);
    return (
        <div>
            <Helmet>
                <title>My Website</title>
            </Helmet>
            <h1>Welcome to the Hostel Management System</h1>
            <p>This is the home page.</p>
        </div>
    );
}

export default Home;