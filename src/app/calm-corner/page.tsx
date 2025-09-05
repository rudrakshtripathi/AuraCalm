"use client";

import { useState, useRef } from "react";
import { Headphones, Wind, Pause, Play, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const guidelines = [
    "Take a few deep breaths, inhaling through your nose and exhaling slowly through your mouth.",
    "Gently stretch your neck and shoulders to release physical tension.",
    "Focus on a positive memory or a place where you feel completely at peace.",
    "Listen to the calming music and allow your mind to drift.",
    "Practice mindfulness by noticing the sensations around you without judgment."
];

export default function CalmCornerPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 md:p-8 font-body">
       <audio ref={audioRef} src="/soothing-music.mp3" loop onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
      <Card className="w-full max-w-2xl shadow-2xl rounded-2xl overflow-hidden bg-card relative">
        <Link href="/" className="absolute top-4 left-4">
            <Button variant="ghost" size="icon">
                <ArrowLeft className="w-6 h-6 text-muted-foreground" />
            </Button>
        </Link>
        <CardHeader className="text-center p-6">
          <div className="flex items-center justify-center gap-3">
            <Wind className="w-8 h-8 text-primary" />
            <CardTitle className="text-4xl font-bold tracking-tight text-card-foreground">
              Calm Corner
            </CardTitle>
          </div>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Your personal space for tranquility and relaxation.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-8 px-6 sm:px-10 flex flex-col items-center gap-8">
          <div
            className={cn(
              "relative flex items-center justify-center rounded-full transition-all duration-500 ease-in-out",
              "bg-primary/50 animate-pulse-calm"
            )}
            style={{ width: `250px`, height: `250px` }}
          >
            <div className="absolute inset-2 rounded-full bg-card flex items-center justify-center">
                <Headphones className="w-20 h-20 text-foreground opacity-20" />
            </div>
          </div>

          <Button
            onClick={toggleMusic}
            size="lg"
            className="w-full max-w-xs rounded-full text-lg font-semibold py-7 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-100"
          >
            {isPlaying ? (
                <>
                    <Pause className="mr-2 h-5 w-5" />
                    Pause Music
                </>
            ) : (
                <>
                    <Play className="mr-2 h-5 w-5" />
                    Play Music
                </>
            )}
          </Button>

          <div className="w-full max-w-lg text-center">
            <h3 className="font-semibold text-lg text-foreground mb-2">
              Mindfulness Tips
            </h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 text-left">
                {guidelines.map((tip, index) => <li key={index}>{tip}</li>)}
            </ul>
          </div>
        </CardContent>
      </Card>
       <footer className="text-center mt-8 text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} AuraCalm </p>
        <p>AI for a calmer you</p>
      </footer>
    </div>
  );
}
