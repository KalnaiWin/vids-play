import { socket } from "./socket";
import { Device } from "mediasoup-client";

let device: any;
let stream: any;
let rtpCapabilites: any;
let producerTransport: any;
let consumerTransport: any;
let producer: any;
let consumer: any;
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
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  return stream;
};

export const streamSuccess = async (
  stream: MediaStream,
  hostRef: React.RefObject<HTMLVideoElement | null>,
) => {
  if (hostRef.current) {
    hostRef.current.srcObject = stream;
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
  const track = stream.getVideoTracks()[0];

  producer = await producerTransport.produce({
    track,
    encodings: encodingParams.encodings,
    codecOptions: encodingParams.codecOptions,
  });

  // console.log("Producer: ", producer);

  producer.on("trackended", () => {
    // console.log("track ended");
  });

  producer.on("transportclose", () => {
    // console.log("transport ended");
  });
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
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>,
) => {
  const params = await new Promise((resolve) => {
    socket.emit(
      "consume",
      { rtpCapabilities: device.rtpCapabilities },
      (data: any) => resolve(data),
    );
  });

  if ((params as any).error) {
    return;
  }

  consumer = await consumerTransport.consume({
    id: (params as any).id,
    producerId: (params as any).producerId,
    kind: (params as any).kind,
    rtpParameters: (params as any).rtpParameters,
  });

  const { track } = consumer;

  if (remoteVideoRef.current) {
    remoteVideoRef.current.srcObject = new MediaStream([track]);
  }

  await new Promise((resolve) => {
    socket.emit("consumer-resume", {}, resolve);
  });
};

export const startViewing = async (
  videoRef: React.RefObject<HTMLVideoElement | null>,
) => {
  await connectRecvTransport(videoRef);
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

export const stopStream = (
  localStreamRef: React.MutableRefObject<MediaStream | null>,
) => {
  if (localStreamRef.current) {
    localStreamRef.current.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
  }
};

export const startStreamingAgain = async (
  localStreamRef: React.MutableRefObject<MediaStream | null>,
  hostRef: React.RefObject<HTMLVideoElement | null>,
  roomId: string,
) => {
  const stream = await getLocalStream();
  localStreamRef.current = stream;

  await createDevice();
  await createSendTransport();
  await connectSendTransport();

  streamSuccess(stream, hostRef);

  socket.emit("resume-stream", { roomId });
};
