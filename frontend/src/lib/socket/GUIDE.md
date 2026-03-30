
Host: Send offer to viewers

1. Set up video tag has hostRef and a localStreamrRf for host to save stream
2. Create a function allow opening camera, save stream in localStreamRef and preview stream on hostRef
3. Use useEffect to start the function when access or navigate to that page

` Peer-to-Peer Connection (P2P) : is a way for two devices to talk directly to each other without sending their data through a central server `
E.g: 
    P2P: PC1 ----- PC2
    Normal: PC1 ------- Server ------ PC2 

4. Create a createOffer function ( every viewers get a fresh RTCPeerConnection )
5. Close old connection and create new one for viewer, save all track localStreamRef to new peerConnection

ICE candidate: as a potential "address" where a device can be reached
--> Because no central server so use IP to reach at 
` An ICE (Interactive Connectivity Establishment) candidate is a piece of data that says:  "Hey, you might be able to reach me at this IP address and port." `

6. Send ICE candidate for backend through socket that backend can send back to client later


Viewer: Receive offer --> Send answer --> Play video

7. create a function where viewer can do these:
    - Receive ICE from host
    - Receive offer --> create connection --> receive video and audio tracks --> send back ICE to host
    - Set host's offer 
    - Create answer and send to host