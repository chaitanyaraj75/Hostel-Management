import Navbar from "./componenets/Navbar";
import { useState, useEffect } from 'react';
import StudentRooms from "./componenets/StudentRoomPage";
import AdminRoomPage from "./componenets/AdminRoomPage";
import Redirect from "./componenets/Redirect";

function Rooms({ user, setUser }) {
    console.log("Rooms Page User:", user);
    const curr_user = user ? user.user_type : null;

    const boys_hostel = ['Subhash', 'Raman', 'Tilak'];
    const girls_hostel = ['Saraswati', 'Kalpana'];
    const room_types = ['Single', 'Double', 'Triple'];
    if (!user) {
        return <Redirect />;
    }
    else if (curr_user == "admin") {
        return <>
            <AdminRoomPage user={user} />
        </>
    }
    else {
        return <>
            <StudentRooms user={user} />
        </>
    }
}
export default Rooms;