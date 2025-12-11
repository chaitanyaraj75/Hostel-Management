import { useState, useEffect } from 'react';
import Redirect from "./componenets/Redirect";
import StudentComplaintPage from './componenets/StudentComplaintPage.jsx';
import AdminComplaintPage from './componenets/AdminComplaintPage.jsx';

function Complaints({ user }) {
    const curr_user = user ? user.user_type : null;

    if(curr_user == "admin"){
        return <AdminComplaintPage user={user} />;
    }
    else if(curr_user == "student"){
        return <StudentComplaintPage user={user} />;
    }
    else{
        return <Redirect />;
    }
}

export default Complaints;