"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Play, Loader2 } from "lucide-react";
import { Icons } from "@/components/icons";

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isNoiseReducing, setIsNoiseReducing] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };
      audioChunks.current = [];
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      setIsPlaying(true);
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      audio.play();
    }
  };

  const stopAudio = () => {
    if (audioUrl) {
      setIsPlaying(false);
      const audio = new Audio(audioUrl);
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const reduceNoise = async () => {
    if (!audioUrl) {
      alert("No audio recorded to reduce noise.");
      return;
    }

    setIsNoiseReducing(true);
    try {
      // TODO: Implement the noise reduction logic using your GenAI flow
      //  const response = await reduceNoiseFlow({ audioUrl });
      //  setAudioUrl(response.reducedNoiseAudioUrl);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert('Noise Reduction Complete!');
    } catch (error) {
      console.error("Error reducing noise:", error);
    } finally {
      setIsNoiseReducing(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
      <h1 className="text-2xl font-semibold mb-4">EchoLink</h1>

      <div className="mb-4">
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isPlaying || isNoiseReducing}
          className={`rounded-full p-6 shadow-md transition-colors duration-300 ${
            isRecording ? "bg-destructive text-background" : "bg-primary text-primary-foreground hover:bg-primary/80"
          }`}
        >
          {isRecording ? <Icons.mic className="h-6 w-6" /> : <Icons.mic className="h-6 w-6" />}
          {isRecording ? "Stop Recording" : "Push to Talk"}
        </Button>
        {isRecording && <p className="mt-2 text-sm text-muted-foreground">Recording...</p>}
      </div>

      {audioUrl && (
        <div className="flex items-center space-x-4">
          <Button
            onClick={isPlaying ? stopAudio : playAudio}
            disabled={isRecording || isNoiseReducing}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md shadow-md"
          >
            {isPlaying ? <Icons.play className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? "Stop" : "Play"}
          </Button>

          <Button
            onClick={reduceNoise}
            disabled={isRecording || isPlaying || isNoiseReducing}
            className="bg-accent text-accent-foreground hover:bg-accent/80 rounded-md shadow-md"
          >
            {isNoiseReducing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reduce Noise"}
          </Button>
        </div>
      )}
    </div>
  );
}


