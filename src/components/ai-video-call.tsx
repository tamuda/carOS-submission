"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface AIVideoCallProps {
  issueName: string;
  onClose: () => void;
}

const MECHANIC_INSTRUCTIONS = `You are an expert car mechanic providing live video assistance to help fix a car issue.

CURRENT ISSUE: High coolant temperature (105°C - should be 85-95°C)

Your job is to:
1. Guide the user step-by-step through checking and refilling coolant
2. Pretend you can "see" through their camera (they're pointing it at the engine)
3. Give clear, simple instructions one step at a time
4. Ask them to confirm each step before moving to the next
5. Use car mechanic language but explain technical terms simply
6. Be encouraging and patient

REPAIR STEPS TO GUIDE THEM THROUGH:
1. Verify engine is cool (wait 30 min if not)
2. Locate coolant reservoir (translucent tank near radiator)
3. Check fluid level (should have MIN/MAX markings)
4. Test for pressure (gently squeeze tank)
5. Open cap carefully when no pressure
6. Inspect coolant condition (check for rust/oil)
7. Add 50/50 coolant mix to MAX line
8. Replace cap and start engine
9. Monitor temperature (should stabilize at 90-95°C)
10. Check for leaks

IMPORTANT RULES:
- Speak naturally like you're on a phone call
- Keep responses SHORT - 1-2 sentences max per response
- Ask ONE question at a time
- Wait for their response before next instruction
- If they sound unsure, reassure them
- Safety first - always emphasize waiting for engine to cool
- Act like you're looking through the camera: "I can see...", "Point the camera closer to..."

Start by greeting them and asking if the engine is cool to touch.`;

