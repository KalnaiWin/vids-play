import { socket } from "./socket";
import { Device } from "mediasoup-client";

let isJoining = false;

let device: any;
let cameraStream: any;
let screenStream: any;

let rtpCapabilites: any;
let producerTransport: any;
let consumerTransport: any;

let producer: any[] = [];
const encodingParams = {
  encodings: [
    { rid: "r0", maxBitrate: 100000, scalabilityMode: "S1T3" },
    { rid: "r1", maxBitrate: 300000, scalabilityMode: "S1T3" },
    { rid: "r2", maxBitrate: 900000, scalabilityMode: "S1T3" },
  ],
  codecOptions: {
    videoGoogleStartBitrate: 1000,
  },
};

export const getLocalStream = async () => {
  cameraStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  screenStream = await navigator.mediaDevices.getDisplayMedia({
    video: {
      displaySurface: "monitor",
    },
  });
  return { cameraStream, screenStream };
};

export const streamSuccess = async (
  cameraStream: MediaStream,
  screenStream: MediaStream,
  hostRef: React.RefObject<HTMLVideoElement | null>,
  screenRef: React.RefObject<HTMLVideoElement | null>,
) => {
  if (hostRef.current) {
    hostRef.current.srcObject = cameraStream;
  }
  if (screenRef.current) {
    screenRef.current.srcObject = screenStream;
  }
};

export const getRTPCapabilities = (): Promise<any> => {
  return new Promise((resolve) => {
    socket.emit("getRtpCapabilities", (rtpCapabilities: any) => {
      // console.log("Router RTP Capabilities:", rtpCapabilities);
      resolve(rtpCapabilities);
      rtpCapabilites = rtpCapabilities;
    });
  });
};

export const createDevice = async () => {
  try {
    device = new Device();
    const rtpCapabilities = rtpCapabilites;
    await device.load({
      routerRtpCapabilities: rtpCapabilities,
    });

    // console.log("Device created:", device);
  } catch (error: any) {
    console.log(error);
  }
};

export const createSendTransport = async () => {
  const transportParams = await new Promise((resolve) => {
    socket.emit("createWebRtcTransport", { sender: true }, (data: any) =>
      resolve(data),
    );
  });

  if ((transportParams as any).error) {
    console.log((transportParams as any).error);
    return;
  }

  producerTransport = device.createSendTransport(transportParams);

  // console.log("Transport created:", producerTransport);

  producerTransport.on(
    "connect",
    async ({ dtlsParameters }: any, callback: any, errback: any) => {
      try {
        await new Promise((resolve) => {
          socket.emit("transport-connect", { dtlsParameters }, resolve);
        });
        callback();
      } catch (error) {
        errback(error);
      }
    },
  );

  producerTransport.on(
    "produce",
    async (parameters: any, callback: any, errback: any) => {
      try {
        const { id } = await new Promise<{ id: string }>((resolve) => {
          socket.emit(
            "transport-produce",
            {
              kind: parameters.kind,
              rtpParameters: parameters.rtpParameters,
              appData: parameters.appData,
            },
            (data: { id: string }) => resolve(data),
          );
        });

        callback({ id });
      } catch (error) {
        errback(error);
      }
    },
  );
};

export const connectSendTransport = async () => {
  const cameraTrack = cameraStream.getVideoTracks()[0];

  producer.push(
    await producerTransport.produce({
      track: cameraTrack,
      encodings: encodingParams.encodings,
      codecOptions: encodingParams.codecOptions,
      appData: { type: "camera" },
    }),
  );

  // Screen track
  const screenTrack = screenStream.getVideoTracks()[0];
  producer.push(
    await producerTransport.produce({
      track: screenTrack,
      encodings: encodingParams.encodings,
      codecOptions: encodingParams.codecOptions,
      appData: { type: "screen" },
    }),
  );

  // console.log("Producer: ", producer);

  // producer.on("trackended", () => {
  //   console.log("track ended");
  // });

  // producer.on("transportclose", () => {
  //   console.log("transport ended");
  // });
};

export const createRecevTransport = async () => {
  const transportParams = await new Promise((resolve) => {
    socket.emit("createWebRtcTransport", { sender: false }, (data: any) =>
      resolve(data),
    );
  });

  // console.log(transportParams);

  consumerTransport = device.createRecvTransport(transportParams);

  consumerTransport.on(
    "connect",
    async ({ dtlsParameters }: any, callback: any, errback: any) => {
      try {
        await new Promise((resolve) => {
          socket.emit("transport-recv-connect", { dtlsParameters }, resolve);
        });
        callback();
      } catch (error) {
        errback(error);
      }
    },
  );
};

export const connectRecvTransport = async (
  viewerVideoRef: React.RefObject<HTMLVideoElement | null>,
  sharedVideoRef: React.RefObject<HTMLVideoElement | null>,
) => {
  const allParams = await new Promise((resolve) => {
    socket.emit(
      "consume-all",
      { rtpCapabilities: device.rtpCapabilities },
      (data: any) => resolve(data),
    );
  });

  for (const params of allParams as any[]) {
    if (params.error) continue;

    const consumer = await consumerTransport.consume({
      id: params.id,
      producerId: params.producerId,
      kind: params.kind,
      rtpParameters: params.rtpParameters,
    });

    const { track } = consumer;
    const type = params.appData?.type; // "camera" or "screen"

    if (type === "camera" && viewerVideoRef.current) {
      viewerVideoRef.current.srcObject = new MediaStream([track]);
    } else if (type === "screen" && sharedVideoRef.current) {
      sharedVideoRef.current.srcObject = new MediaStream([track]);
    }

    await new Promise((resolve) => {
      socket.emit("consumer-resume", { consumerId: consumer.id }, resolve);
    });
  }
};

export const waitForProducer = (): Promise<void> => {
  return new Promise((resolve) => {
    socket.emit("check-producer", (exists: boolean) => {
      if (exists) return resolve();
      socket.once("producer-ready", () => resolve());
    });
  });
};

export const toggleCamera = async (
  hostRef: React.RefObject<HTMLVideoElement | null>,
  setToggleCamera: React.Dispatch<React.SetStateAction<boolean>>,
  roomId: string,
) => {
  const videoTrack = cameraStream?.getVideoTracks()[0];
  if (!videoTrack) return;

  videoTrack.enabled = !videoTrack.enabled;
  setToggleCamera(videoTrack.enabled);
  socket.emit("camera-toggle", { roomId, enabled: videoTrack.enabled });
  if (hostRef.current) {
    hostRef.current.style.visibility = videoTrack.enabled
      ? "visible"
      : "hidden";
  }
};
export const toggleMicro = (
  setToggleMicro: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const audioTrack = cameraStream?.getAudioTracks()[0];
  if (!audioTrack) return;

  audioTrack.enabled = !audioTrack.enabled;
  setToggleMicro(audioTrack.enabled);
};

export const stopStream = () => {
  cameraStream?.getTracks().forEach((track: MediaStreamTrack) => track.stop());
  screenStream?.getTracks().forEach((track: MediaStreamTrack) => track.stop());

  cameraStream = null;
  screenStream = null;
};

export const joinAsViewer = async (
  cameraRef: React.RefObject<HTMLVideoElement | null>,
  sharedRef: React.RefObject<HTMLVideoElement | null>,
) => {
  if (isJoining) return;
  isJoining = true;
  try {
    await getRTPCapabilities();
    await createDevice();
    await createRecevTransport();
    await connectRecvTransport(cameraRef, sharedRef);
  } finally {
    isJoining = false;
  }
};
