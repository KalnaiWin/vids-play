import { socket } from "./socket";
import {
  Room,
  RoomEvent,
  Track,
  LocalVideoTrack,
  LocalAudioTrack,
  createLocalVideoTrack,
  createLocalAudioTrack,
} from "livekit-client";

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL;

let room: Room;
let cameraTrack: LocalVideoTrack;
let screenTrack: LocalVideoTrack;
let screenAudioTrack: LocalAudioTrack;
let micAudioTrack: LocalAudioTrack;

// ── HOST ─────────────────────────────────────────────────────────────────────

export const startAsHost = async (
  roomId: string,
  hostRef: React.RefObject<HTMLVideoElement | null>,
  screenRef: React.RefObject<HTMLVideoElement | null>,
) => {
  const { token } = await new Promise<{ token: string }>((resolve) => {
    socket.emit("get-host-token", { roomId }, resolve);
  });

  if (room) await room.disconnect().catch(() => {});

  room = new Room();

  await room.connect(LIVEKIT_URL, token);

  // Camera
  cameraTrack = await createLocalVideoTrack({ facingMode: "user" });
  await room.localParticipant.publishTrack(cameraTrack, {
    name: "camera",
    source: Track.Source.Camera,
  });

  // Audio from mic
  micAudioTrack = await createLocalAudioTrack({
    echoCancellation: true, // ✅ cancels screen share audio feedback
    noiseSuppression: true, // ✅ removes background noise
    autoGainControl: true, // ✅ normalizes volume
  });
  await room.localParticipant.publishTrack(micAudioTrack);

  // Screen share
  const screenTracks = await room.localParticipant.createScreenTracks({
    video: { displaySurface: "monitor" }, // or "window"
    audio: true, // or { ... } if you want more control
    suppressLocalAudioPlayback: true, // ← Correct place
  });

  for (const track of screenTracks) {
    await room.localParticipant.publishTrack(track);

    if (track.kind === Track.Kind.Video) {
      screenTrack = track as LocalVideoTrack;
    } else if (track.kind === Track.Kind.Audio) {
      screenAudioTrack = track as LocalAudioTrack;
    }
  }
  // Attach locally
  if (screenRef.current && screenTrack) screenTrack.attach(screenRef.current);
  if (hostRef.current) cameraTrack.attach(hostRef.current);

  // Emit AFTER everything is published
  socket.emit("start-stream", { roomId });
};
// ── VIEWER ────────────────────────────────────────────────────────────────────

export const joinAsViewer = async (
  roomId: string,
  cameraRef: React.RefObject<HTMLVideoElement | null>,
  sharedRef: React.RefObject<HTMLVideoElement | null>,
  isHost: boolean = false, 
) => {
  const { token } = await new Promise<{ token: string }>((resolve) => {
    socket.emit("get-viewer-token", { roomId }, resolve);
  });

  if (room) await room.disconnect().catch(() => {});
  room = new Room();

  const audioElements: HTMLAudioElement[] = [];

  room.on(RoomEvent.TrackSubscribed, (track) => {
    if (track.kind === Track.Kind.Video) {
      if (track.source === Track.Source.Camera && cameraRef.current) {
        track.attach(cameraRef.current);
      } else if (
        track.source === Track.Source.ScreenShare &&
        sharedRef.current
      ) {
        track.attach(sharedRef.current);
      }
    } else if (track.kind === Track.Kind.Audio) {
      if (isHost) return; // ✅ host never plays back their own audio

      const audioEl = track.attach() as HTMLAudioElement;
      audioEl.style.display = "none";
      document.body.appendChild(audioEl);
      audioEl.play().catch(() => {});
      audioElements.push(audioEl);
    }
  });

  await room.connect(LIVEKIT_URL, token);

  // Recover existing tracks
  room.remoteParticipants.forEach((participant) => {
    participant.trackPublications.forEach((pub) => {
      if (pub.track && pub.isSubscribed) {
        if (pub.kind === Track.Kind.Audio) {
          if (isHost) return; // ✅ skip audio for host

          const audioEl = pub.track.attach() as HTMLAudioElement;
          audioEl.style.display = "none";
          document.body.appendChild(audioEl);
          audioEl.play().catch(() => {});
          audioElements.push(audioEl);
        }
      } else if (!pub.isSubscribed && pub.track) {
        pub.setSubscribed(true);
      }
    });
  });

  return () => {
    audioElements.forEach((el) => {
      el.pause();
      el.remove();
    });
  };
};

// ── CONTROLS ──────────────────────────────────────────────────────────────────

export const toggleCamera = async (
  hostRef: React.RefObject<HTMLVideoElement | null>,
  setToggleCamera: React.Dispatch<React.SetStateAction<boolean>>,
  roomId: string,
) => {
  if (!cameraTrack) return;

  const willEnable = cameraTrack.isMuted;
  willEnable ? await cameraTrack.unmute() : await cameraTrack.mute();
  setToggleCamera(willEnable);

  socket.emit("camera-toggle", { roomId, enabled: willEnable });

  if (hostRef.current) {
    hostRef.current.style.visibility = willEnable ? "visible" : "hidden";
  }
};

export const toggleMicro = (
  setToggleMicro: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  if (!micAudioTrack) return;
  const willEnable = micAudioTrack.isMuted;
  if (willEnable) {
    micAudioTrack.unmute();
  } else {
    micAudioTrack.mute();
  }
  setToggleMicro(willEnable);
};
export const stopStream = async (roomId: string) => {
  socket.emit("stream-ended", { roomId });
  await room?.disconnect();
  room = undefined as any;
  cameraTrack = undefined as any;
  screenTrack = undefined as any;
  screenAudioTrack = undefined as any;
  micAudioTrack = undefined as any;
};
