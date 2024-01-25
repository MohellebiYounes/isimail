// import React, { useState } from "react";
// import {
//   Box,
//   Stack,
//   Typography,
//   IconButton,
//   Link,
//   Divider,
// } from "@mui/material";
// import { MagnifyingGlass, Plus } from "phosphor-react";
// import { useTheme } from "@mui/material/styles";
// import { SimpleBarStyle } from "../../components/Scrollbar";
// import { ChatList } from "../../data";
// import ChatElement from "../../components/ChatElement";
// import {
//   Search,
//   SearchIconWrapper,
//   StyledInputBase,
// } from "../../components/Search";
// import CreateGroup from "../../sections/dashboard/CreateGroup";

// const Group = () => {
//   const [openDialog, setOpenDialog] = useState(false);

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//   }
//   const handleOpenDialog = () => {
//     setOpenDialog(true);
//   }
//   const theme = useTheme();
//   return (
//     <>
//       <Stack direction="row" sx={{ width: "100%" }}>
//         {/* Left */}

//         <Box
//           sx={{
//             overflowY: "scroll",

//             height: "100vh",
//             width: 320,
//             backgroundColor: (theme) =>
//               theme.palette.mode === "light"
//                 ? "#F8FAFF"
//                 : theme.palette.background,

//             boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
//           }}
//         >
//           <Stack p={3} spacing={2} sx={{ maxHeight: "100vh" }}>
//             <Stack
//               alignItems={"center"}
//               justifyContent="space-between"
//               direction="row"
//             >
//               <Typography variant="h5">Groups</Typography>
//             </Stack>
//             <Stack sx={{ width: "100%" }}>
//               <Search>
//                 <SearchIconWrapper>
//                   <MagnifyingGlass color="#709CE6" />
//                 </SearchIconWrapper>
//                 <StyledInputBase
//                   placeholder="Search…"
//                   inputProps={{ "aria-label": "search" }}
//                 />
//               </Search>
//             </Stack>
//             <Stack
//               justifyContent={"space-between"}
//               alignItems={"center"}
//               direction={"row"}
//             >
//               <Typography variant="subtitle2" sx={{}} component={Link}>
//                 Create New Group
//               </Typography>
//               <IconButton onClick={handleOpenDialog}>
//                 <Plus style={{ color: theme.palette.primary.main }} />
//               </IconButton>
//             </Stack>
//             <Divider />
//             <Stack sx={{ flexGrow: 1, overflow: "scroll", height: "100%" }}>
//               <SimpleBarStyle timeout={500} clickOnTrack={false}>
//                 <Stack spacing={2.4}>
//                   <Typography variant="subtitle2" sx={{ color: "#676667" }}>
//                     Pinned
//                   </Typography>
//                   {/* Chat List */}
//                   {ChatList.filter((el) => el.pinned).map((el, idx) => {
//                     return <ChatElement {...el} />;
//                   })}
//                   <Typography variant="subtitle2" sx={{ color: "#676667" }}>
//                     All Chats
//                   </Typography>
//                   {/* Chat List */}
//                   {ChatList.filter((el) => !el.pinned).map((el, idx) => {
//                     return <ChatElement {...el} />;
//                   })}
//                 </Stack>
//               </SimpleBarStyle>
//             </Stack>
//           </Stack>
//         </Box>

//         {/* Right */}
//       </Stack>
//       {openDialog && <CreateGroup open={openDialog} handleClose={handleCloseDialog} />}
//     </>
//   );
// };

// export default Group;





import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUser,
  faEdit,
  faArrowLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useScrollToBottom } from "react-scroll-to-bottom";
