import React from "react";
import logo from "../ReplyPal.svg";
import { Outlet, Link } from "react-router-dom";
import axios from 'axios';
import DropDownMenu from '../components/DropDownMenu'

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
    FaUserAlt
} from "react-icons/fa";

import { IconContext } from "react-icons";

function EmailMenu() {
    if (!localStorage["email"]) return ("Unauthorized")
    return (
        <div class="px-0">
            <a href="/compose" className=" hover:bg-slate-200 text-white font-bold py-3 px-4 rounded bg-gray-100 bg-btn-messenger mx-4 block">
                Compose     <FaPlus className="float-left font-bold mx-1 text-white" />
            </a>
            <ul class="mt-8 text-start w-full">
                <li class="relative px-6 py-2">
                    <a href="/inbox">
                        <span class="text-gray-800 text-small">
                            <FaEnvelope className="float-left mx-2 font-bold" /> Inbox
                        </span>
                    </a>
                </li>
                <li class="relative px-6 py-2">
                    <a href="/sent">
                        <span class="text-gray-800">
                            <FaArrowCircleRight className="float-left mx-2" /> Sent
                        </span>
                    </a>
                </li>
                <li class="relative px-6 py-2">
                    <a href="/drafts">
                        <span class="text-gray-800">
                            <FaSave className="float-left mx-2" /> Drafts
                        </span>
                    </a>
                </li>
                <li class="relative px-6 py-2">
                    <span class="text-gray-800">
                        <FaMailBulk className="float-left mx-2 " /> Spams
                    </span>
                </li>
                <li class="relative px-6 py-2">
                <a href="/Trash">
                    <span class="text-gray-800 text-small">
                        <FaTrash className="float-left mx-2 font-bold" /> Trash
                    </span>
                </a>
                </li>
            </ul>
            <hr className="mt-4" />
        </div>
    );
}

export default EmailMenu;
