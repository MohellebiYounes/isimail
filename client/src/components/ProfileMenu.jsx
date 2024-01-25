import React from "react";
import axios from "axios";

import {
    FaUserAlt,
    FaLock,
    FaHome,
    FaSignOutAlt,
    FaImage
} from "react-icons/fa";

function ProfileMenu() {
    const logout = async () => {
        const _response = await axios({
            method: 'post',
            url: `http://localhost:5000/auth/logout`,
            withCredentials: true
        }).then((res) => {
            // Sauvegarder les données de connexion
            localStorage.removeItem("email");
            localStorage.removeItem("user_id")
            console.log(res);
            window.location.href = "/register"
        }).catch((error) => {
            console.log(error)
        })
    }
    return (
        <div class="px-0">
            <ul class="mt-8 text-start w-full">
                <li class="relative px-6 py-2">
                    <a href="/profile">
                        <span class="text-gray-800 text-small">
                            <FaHome className="float-left mx-2 font-bold" /> Home
                        </span>
                    </a>
                </li>
                <li class="relative px-6 py-2">
                    <a href="/profile/update-profile">
                        <span class="text-gray-800">
                            <FaUserAlt className="float-left mx-2" /> Personal informations
                        </span>
                    </a>
                </li>
                <li class="relative px-6 py-2">
                    <a href="/profile/update-pp">
                        <span class="text-gray-800">
                            <FaImage className="float-left mx-2" /> Profile picture
                        </span>
                    </a>
                </li>
                <li class="relative px-6 py-2">
                    <a href="/profile/update-password">
                        <span class="text-gray-800">
                            <FaLock className="float-left mx-2" /> Security
                        </span>
                    </a>
                </li>
                <li class="relative px-6 py-2">
                    <a onClick={()=>logout()}>
                        <span class="text-gray-800">
                            <FaSignOutAlt className="float-left mx-2" /> Sign out
                        </span>
                    </a>
                </li>
            </ul>
            <hr className="mt-4" />
        </div>
    );
}

export default ProfileMenu;
