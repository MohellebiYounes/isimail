import React, { useState } from 'react';
import '../Chat.css';
import Liste from '../components/Liste';
import Conversation from '../components/Conversation';
import Group from '../components/Group'


const Messenger = () => {
    const [isFriendClicked, setIsFriendClicked] = useState(false);
    const [currentConversation, setCurrentConversation] = useState(null);

    const handleConversationClick = (conversationInfo) => {
        setCurrentConversation(conversationInfo);
    };

    return (
        <div className="flex">
            <Liste setIsFriendClicked={setIsFriendClicked} isFriendClicked={isFriendClicked} onConversationClick={handleConversationClick} />
            <Conversation setIsFriendClicked={setIsFriendClicked} isFriendClicked={isFriendClicked} currentConversation={currentConversation} />
            
        </div>
    );
};  

export default Messenger;