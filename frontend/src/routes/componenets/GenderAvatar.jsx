import { useNavigate } from "react-router-dom";
import axios from "axios";
import server_url from "./server_url";
import { useState, useEffect } from "react";

function GenderAvatar({ user, size = 64 }){
    const style = { width: size, height: size };
    const gender = (user?.gender || '').toString().toLowerCase();
    const initials = user?.name?.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase() || '';

    if(gender === 'male' || gender === 'm'){
        return (
            <div style={style} className="rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-semibold">
                {/* simple male symbol */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                    <path d="M14 2h6v6h-2V5.414l-3.293 3.293-1.414-1.414L16.586 4H14V2z" />
                    <path d="M10 8a6 6 0 100 12 6 6 0 000-12z" />
                </svg>
            </div>
        )
    }

    if(gender === 'female' || gender === 'f'){
        return (
            <div style={style} className="rounded-full bg-pink-100 flex items-center justify-center text-pink-700 text-xl font-semibold">
                {/* simple female symbol */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                    <path d="M12 2a4 4 0 00-4 4 4 4 0 004 4 4 4 0 004-4 4 4 0 00-4-4z" />
                    <path d="M11 12h2v3h3v2h-3v3h-2v-3H8v-2h3v-3z" />
                </svg>
            </div>
        )
    }

    return (
        <div style={style} className="rounded-full bg-gray-100 flex items-center justify-center text-gray-700 text-xl font-semibold">
            {initials || <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zM4 20a8 8 0 0116 0H4z"/></svg>}
        </div>
    )
}

export default GenderAvatar;