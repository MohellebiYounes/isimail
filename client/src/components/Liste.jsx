import React, { useState, useEffect } from 'react';
import './Liste2.css';
import './Liste.css';
import 'remixicon/fonts/remixicon.css';

import { FaUser, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import io, { connect } from "socket.io-client";
const socket = io.connect("http://localhost:8000");

const Liste = ({ conversations, onConversationClick,setIsFriendClicked, isFriendClicked  }) => {
    const [showWindow, setShowWindow] = useState(false);
    const [showWindowCreateGroup, setShowWindowCreateGroup] = useState(false);
    const [data, setData] = useState([])
    const [messengerContacts, setMessengerContacts] = useState([])
    
    useEffect(() => {
    socket.on("me", (id) => {
        console.log(`Connected to Socket.io server with ID: ${socket.id}`);
        //         // Écouter l'événement de suppression en temps réel
        socket.on('deleteContact', (deletedContactId) => {
            console.log(`Received deleteContact event on client: ${deletedContactId}`); 

            setMessengerContacts((prevContacts) => prevContacts.filter(contact => contact._id !== deletedContactId));



    });})
    //          return () => {
    //        socket.disconnect();
    //  };
},
    [setMessengerContacts]);

    // useEffect(() => {
        
//   socket.on("me", (id) => {
//     console.log(`Connected to Socket.io server with ID: ${socket.id}`); 
//         // Écouter l'événement de suppression en temps réel
//         socket.on('deleteContact', (deletedContactId) => {
//             console.log(`Received deleteContact event on client: ${deletedContactId}`);

//           // Mettez à jour la liste des contacts après la suppression en temps réel
//           setMessengerContacts((prevContacts) => prevContacts.filter(contact => contact._id !== deletedContactId));
//         });
//     });
    
//         // Nettoyage à la sortie du composant
//         return () => {
//           socket.disconnect();
//         };
//       }, []);

    const getContacts = () => {
        const instance = axios.create({
            withCredentials: true
        });

        const params = {
            email: document.getElementById("search-text").value
        }
        
        instance.get(`${process.env.REACT_APP_API_LINK}users/email-part/`, { params: params })
            .then(function (res) {
                setData(res.data)
                console.log(res.data)
            })
            .catch(function (error) {
                console.log(error)
            });
    }

    const getMessengerContacts = () => {
        const instance = axios.create({
            withCredentials: true
        });
        
        const params = {
            email: localStorage["email"],
            user_id: localStorage["user_id"]
        }

        instance.get(`${process.env.REACT_APP_API_LINK}messenger-contacts/get-contact-list`)
            .then(function (res) {
                console.log(res.data)
                setMessengerContacts(res.data)
            })
            .catch(function (error) {
                console.log(error)
            });
    }

    const toggleWindow = () => {
        setShowWindow(!showWindow);
    };

    const toggleWindowCreateGroup = () => {
        setShowWindowCreateGroup(!showWindowCreateGroup);
    };

    const handleClick = (friend) => {
        setIsFriendClicked(true);
        console.log(setIsFriendClicked)
        let userName = ""
        // Appel de la fonction de gestion du clic avec les informations sur la conversation
        if(localStorage["user_id"] !== friend.contact_id ) {
            localStorage["msg_receiver"] = friend.contact_id
            userName = friend.username
        }
        else {
            localStorage["msg_receiver"] = friend.user_id;
            userName = friend.username2
        }

        localStorage["conversation_id"] = friend._id
       
        
        onConversationClick({
            name: userName,
            image: friend.user_avatar,
            // Ajoutez d'autres informations sur la conversation que vous souhaitez afficher
        });
        
    };
    
    const addConversation = (email) => {
    
        const instance = axios.create({
            withCredentials: true
        });

        const body = {
            email: email,
            user_id: localStorage["user_id"]
        }

        if (localStorage["email"] === email) {
            console.log("Vous ne pouvez pas vous ajouter vous-même à la liste de contacts.");
            return; // Arrêtez la fonction ici
          }

        instance.post(`${process.env.REACT_APP_API_LINK}messenger-contacts/`, body)
            .then(function (res) {
                //setData(res.data)
                getMessengerContacts();
            })
            .catch(function (error) {
                console.log(error)
            });
    }
    const removeConversation = (contact_id) => {
        socket.emit('deleteContact', contact_id);
        const instance = axios.create({
          withCredentials: true,
        });
    
        instance
          .delete(`${process.env.REACT_APP_API_LINK}messenger-contacts/delete-one/${contact_id}`)
          .then(function (res) {
            // Mettez à jour la liste des contacts après la suppression
            getMessengerContacts();  
          
          })
        
          .catch(function (error) {
            console.log(error);
          });
      };

    const getUsername = (user) => {
        const username = user.user_id === localStorage["user_id"] ? user.username : user.username2  
        return username
    }

    useEffect(() => {
        getMessengerContacts()
    }, [])

    return (
        <div className="w-1/4 ">
            <div className="px-2 place-content-center align-items-center mx-auto">
                <a onClick={toggleWindow} className=" bg-blue-500 text-sm mt-4 hover:bg-blue-400 text-white font-bold py-3 px-4 rounded-lg block">
                    <span className="text-blue-500"><FaPlus className="font-bold mx-1 text-blue-500 float-left"></FaPlus></span> New conversation
                </a>
            </div>
            <div className=" bg-slate-400">
                {showWindow && (
                    <div className="fenetre ">
                        <div className="text-sm p-3">
                            <div className='flex align-middle gap-3 place-content-between'>
                                <input id="search-text" type="text" placeholder="Rechercher un ami" className="search" onChange={() => getContacts()} />
                                <button onClick={()=> getMessengerContacts()}>Ajouter</button>
                                <button className="" onClick={toggleWindow}>x</button>
                            </div>
                        </div>
                        <ul>
                            {data?.map((i) => {
                                return (
                                    <tr>
                                        <button href="" className="border-b-2 p-3 bg-blue-400" onClick={() => addConversation(i.email)}> {i.email} </button>
                                    </tr>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>


            
            <div className="">
                <div className="p-2">
                    <input type="text" placeholder="Search..." className="w-full rounded-lg border-blue-500 text-black" />
                </div>
                <div>
                    <ul>
                        {messengerContacts.map((friend) => (
                            <li className="mx-2" key={friend.contact_id} onClick={() => handleClick(friend)}>
                                <div className='w-full flex place-content-between align-middle items-center'>
                                    <img src={friend.user_avatar} alt={friend.first_name} height={50} width="50" className="rounded-full chat-img" />
                                    <div>
                                        <h5>{getUsername(friend)}</h5>
                                        <p className="text-xs">{friend.time}</p>
                                    </div>
                                    {friend.user ? <FaUser className="text-green-500 mx-2"></FaUser> : <FaUser className="text-gray-300 mx-2"></FaUser>}
                                    <button
                                    className="text-red-500 mx-2"
                                    onClick={(e) => {
                                                    e.stopPropagation(); // Empêcher le clic d'activer la conversation
                                                    removeConversation(friend._id); // Appeler la fonction de suppression
                                                    }}
                  >  Supprimer</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Liste;