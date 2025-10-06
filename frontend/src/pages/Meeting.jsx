import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { io } from "socket.io-client";

const server_url = "http://localhost:8000";
const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

var connections = {};

function Meeting() {
  const socketRef = useRef();
  const socketIdRef = useRef();
  const localVideoRef = useRef();

  const [videoAvailable, setVideoAvailable] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);

  const [video, setVideo] = useState();
  const [videos, setVideos] = useState([]);
  const [audio, setAudio] = useState();

  const [askForUsername, setAskForUsername] = useState(true);
  const [username, setUsername] = useState("");

  const videoRefs = useRef({}); // store remote video refs by socketId

  // ----------------- Get permissions -----------------
  const getPermissions = async () => {
    try {
      const userMedia = await navigator.mediaDevices.getUserMedia({
        video: videoAvailable,
        audio: audioAvailable,
      });
      window.localStream = userMedia;
      if (localVideoRef.current) localVideoRef.current.srcObject = userMedia;
    } catch (err) {
      console.error("Error accessing media devices", err);
      setVideoAvailable(false);
      setAudioAvailable(false);
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  // ----------------- Socket Connection -----------------
  const connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href);
      socketIdRef.current = socketRef.current.id;
      socketRef.current.on("signal", handleSignalFromServer);
      socketRef.current.on("joined-call", handleJoinedCall);

      socketRef.current.on("chat-messages", handleIncomingMessage);
      socketRef.current.on("user-left", handleUserLeft);
    });
  };

  // ----------------- Handle Joined Call -----------------
const handleJoinedCall = async (id, clients) => {
  for (const clientId of clients) {
    if (!connections[clientId]) {
      const pc = new RTCPeerConnection(peerConfigConnections);
      connections[clientId] = pc;

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit(
            "signal",
            clientId,
            JSON.stringify({ ice: event.candidate })
          );
        }
      };

      pc.ontrack = (event) => {
        setVideos((prevVideos) => {
          const existingVideo = prevVideos.find(v => v.socketId === clientId);
          if (existingVideo) {
            return prevVideos.map(v =>
              v.socketId === clientId ? { ...v, stream: event.streams[0] } : v
            );
          } else {
            return [...prevVideos, { socketId: clientId, stream: event.streams[0] }];
          }
        });
      };

      if (!window.localStream) {
        await getPermissions();
      }

      window.localStream.getTracks().forEach(track => pc.addTrack(track, window.localStream));

      if (clientId !== socketIdRef.current) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketRef.current.emit(
          "signal",
          clientId,
          JSON.stringify({ sdp: pc.localDescription })
        );
      }
    }
  }
};

  // ----------------- Handle Signaling -----------------
  const handleSignalFromServer = (fromId, message) => {
    const signal = JSON.parse(message);
    if (fromId === socketIdRef.current) return;

    const pc = connections[fromId];
    if (!pc) return;

    if (signal.sdp) {
      pc.setRemoteDescription(signal.sdp).then(() => {
        if (signal.sdp.type === "offer") {
          pc.createAnswer()
            .then((answer) => pc.setLocalDescription(answer))
            .then(() => {
              socketRef.current.emit(
                "signal",
                fromId,
                JSON.stringify({ sdp: pc.localDescription })
              );
            });
        }
      });
    }

    if (signal.ice) {
      pc.addIceCandidate(new RTCIceCandidate(signal.ice)).catch(console.log);
    }
  };

  // ----------------- Handle Messages -----------------
  const [messages, setMessages] = useState([]);
  const handleIncomingMessage = (data, sender, socketIdSender) => {
    setMessages((prev) => [...prev, { data, sender, socketIdSender }]);
  };

  const sendMessage = (msg) => {
    if (msg.trim() === "") return;
    socketRef.current.emit("chat-messages", msg, username);
    setMessages((prev) => [...prev, { data: msg, sender: username }]);
  };

  // ----------------- Handle User Left -----------------
  const handleUserLeft = (id) => {
    setVideos((prev) => prev.filter((v) => v.socketId !== id));
    delete connections[id];
  };

  // ----------------- Connect Button -----------------
  const connect = () => {
    setAskForUsername(false);
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  // ----------------- Update remote video elements -----------------
  useEffect(() => {
    videos.forEach((video) => {
      const ref = videoRefs.current[video.socketId];
      if (ref && video.stream) ref.srcObject = video.stream;
    });
  }, [videos]);

  // ----------------- Render -----------------
  return (
    <div>
      {askForUsername ? (
        <div>
          <h2>Enter Lobby</h2>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button variant="contained" onClick={connect}>
            Connect
          </Button>
          <div>
            <video ref={localVideoRef} autoPlay muted playsInline />
          </div>
        </div>
      ) : (
        <div>
          {/* Local Video */}
          <video ref={localVideoRef} autoPlay muted playsInline />

          {/* Remote Videos */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, 200px)",
              gap: "10px",
            }}
          >
            {videos.map((video) => (
              <video
                key={video.socketId}
                ref={(ref) => (videoRefs.current[video.socketId] = ref)}
                autoPlay
                playsInline
                style={{
                  width: "200px",
                  height: "150px",
                  backgroundColor: "black",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Meeting;