import { Link } from "react-router-dom";
function Group() {
  const [groupName, setGroupName] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newMember, setNewMember] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [tempGroupName, setTempGroupName] = useState(groupName);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupMembers, setNewGroupMembers] = useState("");
  const [groups, setGroups] = useState([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(null);
  const messagesContainerRef = useRef(null);
  const scrollToBottom = useScrollToBottom(messagesContainerRef);
  useEffect(() => {}, []);
  useEffect(() => {
    if (messagesContainerRef.current && scrollToBottom) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, scrollToBottom]);
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      scrollToBottom(
        container.scrollHeight - container.scrollTop === container.clientHeight
      );
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const newUser = "CurrentUser";

      setMessages((prevMessages) => [
        ...prevMessages,
        { user: newUser, content: newMessage },
      ]);
      setNewMessage("");

      setGroups((prevGroups) => {
        const updatedGroups = [...prevGroups];
        if (currentGroupIndex !== null) {
          updatedGroups[currentGroupIndex].messages.push({
            user: newUser,
            content: newMessage,
          });
        }
        return updatedGroups;
      });
    }
  };
  const handleAddMember = () => {
    if (newMember.trim() !== "") {
      if (!groups[currentGroupIndex]?.members.includes(newMember)) {
        setMessages([
          ...messages,
          { user: "System", content: `${newMember} has joined the group.` },
        ]);
        setNewMember("");
        setGroups((prevGroups) => {
          const updatedGroups = [...prevGroups];
          if (currentGroupIndex !== null) {
            updatedGroups[currentGroupIndex].members.push(newMember);
          }
          return updatedGroups;
        });
      } else {
        alert(`${newMember} is already a member of this group.`);
      }
    }
  };
  const handleSaveEdit = () => {
    setGroupName(tempGroupName);
    setIsEditing(false);
    setGroups((prevGroups) => {
      const updatedGroups = [...prevGroups];
      if (currentGroupIndex !== null) {
        updatedGroups[currentGroupIndex].name = tempGroupName;
      }
      return updatedGroups;
    });
  };
  const handleCreateGroup = () => {
    if (newGroupName.trim() !== "" && newGroupMembers.trim() !== "") {
      const newGroup = {
        name: newGroupName,
        members: newGroupMembers.split(",").map((member) => member.trim()),
        messages: [],
      };
      setGroups([...groups, newGroup]);
      setNewGroupName("");
      setNewGroupMembers("");
      setIsCreatingGroup(false);
    } else {
      alert("Group Name and Members are required.");
    }
  };
  const handleSwitchGroup = (index) => {
    setCurrentGroupIndex(index);
    setMessages(groups[index]?.messages || []);
  };
  return (
    <main style={{ left: 'auto', right: 'auto', margin: 'auto' }}>
    <div className="dashboard-container">
      {/* Partie 0 (Barre de navigation supérieure) */}
      <div className="topbar-container">
        <div className="back-topbar">
          <ul>
            {/* Utilisation du composant Link pour la redirection */}
            <li>
              <Link to="/principale">
                <FontAwesomeIcon icon={faArrowLeft} size="2x" />
              </Link>
            </li>
            <br />
            <li>
              <Link to="../Profile">
                <FontAwesomeIcon icon={faUser} size="2x" />
              </Link>
            </li>
            <br />
            <li>
              <FontAwesomeIcon icon={faBell} size="2x" />
            </li>
          </ul>
        </div>
      </div>
      {/* Partie 2 (Groupes) */}
      <div className="servers-container">
        <div className="groupe-name">
          {isEditing ? (
            <React.Fragment>
              <input
                type="text"
                value={tempGroupName}
                onChange={(e) => setTempGroupName(e.target.value)}
              />
              <button onClick={handleSaveEdit}>Save</button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <span>{groupName}</span>
              <button onClick={() => setIsEditing(true)}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </React.Fragment>
          )}
        </div>
        {/* Message initial */}
        {!groups.length && (
          <div className="server-circle">
            <span>Create a group to start a conversation.</span>
          </div>
        )}
        {/* Liste des groupes */}
        {groups.map((group, index) => (
          <div
            key={index}
            className={`server-circle ${
              currentGroupIndex === index ? "active" : ""
            }`}
            onClick={() => handleSwitchGroup(index)}
          >
            <span>{group.name}</span>
          </div>
        ))}
        {/* Formulaire pour créer un groupe */}
        {isCreatingGroup && (
          <div className="server-circle">
            <input
              type="text"
              placeholder="Group Name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Members (comma-separated)"
              value={newGroupMembers}
              onChange={(e) => setNewGroupMembers(e.target.value)}
            />
            <button onClick={handleCreateGroup}>Create Group</button>
          </div>
        )}
        <div
          className={`add-server ${currentGroupIndex === null ? "active" : ""}`}
          onClick={() => setIsCreatingGroup(true)}
        >
          <FontAwesomeIcon icon={faPlus} />
        </div>
      </div>
      {/* Partie 3 (Chatbox avec 40% de la largeur) */}
      <div className="chatbox-container">
        <div
          className="chatbox"
          ref={messagesContainerRef}
          onScroll={handleScroll}
        >
          <div className="messages">
            {messages.map((message, index) => (
              <div key={index} className="message">
                <span className="user">{message.user}:</span>
                <span className="content">{message.content}</span>
              </div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      </div>

      {/* Partie 4 (Liste des membres du groupe) */}
      <div className="members-container">
        <div className="title-membre">
          <h2>Members</h2>
        </div>
        <div className="list-member">
          <ul>
            {/* Affichez la liste des membres du groupe ici */}
            {groups[currentGroupIndex]?.members.map((member, index) => (
              <li key={index}>{member}</li>
            ))}
            <li>
              <input
                type="text"
                placeholder="New Member"
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
              />
              <button onClick={handleAddMember}>Add Member</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <style>
        {`
html {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.dashboard-container {
  display: flex;
  height: 100vh;
  margin: 0;
}

.topbar-container,
.groupe-container,
.chatbox-container,
.members-container {
  background-color: #2d3e4f;
  color: #fff;
  padding: 20px;
  margin: 0 5px;
  overflow-y: auto;
}

.topbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-topbar {
  z-index: 10;
  background-color: transparent;
}

.topbar-icons {
  display: flex;
  align-items: center;
}

.topbar-icons svg {
  margin-right: 10px;
}

.groupe-container {
  width: 150px;
  background-color: #394d60;
  padding: 10px;
}

.groupe-name {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.groupe-name input {
  border: none;
  background-color: transparent;
  color: #fff;
  font-size: 16px;
  margin-right: 10px;
  padding: 5px;
  border-radius: 5px;
  width: 100%;
}

.groupe-name button {
  background-color: #32a852;
  border: none;
  color: #fff;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
  margin-left: 5px;
}

.retour-button {
  width: 60px;
  height: 30px;
  color: #36393f;
  font-size: 18px;
  text-align: center;
  background-color: #becad2;
  cursor: pointer;
  margin-bottom: 10px;
  text-decoration: none;
}

.chatbox-container {
  display: flex;
  flex-direction: column;
  flex: 4;
  height: 100%;
  overflow-y: auto;
}

.chatbox {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #2d3e4f;
  overflow-y: auto;
  border-radius: 10px;
  position: relative;
  scroll-behavior: smooth;
}

.messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  border-radius: 10px;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  background-color: #32a852;
  align-items: center;
}

.message span {
  background: transparent;
  background-color: transparent;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-name {
  font-weight: bold;
  margin-right: 5px;
}

.message-content {
  color: #fff;
}

.message-input {
  display: flex;
  align-items: center;
  padding: 10px;
  background: #32a852;
}

.message-input input {
  flex: 1;
  border: none;
  border-radius: 10px;
  height: 30px;
  margin-right: 10px;
  padding: 5px;
}

.message-input button {
  background-color: #fff;
  color: #3a677c;
  border: none;
  width: 60px;
  padding: 5px;
  cursor: pointer;
  border-radius: 10px;
}



.title-membre h2 {
  background-color: transparent;
}

.list-member li {
  background-color: #394d60;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  text-decoration: none;
  position: relative;
}

.list-member li input {
  flex: 1;
  border: none;
  border-radius: 5px;
  padding: 5px;
  margin-right: 10px;
}

.list-member li button {
  background-color: #32a852;
  border: none;
  color: #fff;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

/* Responsive styles */
@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
  }
  
  .groupe-container {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .members-container {
    margin-right: 5px;
  }
}

`}
        </style>
    </main>
  );
}

export default Group;