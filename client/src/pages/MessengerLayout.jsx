import React from "react";
import logo from "../ReplyPal.svg";
import { Outlet, Link } from "react-router-dom";
import DropDownMenu from "../components/DropDownMenu";

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
import MessengerMenu from "../components/MessengerMenu";
import LeftmostMenu from "../components/LeftmostMenu";

function MessengerLayout() {
  if (!localStorage["email"]) return ("Unauthorized")
  return (
    <div class="app" >

      <div clas="w-full bg-transparent" >
        <div>
          <div class=" flex bg-white">
            <div class="col w-1/6">
              <img class="w-full" src={logo} className="p-3 logo" />
            </div>
            <div class=" col w-4/6 pt-1">
              <input
                class="my-2 w-full shadow appearance-none border border-slate-400 rounded py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline bg-slate-50"
                id="password"
                type="Text"
                placeholder="Rechercher un contact"
              >
              </input>
            </div>
            <div class=" bg-white flex flex-col float-right ml-auto">
              <DropDownMenu />
            </div>
          </div>
        </div>
        <IconContext.Provider value={{ className: "icon-size text-gray-800" }}>
          <div class="flex h-screen bg-gray-200 home-nav-remove">
            <div class="bg-white w-20 flex flex-row justify-between col-span-8">
            <LeftmostMenu />
              
            </div>
            <div class="flex-1 flex flex-col overflow-hidden col-span-8">
              <main class="flex-1 bg-white border">
                <div class="">
                  <Outlet />
                </div>
              </main>
            </div>
          </div>
        </IconContext.Provider>
      </div>
    </div>
  );
}

export default MessengerLayout;
