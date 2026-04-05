# SFU ( Selective Forwarding Unit )


## Host Side:

### Overview

This system implements a server-side WebRTC media routing architecture using mediasoup (a Selective Forwarding Unit / SFU). Instead of peers connecting directly to each other, all media flows through a central server that selectively forwards streams to consumers. This enables scalable one-to-many broadcasting (e.g., a host streaming to many viewers).

### Architecture at a Glance

Host (Producer)
     │
     │  WebRTC (DTLS/SRTP)
     ▼
Mediasoup Server (SFU / Router)
     │
     │  WebRTC (DTLS/SRTP)
     ▼
Viewers (Consumers)

The host flow has two distinct phases:
    - Host captures camera + screen, sends media up to the server via a producer transport
    - Server holds the media in a producer, then forwards it to each viewer
    - Viewers receive media down from the server via a consumer transport


### Initialize from Server
- When the Socket.IO gateway starts, mediasoup does two things:
    + Create a Worker: a separate OS-level process that mediasoup spawns to handle all media processing (RTP forwarding, DTLS handshakes, SRTP encryption/decryption). It runs independently from Node.js so that CPU-heavy media work does not block the event loop.
    + Create a Router: represents a single media room or channel. It holds the set of supported codecs and acts as the hub that connects producers (senders) to consumers (receivers).

#### 1. Host Fetches RTP Capabilities 
How --> Client emits: getRtpCapabilities 
        Server returns: the router's rtpCapabilities

```ts
// Server
@SubscribeMessage('getRtpCapabilities')
getRtpCapabilities(@ConnectedSocket() client: Socket) {
  return this.router.rtpCapabilities;
}

// Client
export const getRTPCapabilities = (): Promise<any> => {
  return new Promise((resolve) => {
    socket.emit('getRtpCapabilities', (rtpCapabilities: any) => {
      resolve(rtpCapabilities);
      rtpCapabilites = rtpCapabilities; 
    });
  });
};
```

- RTP Capabilities describe what the router (server) can handle — specifically its supported codecs and RTP header extensions. Example response:

``` ts
{
  "codecs": [
    { "kind": "video", "mimeType": "video/VP8", "clockRate": 90000 },
    { "kind": "audio", "mimeType": "audio/opus", "clockRate": 48000, "channels": 2 }
  ],
  "headerExtensions": [ ... ]
}
```

What does it for ---> 
    + When a client later creates a mediasoup Device, it loads these capabilities so it knows what codecs it is allowed to send.
    + During consumption, mediasoup intersects the router's capabilities with the consumer's capabilities to find a mutually supported codec — this is the codec negotiation step.
    + Without this, a viewer running a browser that only supports H.264 could not receive a VP8 stream.


#### 2. Create the Client-Side Device 

How ---> 

```ts
export const createDevice = async () => {
  device = new Device();                        // from 'mediasoup-client'
  await device.load({
    routerRtpCapabilities: rtpCapabilites,      // fetched in Step 1
  });
};
```

What is a Device --> 
    A mediasoup Device is the client-side representation of the mediasoup router. It is the entry point for all client-side mediasoup operations. Internally it:
        + Inspects the routerRtpCapabilities to know what codecs the server supports
        + Detects what the browser itself supports (via the WebRTC APIs)
        + Computes the intersection — the codecs that both the browser and server can handle
        + Uses this intersection for all subsequent transport and producer/consumer creation

        
#### 3. Capture Local Media

```ts
export const getLocalStream = async () => {
  // Capture webcam + microphone ( Webcam + Microphone )
  cameraStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });

  // Capture the entire display ( Screen / Window / Tab )
  screenStream = await navigator.mediaDevices.getDisplayMedia({
    video: { displaySurface: 'monitor' },
  });

  return { cameraStream, screenStream };
};
```

#### 4. Attach Streams to Video Elements

How --> 

```ts
export const streamSuccess = async (
  cameraStream: MediaStream,
  screenStream: MediaStream,
  hostRef: React.RefObject<HTMLVideoElement | null>,
  screenRef: React.RefObject<HTMLVideoElement | null>,
) => {
  if (hostRef.current) hostRef.current.srcObject = cameraStream;
  if (screenRef.current) screenRef.current.srcObject = screenStream;
};
```

- Setting videoElement.srcObject to a MediaStream gives the host a local preview of their own camera and screen share. This is purely a UI concern — the stream is playing locally inside a <video> element with no network involvement yet.


