import React, { useEffect } from "react";
import logo from "../ReplyPal.svg";
import { Outlet, Link } from "react-router-dom";
import axios from 'axios';

import {
    FaEnvelope,
    FaMailBulk,
    FaArrowCircleRight,
    FaTrash,
    FaComments,
    FaAddressBook,
    FaPlus,
    FaSave,
    FaUser,
    FaUserAlt,
    FaLock,
    FaHome
} from "react-icons/fa";

import { IconContext } from "react-icons";
import Logout from "../components/Logout";

function DropDownMenu() {
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
        <div class="flex items-center justify-center float-right">
            <div class=" relative inline-block text-left dropdown  float-right">
                <span class="rounded-md shadow-sm"
                >
                    <a href="#" class="text-slate-700 text-4xl p-1 mt-2 float-right" aria-haspopup="true" aria-expanded="true" aria-controls="headlessui-menu-items-117">
                        <FaUserAlt className="float-left mx-2 font-bold rounded-full bg-slate-200 p-2" />
                    </a>
                </span>
                <div class="opacity-0 invisible dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95 mr-20">
                    <div class="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none" aria-labelledby="headlessui-menu-button-1" id="headlessui-menu-items-117" role="menu">
                        <div class="px-4 py-3">
                            <p class="text-sm leading-5">Signed in as</p>
                            <p class="text-sm font-medium leading-5 text-gray-900 truncate">{localStorage["email"]}</p>
                        </div>
                        <div class="py-1">
                            <a href="/profile/" tabindex="0" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left" role="menuitem" >Profile</a>
                            <a href={`/profile/update-profile`} tabindex="0" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left" role="menuitem" >Update informations</a>
                            <a href="/profile/add-account" tabindex="1" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left" role="menuitem" >Add account</a>
                        </div>
                        <div class="py-1">
                           <Logout />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DropDownMenu;

