import React from "react";

import {
    FaEnvelope,
    FaComments,
    FaUser,
    FaUsers,
    FaAddressBook
} from "react-icons/fa";

function LeftmostMenu() {
    return (
        <div class="p-2 bg-slate-100 rounded-lg">
            <ul class="mt-0 text-start rounded-sm ">
                <li class="relative px-2 py-4">
                    <a href="/">
                        <span class="text-gray-800 text-small">
                            <FaEnvelope className="float-left mx-2 font-bold" />
                        </span>
                    </a>
                </li>
                <li class="relative px-2 py-4">
                    <a href="/messenger">
                        <span class="text-gray-800">
                            <FaComments className="float-left mx-2" />
                        </span>
                    </a>
                </li>
                <li class="relative px-2 py-4">
                    <a href="/profile">
                        <span class="text-gray-800">
                            <FaUser className="float-left mx-2" />
                        </span>
                    </a>
                </li>
                <li class="relative px-2 py-4">
                    <a href="/contacts">
                        <span class="text-gray-800">
                        <i class="fa fa-address-card-o" aria-hidden="true"></i>
                            <FaAddressBook className="float-left mx-2" />
                        </span>
                    </a>
                </li>
            </ul>
        </div>
    )
}

export default LeftmostMenu;