#### 5. Create the Producer Transport (WebRTC Pipeline)

a. Server creates a WebRTC transport

```ts
// Client
const transportParams = await new Promise((resolve) => {
socket.emit("createWebRtcTransport", { sender: true }, (data: any) =>
    resolve(data),
);
});

if ((transportParams as any).error) {
console.log((transportParams as any).error);
return;
}

// Server
@SubscribeMessage('createWebRtcTransport')
async createWebRTCTransport(@MessageBody() { sender }: any, @ConnectedSocket() client: Socket) {
  const transport = await this.router.createWebRtcTransport({
    listenIps: [{ ip: '0.0.0.0', announcedIp: '127.0.0.1' }],
    enableUdp: true,  
    enableTcp: true,   // TCP fallback if UDP is blocked
    preferUdp: true,  // prefer UDP for lower latency
  });

  transport.on('dtlsstatechange', (state) => {
    if (state === 'closed') transport.close();
  });

  if (sender) this.producerTransport = transport; // host's upload transport
  else this.consumerTransports.set(client.id, transport); // viewer's download transport

  return {
    id: transport.id,
    iceParameters: transport.iceParameters,
    iceCandidates: transport.iceCandidates,
    dtlsParameters: transport.dtlsParameters,
  };
}
```

```ts
- listenIps.ip: '0.0.0.0' --> Bind to all network interfaces on the server
- announcedIp: '127.0.0.1' --> The IP address advertised to clients via ICE candidates (use your public IP in production)
- enableUdp: trueAllow UDP --> the preferred protocol for real-time media due to lower overhead
- enableTcp: trueAllow TCP --> fallback for networks that block UDP (corporate firewalls)preferUdp: trueIf both are available, use UDP first

--> Server return 
id: Unique transport identifier
iceParameters: ICE credentials (usernameFragment + password) for peer authentication
iceCandidates: List of server network addresses/ports the client should try to reach
dtlsParameters: Server s DTLS certificate fingerprint for establishing encrypted media channel
```


b. Client creates a local send transport

``` ts
// Client
producerTransport = device.createSendTransport(transportParams);
```

- This creates the client-side mirror of the server transport using the parameters returned above. The client now knows the server's ICE candidates and DTLS fingerprint — enough to begin the WebRTC handshake.


c. DTLS Handshake

```ts
// Client
producerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
  try {
    await new Promise((resolve) => {
      socket.emit('transport-connect', { dtlsParameters }, resolve);
    });
    callback(); // signal mediasoup-client that connect succeeded
  } catch (error) {
    errback(error);
  }
});
// Server
@SubscribeMessage('transport-connect')
async transportConnect(@MessageBody() { dtlsParameters }) {
  await this.producerTransport.connect({ dtlsParameters });
  return {};
}
```

Explain --> How does it work:
    1. Client sends its DTLS certificate fingerprint to the server
    2. Server's transport verifies it and completes the TLS-like handshake
    3. Both sides now share a symmetric key used for SRTP — the encrypted media channel
    4. After this, all media packets are encrypted end-to-end between the client and server


d. Start Producing — transport-produce

When --> The produce event fires when producerTransport.produce() is called. It sends the track's RTP parameters to the server so the server can create a corresponding server-side producer.

How -->
```ts
// Client
producerTransport.on('produce', async (parameters, callback, errback) => {
  try {
    const { id } = await new Promise<{ id: string }>((resolve) => {
      socket.emit('transport-produce', {
        kind: parameters.kind,           // 'video' or 'audio'
        rtpParameters: parameters.rtpParameters, // codec config, SSRCs, etc.
        appData: parameters.appData,     // custom metadata (e.g. { type: 'camera' })
      }, resolve);
    });
    callback({ id }); // give mediasoup-client the server-side producer ID
  } catch (error) {
    errback(error);
  }
});

// Server
@SubscribeMessage('transport-produce')
async transportProduce(@MessageBody() data, @ConnectedSocket() client: Socket) {
  const producer = await this.producerTransport.produce({ //tells the server-side mediasoup transport to start expecting and accepting RTP packets for a specific track from the host
    kind: data.kind,
    rtpParameters: data.rtpParameters,
    appData: data.appData,
  });

  this.producers.set(producer.id, producer);

  producer.on('transportclose', () => {
    this.producers.delete(producer.id); // cleanup on disconnect
  });

  // Notify all other connected clients that a new stream is available
  client.broadcast.emit('producer-ready', { producerId: producer.id });

  return { id: producer.id };
}
```