export default function AIVideoCall({ issueName, onClose }: AIVideoCallProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [isHoldingToSpeak, setIsHoldingToSpeak] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const userAnalyzerRef = useRef<AnalyserNode | null>(null);
  const aiAnalyzerRef = useRef<AnalyserNode | null>(null);
  const audioTrackRef = useRef<MediaStreamTrack | null>(null);

  useEffect(() => {
    startVoiceSession();

    return () => {
      cleanup();
    };
  }, []);

  // Handle push-to-talk state - ensure audio is only enabled when holding
  useEffect(() => {
    if (audioTrackRef.current) {
      // Force disable audio if not holding to speak
      audioTrackRef.current.enabled = isHoldingToSpeak;
    }
  }, [isHoldingToSpeak]);

  // Force disable audio when component mounts or when AI is speaking
  useEffect(() => {
    if (audioTrackRef.current && (isAISpeaking || !isHoldingToSpeak)) {
      audioTrackRef.current.enabled = false;
    }
  }, [isAISpeaking, isHoldingToSpeak]);

  // Keyboard support - spacebar to talk
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isAISpeaking && !isHoldingToSpeak) {
        e.preventDefault();
        handleSpeakStart();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" && isHoldingToSpeak) {
        e.preventDefault();
        handleSpeakEnd();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isHoldingToSpeak, isAISpeaking]);

  const cleanup = () => {
    // Force disable audio track before cleanup
    if (audioTrackRef.current) {
      audioTrackRef.current.enabled = false;
    }

    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
  };

  const startVoiceSession = async () => {
    try {
      setIsConnecting(true);

      // Get OpenAI Realtime session
      const sessionResponse = await fetch("/api/openai-session");
      if (!sessionResponse.ok) {
        throw new Error("Failed to get OpenAI session");
      }
      const session = await sessionResponse.json();
      const sessionToken = session.client_secret.value;

      // Create WebRTC peer connection
      const pc = new RTCPeerConnection();
      peerConnectionRef.current = pc;

      // Set up audio element for AI voice
      if (!audioElementRef.current) {
        audioElementRef.current = document.createElement("audio");
      }
      audioElementRef.current.autoplay = true;

      // Handle incoming audio from AI
      pc.ontrack = (event) => {
        if (audioElementRef.current) {
          audioElementRef.current.srcObject = event.streams[0];

          // Set up AI voice activity detection
          const audioCtx = new AudioContext();
          const aiSource = audioCtx.createMediaStreamSource(event.streams[0]);
          const analyser = audioCtx.createAnalyser();
          aiSource.connect(analyser);
          analyser.fftSize = 256;
          aiAnalyzerRef.current = analyser;

          const detectAIVoice = () => {
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(dataArray);
            const average =
              dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
            // Higher threshold for cleaner detection
            setIsAISpeaking(average > 20);
            requestAnimationFrame(detectAIVoice);
          };
          detectAIVoice();
        }
      };

      // Get user microphone and camera
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { facingMode: "environment" }, // Back camera
      });

      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Set up user voice activity detection
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      analyser.smoothingTimeConstant = 0.9; // Higher smoothing (0.9 instead of 0.8) for premium feel
      analyser.fftSize = 1024;
      microphone.connect(analyser);
      userAnalyzerRef.current = analyser;

      // Detect when user is speaking (higher threshold, less sensitive)
      const detectUserVoice = () => {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        const average = array.reduce((a, b) => a + b, 0) / array.length;
        // Higher threshold (30 instead of 15) to ignore background noise
        setIsUserSpeaking(average > 30);
        requestAnimationFrame(detectUserVoice);
      };
      detectUserVoice();

      // Add audio track to peer connection
      const audioTrack = stream.getAudioTracks()[0];
      audioTrackRef.current = audioTrack;

      // Disable audio by default (push-to-talk)
      audioTrack.enabled = false;

      pc.addTrack(audioTrack, stream);

      // Create data channel for events
      const dc = pc.createDataChannel("oai-events");
      dataChannelRef.current = dc;

      dc.onopen = () => {
        console.log("Data channel opened");
        // Send initial instructions with turn_detection disabled for push-to-talk
        dc.send(
          JSON.stringify({
            type: "session.update",
            session: {
              instructions: MECHANIC_INSTRUCTIONS,
              voice: "sage",
              turn_detection: null, // Disable automatic turn detection for manual push-to-talk
              input_audio_transcription: {
                model: "whisper-1",
              },
            },
          })
        );
      };

      dc.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          // Handle transcript updates
          if (
            message.type ===
            "conversation.item.input_audio_transcription.completed"
          ) {
            setTranscript((prev) => [...prev, `You: ${message.transcript}`]);
          }

          if (message.type === "response.done") {
            const text =
              message.response?.output?.[0]?.content?.[0]?.transcript;
            if (text) {
              setTranscript((prev) => [...prev, `AI: ${text}`]);
            }
          }
        } catch (error) {
          console.error("Error parsing data channel message:", error);
        }
      };

      // Create and set offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Send offer to OpenAI
      const sdpResponse = await fetch(
        `https://api.openai.com/v1/realtime?model=gpt-4o-mini-realtime-preview-2024-12-17`,
        {
          method: "POST",
          body: offer.sdp,
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/sdp",
          },
        }
      );

      if (!sdpResponse.ok) {
        throw new Error("Failed to get SDP answer from OpenAI");
      }

      const answer: RTCSessionDescriptionInit = {
        type: "answer",
        sdp: await sdpResponse.text(),
      };
      await pc.setRemoteDescription(answer);

      setIsConnecting(false);
    } catch (error: any) {
      console.error("Error starting voice session:", error);
      setError(error.message);
      setIsConnecting(false);
    }
  };

  const handleSpeakStart = (
    e?: React.MouseEvent | React.TouchEvent | React.PointerEvent
  ) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (audioTrackRef.current && !isAISpeaking) {
      audioTrackRef.current.enabled = true;
      setIsHoldingToSpeak(true);
    }
  };

  const handleSpeakEnd = (
    e?: React.MouseEvent | React.TouchEvent | React.PointerEvent
  ) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Always disable audio track when releasing
    if (audioTrackRef.current) {
      audioTrackRef.current.enabled = false;
    }

    setIsHoldingToSpeak(false);

    // Only trigger AI response if we were actually holding to speak
    if (dataChannelRef.current) {
      dataChannelRef.current.send(
        JSON.stringify({
          type: "input_audio_buffer.commit",
        })
      );
      dataChannelRef.current.send(
        JSON.stringify({
          type: "response.create",
        })
      );
    }
  };

  const handleClose = () => {
    cleanup();
    setIsOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-full max-h-screen h-screen p-0 overflow-hidden border-none [&>button]:hidden select-none"
        style={{
          WebkitUserSelect: "none",
          userSelect: "none",
          WebkitTouchCallout: "none",
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Full Screen Video */}
        <div
          className="relative w-full h-full bg-black select-none"
          style={{
            WebkitUserSelect: "none",
            userSelect: "none",
            WebkitTouchCallout: "none",
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Connection Overlay */}
          {isConnecting && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="text-center">
                <div className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-6" />
                <p className="text-white text-xl font-semibold">
                  Connecting to AI Mechanic
                </p>
                <p className="text-white/50 text-sm mt-2">
                  Setting up video and voice
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90 px-8">
              <div className="glass-card-premium rounded-3xl p-8 max-w-md text-center">
                <svg
                  className="w-16 h-16 text-red-400 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Connection Error
                </h3>
                <p className="text-red-400 mb-4">{error}</p>
                <p className="text-sm text-white/60 mb-6">
                  Make sure you've added your OpenAI API key to .env.local
                </p>
                <Button
                  onClick={handleClose}
                  className="bg-white text-black w-full"
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          {!isConnecting && !error && (
            <>
              {/* Top Bar - Clean & Minimal */}
              <div className="absolute top-0 left-0 right-0 p-6 bg-linear-to-b from-black/70 via-black/30 to-transparent pointer-events-none">
                <div className="flex items-start justify-between pointer-events-auto">
                  {/* Issue Badge */}
                  <div className="glass-card-premium px-5 py-3 rounded-2xl max-w-xs">
                    <p className="text-xs text-white/50 mb-1 uppercase tracking-wider">
                      Diagnosing
                    </p>
                    <p className="text-sm text-white font-medium leading-tight">
                      {issueName}
                    </p>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={handleClose}
                    className="w-11 h-11 rounded-full glass-card-premium flex items-center justify-center hover:bg-white/20 transition-all active:scale-95"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Status Row */}
                <div className="mt-4 flex items-center gap-3 pointer-events-auto">
                  <div className="glass-card-premium px-4 py-2 rounded-full flex items-center gap-2.5">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isAISpeaking ? "bg-green-400" : "bg-white/40"
                      }`}
                      style={{
                        animation: isAISpeaking
                          ? "pulse-subtle 1s ease-in-out infinite"
                          : "none",
                      }}
                    />
                    <span className="text-sm text-white font-medium">
                      {isAISpeaking ? "AI Speaking" : "AI Ready"}
                    </span>
                  </div>

                  {showTranscript && (
                    <button
                      onClick={() => setShowTranscript(false)}
                      className="glass-card-premium px-4 py-2 rounded-full hover:bg-white/10 transition-all flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4 text-white/80"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                      <span className="text-sm text-white/80">Hide</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Expandable Transcript */}
              <AnimatePresence>
                {showTranscript && transcript.length > 0 && (
                  <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="absolute top-36 left-6 right-6 max-h-80 overflow-y-auto glass-card-premium rounded-3xl p-6 pointer-events-auto select-none"
                    style={{
                      WebkitUserSelect: "none",
                      userSelect: "none",
                      WebkitTouchCallout: "none",
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <div className="space-y-3">
                      {transcript.map((message, index) => (
                        <div
                          key={index}
                          className={`text-sm leading-relaxed select-none pointer-events-none ${
                            message.startsWith("You:")
                              ? "text-white/70"
                              : "text-white font-medium"
                          }`}
                          style={{
                            WebkitUserSelect: "none",
                            userSelect: "none",
                            WebkitTouchCallout: "none",
                          }}
                          onContextMenu={(e) => e.preventDefault()}
                        >
                          <span className="text-white/40 text-xs mr-2 select-none">
                            {message.startsWith("You:") ? "YOU" : "AI"}
                          </span>
                          {message.replace("You: ", "").replace("AI: ", "")}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Latest AI Message - Subtitle (when transcript hidden) */}
              <AnimatePresence>
                {!showTranscript &&
                  transcript.length > 0 &&
                  transcript[transcript.length - 1]?.startsWith("AI:") && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      className="absolute bottom-64 left-8 right-8 pointer-events-none"
                    >
                      <div className="glass-card-premium rounded-2xl px-6 py-4 backdrop-blur-2xl select-none">
                        <p className="text-white text-center leading-relaxed font-medium select-none pointer-events-none">
                          {transcript[transcript.length - 1]?.replace(
                            "AI: ",
                            ""
                          )}
                        </p>
                      </div>
                    </motion.div>
                  )}
              </AnimatePresence>

              {/* Bottom Controls - Apple FaceTime Style */}
              <div className="absolute bottom-0 left-0 right-0 pb-12 pt-32 px-8 bg-linear-to-t from-black/90 via-black/60 to-transparent pointer-events-none">
                <div className="max-w-md mx-auto space-y-6 pointer-events-auto">
                  {/* Show Transcript Button (when hidden) */}
                  {!showTranscript && transcript.length > 0 && (
                    <button
                      onClick={() => setShowTranscript(true)}
                      className="w-full glass-card-premium px-4 py-3 rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2 mb-4"
                    >
                      <svg
                        className="w-4 h-4 text-white/80"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                      <span className="text-sm text-white/80 font-medium">
                        View Conversation
                      </span>
                    </button>
                  )}

                  {/* Voice Activity Bars - Smooth & Premium */}
                  {(isHoldingToSpeak || isAISpeaking) && (
                    <motion.div
                      className="flex items-center justify-center gap-2 h-20 mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      {[...Array(7)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={`w-1.5 rounded-full transition-colors duration-300 ${
                            isHoldingToSpeak && isUserSpeaking
                              ? "bg-white"
                              : isAISpeaking
                              ? "bg-green-400"
                              : "bg-white/20"
                          }`}
                          animate={{
                            height:
                              (isHoldingToSpeak && isUserSpeaking) ||
                              isAISpeaking
                                ? [
                                    "12px",
                                    `${16 + i * 4}px`,
                                    "12px",
                                    `${20 + (6 - i) * 3}px`,
                                    "12px",
                                  ]
                                : "12px",
                          }}
                          transition={{
                            duration: 1.2,
                            repeat:
                              (isHoldingToSpeak && isUserSpeaking) ||
                              isAISpeaking
                                ? Infinity
                                : 0,
                            ease: "easeInOut",
                            delay: i * 0.08,
                          }}
                        />
                      ))}
                    </motion.div>
                  )}

                  {/* Push to Talk Button - Premium */}
                  <button
                    onPointerDown={handleSpeakStart}
                    onPointerUp={handleSpeakEnd}
                    onPointerLeave={handleSpeakEnd}
                    onPointerCancel={handleSpeakEnd}
                    onContextMenu={(e) => e.preventDefault()}
                    disabled={isAISpeaking}
                    style={{
                      WebkitUserSelect: "none",
                      userSelect: "none",
                      WebkitTouchCallout: "none",
                      touchAction: "none",
                    }}
                    className={`w-full py-7 rounded-full font-semibold text-base transition-all duration-200 shadow-2xl flex items-center justify-center gap-3 select-none ${
                      isHoldingToSpeak
                        ? "bg-white text-black scale-[0.98]"
                        : isAISpeaking
                        ? "bg-white/10 text-white/40 cursor-not-allowed"
                        : "bg-white text-black hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                  >
                    {/* Microphone Icon */}
                    <svg
                      className={`w-6 h-6 transition-all ${
                        isHoldingToSpeak ? "scale-110" : ""
                      }`}
                      fill={isHoldingToSpeak ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>

                    <span className="pointer-events-none select-none">
                      {isAISpeaking
                        ? "AI is speaking"
                        : isHoldingToSpeak
                        ? "Listening"
                        : "Hold to Speak"}
                    </span>
                  </button>

                  {/* Helper Text */}
                  <p className="text-center text-white/40 text-sm font-medium">
                    {isAISpeaking
                      ? "Release the button and wait..."
                      : "Press & hold • Speak • Release"}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
