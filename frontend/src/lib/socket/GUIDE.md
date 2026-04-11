# SFU ( Selective Forwarding Unit )

## HOST


1. startAsHost ( active when host click start live )
	1.1. Send request to backend to create an access token
		- Access token is a key to grant permission ( join room, stream, watch )
		- Its payload include `( api_key, api_secret, identity )`, `identity`: who this user is in LiveKit
		- `addGrant`: define what user can do:
			+ join room, which room they can join
			+ canPulish: allow user to send video, audio ( stream )
			+ canSubscribe: can receive stream from others
		- Convert to JWT token, then return to client
		
	1.2. Check if the previous room still connect, thenn disconnect
	1.3. Initial new room, then connect with the ( server_url, access token )
		--> Captures camera + mic → sends them to LiveKit → viewers receive them
	1.4. Create camera and audio track
		- Create camera track
			+ createLocalVideoTrack: Asks browser for camera permission, creates a video stream track
			+ ({ facingMode: "user" }): Front camera
			+ localParticipant: current user
			+ publishTrack: send media to room
			+ source: Track.Source.Camera: Tells LiveKit: this is camera video
		- Create audio track
			+ createLocalAudioTrack: Requests microphone permission, creates audio stream
			+ publishTrack: send media to room
			+ source: Track.Source.Audio: Tells LiveKit: this is audio video
	1.5. Shared screen: `setScreenShareEnabled`: Starts screen sharing → publishes it to the room → viewers can see your screen
	1.6. Attach camera and share screen to the HTML element
	1.7. Send to everyone in room know that stream is starting


## VIEWER 

2. joinAsViewer ( active when viewer join to the room )
	2.1. Same with 1.1 of host but identity will be viewer-id, not allow to send video, audio, can only watching stream
	2.2. Check old room, create new one, initial an array that store audio track
	2.3. Handle viewer-side logic 
		- `TrackSubscribed`: listen sending media and collect them ( activat when participant publishes a track
and you successfully subscribe to it)
		- Check all track source and attach it to correct ref ( camera, shared screen, audio )
	2.4. Connect to room
	2.5. Loop through all participants → find existing tracks → attach them
		- Return: When component unmounts:
			+ Stop all audio
			+ Remove elements
			+ Prevent memory leaks