- rtpParameters contains the full RTP configuration for the track being sent ( codec payload types, SSRC identifiers, RTX (retransmission) parameters, and header extensions ) .

- The producer-ready broadcast is the trigger for viewers to begin consuming — when they receive this event, they know a stream exists and can subscribe to it.


#### 6. Connect the Send Transport and Begin Streaming

``` ts
export const connectSendTransport = async () => {
  const cameraTrack = cameraStream.getVideoTracks()[0];

  producer = await producerTransport.produce({
    track: cameraTrack,
    encodings: encodingParams.encodings,
    codecOptions: encodingParams.codecOptions,
    appData: { type: 'camera' },
  });

  producer.on('trackended', () => { /* camera physically stopped */ });
  producer.on('transportclose', () => { /* network disconnected */ });
};
```
``` ts
const encodingParams = {
  encodings: [
    { rid: 'r0', maxBitrate: 100000,  scalabilityMode: 'S1T3' }, // low quality
    { rid: 'r1', maxBitrate: 300000,  scalabilityMode: 'S1T3' }, // medium quality
    { rid: 'r2', maxBitrate: 900000,  scalabilityMode: 'S1T3' }, // high quality
  ],
  codecOptions: {
    videoGoogleStartBitrate: 1000, // initial bitrate in kbps
  },
};
```

### Full Host Data Flow
```ts
[Host Browser]
  │
  ├─ getUserMedia()          → cameraStream (webcam + mic)
  ├─ getDisplayMedia()       → screenStream (desktop)
  │
  ├─ socket: getRtpCapabilities    →→→ [Server]
  │                          ←←← routerRtpCapabilities
  │
  ├─ device.load(rtpCapabilities)  (local, no network)
  │
  ├─ socket: createWebRtcTransport →→→ [Server] creates producerTransport
  │                          ←←← { id, iceParameters, iceCandidates, dtlsParameters }
  │
  ├─ device.createSendTransport()  (local)
  │
  ├─ producerTransport.produce()
  │    ├─ triggers 'connect' event
  │    │    └─ socket: transport-connect { dtlsParameters } →→→ [Server] DTLS handshake
  │    │
  │    └─ triggers 'produce' event
  │         └─ socket: transport-produce { kind, rtpParameters, appData } →→→ [Server]
  │                                       creates server-side producer
  │                                       broadcasts 'producer-ready' to viewers
  │
  └─ RTP/SRTP media packets ════════════════════════════════► [Server mediasoup router]
                                                                       │
                                                              ◄════════╪════════► [Viewer A]
                                                                       └════════► [Viewer B]
```



## Viewer Side:

### Overview

After a viewer completes the shared setup steps (fetching RTP Capabilities and creating a Device — identical to the host), they need to establish a receive pipeline. Unlike the host who pushes media up to the server, the viewer pulls media down from the server through a consumer transport.

The viewer flow has two distinct phases:

    - Transport Setup — create a WebRTC pipeline dedicated to receiving
    - Consumption — subscribe to every available producer and render their tracks into video elements

#### 1, 2: Same as Host ( getRTPCapabilities and create device )

#### Step 3: Create the Receive Transport ( After step 5 of host )

```ts
export const createRecevTransport = async () => {
  const transportParams = await new Promise((resolve) => {
    socket.emit('createWebRtcTransport', { sender: false }, (data: any) =>
      resolve(data),
    );
  });
```

a. Server Creates a Consumer Transport

Client emits: createWebRtcTransport with { sender: false }
The same server handler used by the host is reused here — the sender flag is the only differentiator:

``` ts
// Server
if (sender) this.producerTransport = transport;          // host path
else this.consumerTransports.set(client.id, transport);  // viewer path
```

--> Because sender is false, the server stores the transport in consumerTransports — a Map keyed by client.id. This means every viewer gets their own isolated transport, allowing the server to manage hundreds of concurrent viewers independently.

The server returns the same four connection parameters as the producer case:
```ts
{
  "id": "transport-uuid",
  "iceParameters":  { "usernameFragment": "...", "password": "..." },
  "iceCandidates":  [{ "ip": "127.0.0.1", "port": 2001, "protocol": "udp", ... }],
  "dtlsParameters": { "fingerprints": [...], "role": "auto" }
}
```

b. Client Creates a Local Receive Transport

```ts
consumerTransport = device.createRecvTransport(transportParams);
```

