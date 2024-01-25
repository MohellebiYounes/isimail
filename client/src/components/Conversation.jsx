import React, { useState, useRef, useEffect } from 'react';
import './Conversation.css';
import 'remixicon/fonts/remixicon.css';
import { Button } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import axios from "axios";
import InfosUser from './InfosUser';
import { FaFly, FaMicrophone, FaPaperPlane, FaTrash, FaFolder } from 'react-icons/fa';
import socketIOClient from 'socket.io-client'


const socket = socketIOClient("http://localhost:8000");

const Conversation = ({ currentConversation, setIsFriendClicked, isFriendClicked }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const conversationRef = useRef(null);
    const [messageSent, setMessageSent] = useState(false);
    const [showWindow, setShowWindow] = useState(false);
    const [showWindowCreateGroup, setShowWindowCreateGroup] = useState(false);

    const toggleWindow = () => {
        setShowWindow(!showWindow);
    };
    const toggleWindowCreateGroup = () => {
        setShowWindowCreateGroup(!showWindowCreateGroup);
    };
    
    
        // Vérifier si un ami a été cliqué

        useEffect(() => {
            if (isFriendClicked) {
                setIsFriendClicked(false);
                getMessages();
           
            }    
            socket.on('messageReceived', (newMessage) => {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });

            return () => {
                socket.off('messageReceived');
            };
        
    }, [isFriendClicked]);
    
    const getMessages = () => {
        setIsFriendClicked(false);
        const instance = axios.create({
            withCredentials: true
        });

        const params = {
            sender_id: localStorage["user_id"],
            receiver_id: localStorage["msg_receiver"],
            conversation_id: localStorage["conversation_id"],
        }

        instance.get(`${process.env.REACT_APP_API_LINK}messages/conversation`, { params: params})
            .then(function (res) {
                setMessages(res.data);
                setIsFriendClicked(true);
               
            })
            .catch(function (error) {
                console.log(error)
            });
    }

    const handleSendMessage = () => {
        // Envoyer le message à la base de donnée
        if (inputMessage.trim() !== '') {
            setMessageSent(!messageSent)

            const instance = axios.create({
                withCredentials: true
            });

            instance.post(`${process.env.REACT_APP_API_LINK}messages/send-message/`,
                {
                    sender_id: localStorage["user_id"],
                    receiver_id: localStorage["user_id"],
                    conversation_id: localStorage["conversation_id"],
                    content: inputMessage,
                    message_type: 0
                }
            )
                .then(function (res) {
                    console.log(res.data);
                    setMessages([...messages, res.data]);
                    setInputMessage('');
                    socket.emit('new-message', { conversationId: localStorage["conversation_id"], message: res.data });
                })
                .catch(function (error) {
                    console.log(error)
                });
        }
    };
    useEffect(() => {
        socket.on('new-message', (data) => {
            // Traitez le nouveau message ici
            console.log('Nouveau message reçu via socket:', data);
            // Mettez à jour l'état des messages avec le nouveau message, si nécessaire
        });

        // Nettoyez les écouteurs d'événements lorsque le composant est démonté
        return () => {
            socket.off('new-message');
        };
    }, []);


    // const createGroup = (groupName, members) => {
    //     console.log("je suis ici")
    //     // Implement the logic to create a group here
    
    //     // Make a request to your backend API to create the group
    //     const instance = axios.create({
    //       withCredentials: true,
    //     });
    //     console.log(groupName)
    
    //     instance.post(`${process.env.REACT_APP_API_LINK}messages/create-group`, {
    //       groupName,
    //       members,
    //     })
    //       .then(function (res) {
    //         console.log(res.data);
    //         // Handle the response or update the UI as needed
    //       })
    //       .catch(function (error) {
    //         console.log(error);
    //         // Handle the error
    //       });
    //   };

    const handleMessageDeletion = (messageId) => {
        const instance = axios.create({
            withCredentials: true
        });

        alert(messageId)
        const params = {
            id : messageId
        }

        instance.delete(`${process.env.REACT_APP_API_LINK}messages/delete-message/${messageId}`)
            .then(function (res) {
                console.log(res.data)
            })
            .catch(function (error) {
                console.log(error)
            });
    };

    const enterPressed = (e) => {
        e.preventDefault()
        if (e.keyCode === 13)
            if (inputMessage.trim() !== '') {
                const newMessage = {
                    text: inputMessage,
                    sender: 'user',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
                setMessages([...messages, newMessage]);
                setInputMessage('');
            }
    };

    const fileInputRefAttach = useRef(null);
    const fileInputRefPhoto = useRef(null);

    const handleAttachFile = () => {
        if (fileInputRefAttach.current) {
            // Déclenche l'ouverture de la boîte de dialogue de sélection de fichier
            fileInputRefAttach.current.click();
        }
    };

    const handleInsertPhoto = () => {
        if (fileInputRefPhoto.current) {
            // Déclenche l'ouverture de la boîte de dialogue de sélection de fichier
            fileInputRefPhoto.current.click();
        }
    };

    const handleFileInputChange = (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            // Vous pouvez maintenant envoyer formData avec votre requête pour télécharger le fichier sur le serveur

            // Afficher une miniature de l'image dans la zone de texte
            const imageUrl = URL.createObjectURL(selectedFile);

        }
    };


    //pour rendre visible les infos en cliquant sur Username
    const [detailsVisible, setDetailsVisible] = useState(false);
    const handleToggleDetails = () => {
        setDetailsVisible(!detailsVisible);
    };

    //la function pour que quand je clique sur entree le message sera envoyer
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    //la function pour quand je clique sur button emojis une liste d'emojis qui v'ont afficher
    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
    const toggleEmojiPicker = () => {
        setEmojiPickerVisible(!emojiPickerVisible);
    };
    const handleEmojiClick = (emoji) => {
        setInputMessage((prevMessage) => prevMessage + emoji);
    };


    return (
        <div className="w-3/4 border-l-gray-900">
            <div className="w-full">
                <div className="header bg-white p-2" >
                    <div onClick={handleToggleDetails} style={{ cursor: 'pointer' }}>
                        <img className="chat-img rounded-md" width={50} height={50} src={currentConversation?.image} alt="" />
                        <h2 className="font-bold mt-5 mb-0">{currentConversation?.name || ''}</h2>
                        <h6 className="text-xs text-green-500 mt-0" style={{ cursor: 'pointer' }}>       Online  </h6>
                    </div>

                    <div className='navbarmessage'>
                    <Button onClick={toggleWindowCreateGroup}>Créer un groupe</Button>

                        {showWindowCreateGroup && (
                        <div className="fenetre">
                            <div className="friends-list">
                            {/* Interface pour créer un groupe et ajouter des membres */}
                            <input type="text" placeholder="Nom du groupe" className="search-input" />
                            <input type="text" placeholder="Ajouter des membres (séparés par des virgules)" className="search-input" />
                            <button>Créer le groupe</button>
                            <button onClick={toggleWindowCreateGroup}>Fermer</button>
                            </div>
                        </div>
                        )}
                        <Button>
                            <i className="ri-video-add-line"></i>
                        </Button>
                        <Button>
                            <i className="ri-phone-fill"></i>
                        </Button>
                        <Button>
                            <i className="ri-search-line"></i>
                        </Button>
                        <Button>
                            <i className="ri-settings-5-line"></i>
                        </Button>
                    </div>
                </div>
                <div className="Ajouter-amis">
                {showWindow && (
                    <div className="fenetre">
                        <div className="friends-list">
                            <div className='freind-liste-fils'>
                                <input type="text" placeholder="Rechercher un ami" className="search-input" />
                                <button className='fermer' onClick={toggleWindow}>X</button>
                                <button onClick={toggleWindow}>Ajouter</button>
                            </div>

                          
                        </div>
                    </div>
                )}
            </div>
                <div className="chat-container bg-white">
                    {/* ... Other elements ... */}
                    <div className="conversation" ref={conversationRef}>
                        {messages && messages.map((msg, index) => (
                            <>
                            <div
                                key={index}
                                className={`message ${msg.sender_id !== localStorage["user_id"] ? 'sent bg-green-500 text-white' : 'received bg-blue-500 text-white'}`}
                            >
                                <p>
                                    {msg.sender_id == localStorage["email"] && (
                                        <a onClick={() => handleMessageDeletion(msg._id)}><FaTrash></FaTrash></a>
                                    )}
                                    { msg.content }
                                </p>
                                
                            </div>
                            <div className="text-center"><span className='text-dark text-xs'>{msg.sending_date}</span></div>
                            </>
                        ))}
                    </div>
                    <div className="input-area p-3 bg-white">
                        <span className='fichier bg-slate-100 p-2 rounded-full mr-2'><FaMicrophone></FaMicrophone>  </span>
                        <input
                            type="text"
                            className="text-black border-none bg-gray-100 rounded-3xl"
                            value={inputMessage}
                            placeholder="Write a Message..."
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyUp={(e) => enterPressed(e)}
                            onKeyDown={handleKeyDown}
                        />
            
                            <a className="bg-gray-200 p-2 rounded-full mr-2" onClick={handleSendMessage}>
                                <span class="text-black rounded-3xl border-none"><FaPaperPlane></FaPaperPlane></span>
                            </a>
    


                        <label htmlFor="">
                            <input
                                id="file-input-attach"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleFileInputChange}
                                ref={fileInputRefAttach}
                            />
                            <span className="" aria-label="Attach File" onClick={handleAttachFile}>
                                <i className=""><FaFolder></FaFolder></i>
                            </span>
                        </label>


                      

                        <span className='fichier' onClick={toggleEmojiPicker}><i className="ri-emotion-line"></i></span>
                        {emojiPickerVisible && (
                            <div className="emoji-picker">
                                <span onClick={() => handleEmojiClick("😊")} role="img" aria-label="Smile">😊</span>
                                <span onClick={() => handleEmojiClick("❤️")} role="img" aria-label="Heart">❤️</span>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {
                detailsVisible && (
                    <InfosUser />
                )
            }
        </div >
    );
};

export default Conversation;