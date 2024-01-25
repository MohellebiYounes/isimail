import axios from "axios";
import '../App.css'

import React, { useRef, useState, useEffect } from 'react';

import Peer from "simple-peer";
import io, { connect } from "socket.io-client";
import CopyToClipboard from "react-copy-to-clipboard";

const socket = io.connect("http://localhost:8000");

function VideoCall() {
	const [me, setMe] = useState("")
	const [stream, setStream] = useState()
	const [receivingCall, setReceivingCall] = useState(false)
	const [caller, setCaller] = useState("")
	const [callerSignal, setCallerSignal] = useState()
	const [callAccepted, setCallAccepted] = useState(false)
	const [idToCall, setIdToCall] = useState("")
	const [callEnded, setCallEnded] = useState(false)
	const [name, setName] = useState("")
	const myVideo = useRef({})
	const userVideo = useRef({})
	const connectionRef = useRef({})

// création d'un appel et le stocker dans la bdd
	const initiateVideoCall = (id) => {
		const instance = axios.create({
			withCredentials: true
		});

		instance.post(`${process.env.REACT_APP_API_LINK}calls/initiate-call/`,
			{
				caller_id: localStorage["user_id"],
				receiver_id: localStorage["msg_receiver"],
				socket: id
			}) 
			.then(function (res) {
				// console.log("This is creation code", res.data);
			})
			.catch(function (error) {
				console.log(error)
			});
	}

	const fetchIncomingCalls = async () => {

		const instance = axios.create({
		  withCredentials: true
		});
		
		const params = {
		  receiver_id: localStorage["user_id"]
		};
		
		instance.get(`${process.env.REACT_APP_API_LINK}calls/fetch-calls`, { params: params })
		.then(function (res) {
		  console.log(res.data)
		  setIdToCall(res.data.socket)
		//   callUser(res.data.socket)
		})
		.catch(function (error) {
		  console.log(error)
		});
	}
   

	useEffect(() => {
		fetchIncomingCalls();
		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
			setStream(stream)
			myVideo.current.srcObject = stream
		})

		socket.on("me", (id) => {
			setMe(id)
			initiateVideoCall(id)
		})

		socket.on("callUser", (data) => {
			setReceivingCall(true)
			setCaller(data.from)
			setName(data.name)
			setCallerSignal(data.signal)
		})
	}, [callAccepted])

	const callUser = (id) => {
		console.log("callUser")
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: stream
		})

		peer.on("signal", (data) => {
			console.log("signal")
			socket.emit("callUser", {
				userToCall: id,
				signalData: data,
				from: me,
				name: name
			})
		})

		peer.on("stream", (stream) => {
			console.log("stream")
			if (userVideo.current)
				userVideo.current.srcObject = stream

		})

		socket.on("callAccepted", (signal) => {
			console.log("callAccepted")
			setCallAccepted(true)
			peer.signal(signal)
		})

		connectionRef.current = peer
	}

	const answerCall = () => {
		setCallAccepted(true)
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.emit("answerCall", { signal: data, to: caller })
		})
		peer.on("stream", (stream) => {
			userVideo.current.srcObject = stream
		})

		peer.signal(callerSignal)
		connectionRef.current = peer
	}

	const leaveCall = () => {
		setCallEnded(true)
		connectionRef.current.destroy()
	}


	return (
		<div className="App">
			<h1 className="text-lg my-4 font-bold text-blue-500">Video call</h1>
			<div class="h-screen p-30">
				<div class="flex items-center justify-center space-x-4 mb-20">
					<div className="caller-frame w-1/3 bg-blue-200 p-3 rounded-md">
						{stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: "100%", height: "100%" }} />}
					</div>
					<div className="caller-frame  w-1/3 bg-blue-200 p-3 rounded-md">
						{callAccepted && !callEnded ?
							<video playsInline muted ref={myVideo} autoPlay style={{ width: "100%", height: "100%" }} /> : null}
					</div>
				</div>
				<div className="myId">
					<input
						id="filled-basic"
						label="Name"
						variant="filled"
						value={name}
						onChange={(e) => setName(e.target.value)}
						style={{ marginBottom: "20px" }}
					/>
					<CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
						<button className="bg-blue-500 rounded-lg">
							Copy ID
						</button>
					</CopyToClipboard>

					<input
						className="ml-2"
						id="filled-basic"
						label="ID to call"
						variant="filled"
						value={idToCall}
						onChange={(e) => setIdToCall(e.target.value)}
					/>
					<div className="">
						{callAccepted && !callEnded ? (
							<button className="bg-blue-500 rounded-lg" onClick={leaveCall}>
								End Call
							</button>
						) : (
							<button className="bg-blue-500 rounded-lg" onClick={() => callUser(idToCall)}>
								Call User
							</button>
						)}
						{idToCall}
					</div>
				</div>
				<div>
					{receivingCall && !callAccepted ? (
						<div className="caller">
							<h1 >{name} is calling...</h1>
							<button className="bg-blue-500 rounded-lg" onClick={answerCall}>
								Answer
							</button>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}

export default VideoCall;