- `createRecvTransport` is the receive-direction counterpart to createSendTransport. It creates a one-way WebRTC pipeline configured only for inbound media — the client will only receive RTP packets through this transport, never send them.

Internally, the mediasoup Device uses the transportParams to:
    + Register the server's ICE candidates as the destination to connect to
    + Prepare to verify the server's DTLS certificate fingerprint
    + Set up the local ICE agent to begin connectivity checks

c. DTLS Handshake — transport-recv-connect

``` ts
// Client — fires when consume() is first called
consumerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
  try {
    await new Promise((resolve) => {
      socket.emit('transport-recv-connect', { dtlsParameters }, resolve);
    });
    callback();
  } catch (error) {
    errback(error);
  }
});

// Server
@SubscribeMessage('transport-recv-connect')
async transportRecvConnect(
  @MessageBody() { dtlsParameters },
  @ConnectedSocket() client: Socket,
) {
  const consumerTransport = this.consumerTransports.get(client.id); // viewer's own transport
  await consumerTransport.connect({ dtlsParameters });
  return {};
}
```
- This is identical in purpose to the host's transport-connect step. The viewer sends their DTLS parameters to the server so the server can complete the mutual TLS handshake. After this completes, an encrypted SRTP channel exists between this viewer and the server, through which the server will push RTP media packets down to the viewer.

- Note that the server looks up the transport using this.consumerTransports.get(client.id) — this is why keying by socket ID is important. Each viewer has their own transport and their own independent encrypted channel.

- The connect event only fires once, the first time consumerTransport.consume() is called. All subsequent consumers on the same transport reuse the already-established connection.


#### 6. Consume All Producers and Render Video

```ts
export const connectRecvTransport = async (
  viewerVideoRef: React.RefObject<HTMLVideoElement | null>,
  sharedVideoRef: React.RefObject<HTMLVideoElement | null>,
) => {
  const allParams = await new Promise((resolve) => {
    socket.emit(
      'consume-all',
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
    const type = params.appData?.type; // 'camera' or 'screen'

    if (type === 'camera' && viewerVideoRef.current) {
      viewerVideoRef.current.srcObject = new MediaStream([track]);
    } else if (type === 'screen' && sharedVideoRef.current) {
      sharedVideoRef.current.srcObject = new MediaStream([track]);
    }

    await new Promise((resolve) => {
      socket.emit('consumer-resume', { consumerId: consumer.id }, resolve);
    });
  }
};
```

a. Server — consume-all: Iterating Producers and Creating Consumers

- Client emits: consume-all with { rtpCapabilities: device.rtpCapabilities }
- The viewer sends its own rtpCapabilities — the set of codecs and extensions the browser can receive. The server uses this to verify compatibility before creating each consumer.

```ts
// Server
@SubscribeMessage('consume-all')
async consumeAll(@MessageBody() { rtpCapabilities }, @ConnectedSocket() client: Socket) {
  const consumers: any[] = [];
  const consumerTransport = this.consumerTransports.get(client.id);

  for (const [, producer] of this.producers) {
    // Codec compatibility check
    if (!this.router.canConsume({ producerId: producer.id, rtpCapabilities }))
      continue;

    const consumer = await consumerTransport.consume({
      producerId: producer.id,
      rtpCapabilities,
      paused: true,          // start paused — client will resume after setup
    });

    this.consumers.set(`${client.id}-${producer.id}`, consumer);

    consumers.push({
      id: consumer.id,
      producerId: producer.id,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
      appData: producer.appData,   // forward the { type: 'camera' | 'screen' } tag
    });
  }

  return consumers;
}
```
- `router.canConsume()` — Before creating a consumer, the server checks whether the viewer's browser can actually decode what the producer is sending. If the host is streaming VP8 but a hypothetical viewer only supports H.264, canConsume returns false and that producer is skipped rather than crashing.

- `consumerTransport.consume()` — Creates a server-side consumer that links a specific producer to this viewer's transport. The server will now forward RTP packets from that producer down to this viewer. Key parameters:

    + producerId --> Which producer's stream to subscribe to
    + rtpCapabilities --> Viewer's capabilities, used to select the right codec and simulcast layer
    + paused: true --> Consumer starts paused — no media flows yet until the client explicitly resumes


- `paused: true` is intentional. The consumer is created paused so the server does not waste bandwidth sending RTP packets before the client has finished setting up the local consumer object and attached it to a video element. The client resumes each consumer individually via consumer-resume once it is ready.

