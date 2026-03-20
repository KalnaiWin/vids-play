import { useState } from "react";
import { socket } from "./socket";

const peerConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
    },
  ],
};

export const startCamera = async (
  hostRef: React.RefObject<HTMLVideoElement | null>,
  localStreamRef: React.MutableRefObject<MediaStream | null>,
  isStartingRef: React.MutableRefObject<boolean>,
  roomId: string,
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>,
) => {
  if (localStreamRef.current || isStartingRef.current) return;
  isStartingRef.current = true;
  const stream = await navigator.mediaDevices.getUserMedia({
    // get camera stream ( browser ask for camera permission )
    video: true,
    audio: true,
  });

  // save stream
  localStreamRef.current = stream;

  // preview stream on host video ( <video ref = {hostRef} /> )
  if (hostRef.current) {
    hostRef.current.srcObject = stream;
  }

  // start WebRTC handshake
  createOffer(localStreamRef, roomId, peerConnectionRef);
};

export const createOffer = async (
  localStreamRef: React.MutableRefObject<MediaStream | null>,
  roomId: string,
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>,
) => {
  const createAndSendOffer = async () => {
    // close the old peerConnection and reset it
    peerConnectionRef.current?.close();
    // create a new peerConnection
    const peerConnection = new RTCPeerConnection(peerConfiguration);
    peerConnectionRef.current = peerConnection;
    // Add local stream tracks
    localStreamRef.current?.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStreamRef.current as MediaStream);
    });

    // send ice candidate to backend vio socket
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("send-ice", { candidate: event.candidate, roomId });
      }
    };

    // finish previous --> viewers replies --> complete handshake
    socket.off("receive-answer");
    socket.on("receive-answer", async (answer) => {
      if (peerConnection.signalingState === "have-local-offer") {
        await peerConnection.setRemoteDescription(answer);
      }
    });

    // Listen for ICE from viewers
    socket.off("receive-ice");
    socket.on("receive-ice", async (candidate) => {
      if (candidate) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    // Create offer --> start the connection
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("send-offer", { offer, roomId });
  };

  // Send offer immediately for anyone already in the room
  await createAndSendOffer();

  // Re-create fresh connection for each new viewer
  socket.off("viewer-joined");
  socket.on("viewer-joined", async () => {
    await createAndSendOffer();
  });
};

export const handleViewer = async (
  viewerRef: React.RefObject<HTMLVideoElement | null>,
  roomId: string,
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>,
  remoteStreamRef: React.MutableRefObject<MediaStream | null>,
) => {
  // Receive ICE from host
  socket.on("receive-ice", async (candidate) => {
    if (candidate && peerConnectionRef.current) {
      await peerConnectionRef.current.addIceCandidate(
        // browser try to ping that address
        new RTCIceCandidate(candidate), // a formal ICE object ( IP adress, Port, Protocal(UDP) )
      );
    }
  });

  // receive offer from host
  socket.on("receive-offer", async (offer) => {
    // create pperConnection
    const peerConnection = new RTCPeerConnection(peerConfiguration);
    peerConnectionRef.current = peerConnection;

    const remoteStream = new MediaStream();
    remoteStreamRef.current = remoteStream;

    if (viewerRef.current) {
      viewerRef.current.srcObject = remoteStream;
    }

    // receive video/audio tracks
    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
      if (viewerRef.current) {
        viewerRef.current.srcObject = remoteStream;
      }
    };

    // send ICE back
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("send-ice", { candidate: event.candidate, roomId });
      }
    };

    // set the Host's info as the "Remote Description"
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    // create answer --> send back to host
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit("send-answer", { answer, roomId });
  });
};

export const stopCamera = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  streamRef: React.MutableRefObject<MediaStream | null>,
  isStartingRef: React.MutableRefObject<boolean>,
) => {
  streamRef.current?.getTracks().forEach((track) => track.stop());
  streamRef.current = null;
  isStartingRef.current = false;

  if (videoRef.current) {
    videoRef.current.srcObject = null;
  }
};

export const toggleCamera = (
  localStreamRef: React.MutableRefObject<MediaStream | null>,
  setToggleCamera: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const videoTrack = localStreamRef.current
    ?.getTracks()
    .find((track) => track.kind === "video");

  if (!videoTrack) return;

  videoTrack.enabled = !videoTrack.enabled;
  setToggleCamera(videoTrack.enabled);
};

export const toggleMicro = (
  localStreamRef: React.MutableRefObject<MediaStream | null>,
  setToggleMicro: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const videoTrack = localStreamRef.current
    ?.getTracks()
    .find((track) => track.kind === "audio");

  if (!videoTrack) return;

  videoTrack.enabled = !videoTrack.enabled;
  setToggleMicro(videoTrack.enabled);
};
