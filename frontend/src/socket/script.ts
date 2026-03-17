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
  viewerRef: React.RefObject<HTMLVideoElement | null>,
  remoteStreamRef: React.MutableRefObject<MediaStream | null>,
  roomId: string,
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>,
) => {
  if (localStreamRef.current || isStartingRef.current) return;
  isStartingRef.current = true;
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    // audio: true,
  });

  localStreamRef.current = stream;

  if (hostRef.current) {
    hostRef.current.srcObject = stream;
  }

  createOffer(
    viewerRef,
    localStreamRef,
    roomId,
    remoteStreamRef,
    peerConnectionRef,
  );
};

// export const createOffer = async (
//   viewerRef: React.RefObject<HTMLVideoElement | null>,
//   localStreamRef: React.MutableRefObject<MediaStream | null>,
//   roomId: string,
//   remoteStreamRef: React.MutableRefObject<MediaStream | null>,
//   peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>,
// ) => {

//   const peerConnection = new RTCPeerConnection(peerConfiguration);
//   peerConnectionRef.current = peerConnection;
//   const remoteStream = new MediaStream();

//   remoteStreamRef.current = remoteStream;

//   if (viewerRef.current) {
//     viewerRef.current.srcObject = remoteStream;
//   }

//   localStreamRef.current?.getTracks().forEach((track) => {
//     peerConnection.addTrack(track, localStreamRef.current as MediaStream);
//   });

//   peerConnection.ontrack = (event) => {
//     event.streams[0].getTracks().forEach((track) => {
//       remoteStream.addTrack(track);
//     });
//   };

//   peerConnection.onicecandidate = async (event: any) => {
//     if (event.candidate) {
//       socket.emit("send-ice", { candidate: event.candidate, roomId });
//     } else {
//     }
//   };

//   socket.on("viewer-joined", async () => {
//     const newOffer = await peerConnection.createOffer();
//     await peerConnection.setLocalDescription(newOffer);
//     socket.emit("send-offer", { offer: newOffer, roomId });
//   });

//   socket.on("receive-answer", async (answer) => {

//     if (peerConnection.signalingState === "have-local-offer") {
//       await peerConnection.setRemoteDescription(answer);
//     }
//   });

//   socket.on("receive-ice", async (candidate) => {
//     if (candidate) {
//       await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//     }
//   });

//   let offer = await peerConnection.createOffer();
//   await peerConnection.setLocalDescription(offer);
//   socket.emit("send-offer", { offer, roomId });
// };

export const createOffer = async (
  viewerRef: React.RefObject<HTMLVideoElement | null>,
  localStreamRef: React.MutableRefObject<MediaStream | null>,
  roomId: string,
  remoteStreamRef: React.MutableRefObject<MediaStream | null>,
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>,
) => {
  const createAndSendOffer = async () => {
    peerConnectionRef.current?.close();

    const peerConnection = new RTCPeerConnection(peerConfiguration);
    peerConnectionRef.current = peerConnection;

    localStreamRef.current?.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStreamRef.current as MediaStream);
    });

    const remoteStream = new MediaStream();

    remoteStreamRef.current = remoteStream;

    if (viewerRef.current) {
      viewerRef.current.srcObject = remoteStream;
    }

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("send-ice", { candidate: event.candidate, roomId });
      }
    };

    socket.off("receive-answer");
    socket.on("receive-answer", async (answer) => {
      if (peerConnection.signalingState === "have-local-offer") {
        await peerConnection.setRemoteDescription(answer);
      }
    });

    socket.off("receive-ice");
    socket.on("receive-ice", async (candidate) => {
      if (candidate) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

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
  socket.on("receive-ice", async (candidate) => {
    if (candidate && peerConnectionRef.current) {
      await peerConnectionRef.current.addIceCandidate(
        new RTCIceCandidate(candidate),
      );
    }
  });
  socket.on("receive-offer", async (offer) => {
    const peerConnection = new RTCPeerConnection(peerConfiguration);
    peerConnectionRef.current = peerConnection;

    const remoteStream = new MediaStream();
    remoteStreamRef.current = remoteStream;

    if (viewerRef.current) {
      viewerRef.current.srcObject = remoteStream;
    }

    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
      if (viewerRef.current) {
        viewerRef.current.srcObject = remoteStream;
      }
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("send-ice", { candidate: event.candidate, roomId });
      }
    };

    await peerConnection.setRemoteDescription(offer);
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