- `this.consumers.set(client.id−{client.id}-client.id−{producer.id}, consumer)` — The composite key clientId-producerId` ensures consumers can be individually addressed later (e.g., for closing a specific stream when a producer disconnects).

`appData: producer.appData` —   The appData object that the host attached when producing (`{ type: 'camera' }` or `{ type: 'screen' }`) is forwarded to the viewer. The viewer uses this metadata to decide which <video> element to render the track into.

The server returns an array — one entry per compatible producer:
```ts
[
  {
    "id": "consumer-uuid-1",
    "producerId": "producer-uuid-1",
    "kind": "video",
    "rtpParameters": { ... },
    "appData": { "type": "camera" }
  },
  {
    "id": "consumer-uuid-2",
    "producerId": "producer-uuid-2",
    "kind": "audio",
    "rtpParameters": { ... },
    "appData": { "type": "camera" }
  }
]
```

b. Client — Creating Local Consumers
```ts
for (const params of allParams as any[]) {
  if (params.error) continue;

  const consumer = await consumerTransport.consume({
    id: params.id,
    producerId: params.producerId,
    kind: params.kind,
    rtpParameters: params.rtpParameters,
  });
}
```
- For each set of params returned by the server, `consumerTransport.consume()` creates a client-side consumer. This tells the local WebRTC engine exactly what RTP stream to expect — which SSRC identifiers to listen for, what codec to decode with, what header extensions to process.

- This call does not make a network request. It configures the local RTP receiver using the parameters negotiated server-side. The first call to consume() is also what triggers the connect event on consumerTransport, initiating the DTLS handshake from Step 6.c.

c. Routing Tracks to Video Elements via appData

```ts
const { track } = consumer;
const type = params.appData?.type;

if (type === 'camera' && viewerVideoRef.current) {
  viewerVideoRef.current.srcObject = new MediaStream([track]);
} else if (type === 'screen' && sharedVideoRef.current) {
  sharedVideoRef.current.srcObject = new MediaStream([track]);
}
```

- Each consumer exposes a track — a MediaStreamTrack that receives the decoded media. Wrapping it in new MediaStream([track]) and assigning it to srcObject makes the video element start rendering it.

- The appData.type field is the routing key: the same metadata the host set when calling producerTransport.produce({ appData: { type: 'camera' } }) flows through the server and arrives here, allowing the viewer to correctly assign each track to the right <video> element without guessing.


d. Resuming Each Consumer

```ts
await new Promise((resolve) => {
  socket.emit('consumer-resume', { consumerId: consumer.id }, resolve);
});
```

### Full Viewer Data Flow
``` ts
- After the local consumer and video element are fully set up, the client tells the server to unpause that specific consumer. From this point, the server begins forwarding RTP packets for that producer down to this viewer, and the video element starts playing.

- Resuming happens inside the loop, one consumer at a time, ensuring each stream is fully initialized before its media starts flowing.

[Viewer Browser]
  │
  ├─ (same as host) socket: getRtpCapabilities →→→ [Server]
  │                                        ←←← routerRtpCapabilities
  │
  ├─ (same as host) device.load(rtpCapabilities)    (local)
  │
  ├─ socket: createWebRtcTransport { sender: false } →→→ [Server]
  │          server stores transport in consumerTransports[client.id]
  │                                        ←←← { id, iceParameters, iceCandidates, dtlsParameters }
  │
  ├─ device.createRecvTransport(transportParams)     (local)
  │
  ├─ socket: consume-all { rtpCapabilities } →→→ [Server]
  │          server iterates this.producers
  │          checks canConsume() per producer
  │          creates server-side consumers (paused)
  │          forwards appData from producer to consumer
  │                                        ←←← [consumerParams, consumerParams, ...]
  │
  ├─ for each consumerParams:
  │    ├─ consumerTransport.consume(params)           (local — triggers 'connect' on first call)
  │    │    └─ 'connect' fires once:
  │    │         socket: transport-recv-connect { dtlsParameters } →→→ [Server]
  │    │                                        DTLS handshake complete
  │    │
  │    ├─ consumer.track → new MediaStream([track]) → videoElement.srcObject
  │    │    (routed by appData.type: 'camera' → viewerVideoRef, 'screen' → sharedVideoRef)
  │    │
  │    └─ socket: consumer-resume { consumerId } →→→ [Server]
  │               server unpauses consumer
  │
  └─ ◄══ RTP/SRTP media packets flowing down from server per resumed consumer ══◄
              camera track → viewerVideoRef <video>
              screen track → sharedVideoRef <video>
```