"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { HeartPulse, Loader, Mic, Square } from "lucide-react";
import { analyzeVocalTone } from "@/ai/flows/analyze-vocal-tone-gemini";
import { generateCalmingInsight } from "@/ai/flows/generate-calming-insight";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type CustomSpeechRecognition = new () => SpeechRecognition;

export default function AuraCalmPage() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stressLevel, setStressLevel] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [events, setEvents] = useState<string[]>([]);
  const [isStressedState, setIsStressedState] = useState(false);
  
  const { toast } = useToast();

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isMonitoringRef = useRef(isMonitoring);

  useEffect(() => {
    isMonitoringRef.current = isMonitoring;
  }, [isMonitoring]);

  const addEvent = useCallback((message: string) => {
    setEvents((prevEvents) => [
      `${new Date().toLocaleTimeString()}: ${message}`,
      ...prevEvents,
    ].slice(0, 5));
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      addEvent("Speech Recognition API not supported in this browser.");
      toast({
        title: "Browser Not Supported",
        description: "Please use Google Chrome for the best experience.",
        variant: "destructive",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      if (transcript) {
        addEvent(`Heard: "${transcript}"`);
        processTranscription(transcript);
      }
    };

    recognition.onerror = (event) => {
      addEvent(`Speech recognition error: ${event.error}`);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        toast({
          title: "Microphone Access Denied",
          description: "Please grant microphone access to use this feature.",
          variant: "destructive",
        });
        setIsMonitoring(false);
      }
    };
    
    recognition.onend = () => {
      if (isMonitoringRef.current) {
        recognitionRef.current?.start();
      }
    };

    return () => {
      recognitionRef.current?.stop();
    };
  }, [addEvent, toast]);

  const triggerIntervention = useCallback(() => {
    addEvent("High stress detected. Triggering calming intervention.");
    setIsStressedState(true);

    if (navigator.vibrate) {
      navigator.vibrate([500, 200, 500]);
    }
  }, [addEvent]);

  const processTranscription = async (text: string) => {
    setIsProcessing(true);
    addEvent("Analyzing tone...");
    
    try {
      const result = await analyzeVocalTone({ transcribedText: text });
      addEvent("Analysis complete.");
      setStressLevel(result.stressScore);
      setFeedback(result.feedback);

      if (result.stressScore > 70) {
        triggerIntervention();
        addEvent("Generating personalized insight...");
        try {
          const insightResult = await generateCalmingInsight({
            transcribedText: text,
            stressScore: result.stressScore,
          });
          setFeedback(insightResult.calmingInsight);
          addEvent("Insight received.");
        } catch (insightError) {
          console.error("Calming Insight Error:", insightError);
          addEvent("Could not generate personalized insight.");
        }
      } else {
        setIsStressedState(false);
      }

    } catch (error) {
      console.error("AI Analysis Error:", error);
      addEvent("AI analysis failed.");
      toast({
        title: "Analysis Error",
        description: "Could not analyze the audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartStop = () => {
    if (isMonitoring) {
      setIsMonitoring(false);
      recognitionRef.current?.stop();
      addEvent("Monitoring stopped.");
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setIsMonitoring(true);
          setStressLevel(null);
          setFeedback("");
          setEvents([]);
          setIsStressedState(false);
          addEvent("Monitoring started. Please speak.");
          recognitionRef.current?.start();
        })
        .catch(() => {
          toast({
            title: "Microphone Access Required",
            description: "Please grant microphone access in your browser settings to begin.",
            variant: "destructive",
          });
        });
    }
  };

  const visualizerSize = 150 + (stressLevel || 0) * 1.5;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 md:p-8 font-body">
      <Card className="w-full max-w-2xl shadow-2xl rounded-2xl overflow-hidden bg-card">
        <CardHeader className="text-center p-6">
          <div className="flex items-center justify-center gap-3">
            <HeartPulse className="w-8 h-8 text-primary" />
            <CardTitle className="text-4xl font-bold tracking-tight text-card-foreground">AuraCalm</CardTitle>
          </div>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Your personal AI-powered guide to tranquility.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-8 px-6 sm:px-10 flex flex-col items-center gap-8">
          <div
            className={cn(
              "relative flex items-center justify-center rounded-full transition-all duration-500 ease-in-out",
              isStressedState ? 'bg-destructive/20 animate-pulse-stressed' : 'bg-primary/50 animate-pulse-calm'
            )}
            style={{ width: `${visualizerSize}px`, height: `${visualizerSize}px` }}
          >
             <div className="absolute inset-2 rounded-full bg-card flex items-center justify-center">
              <span className="relative text-5xl font-extrabold text-foreground opacity-80">
                {stressLevel !== null ? `${Math.round(stressLevel)}%` : '--'}
              </span>
             </div>
          </div>

          <div className="text-center h-16 w-full max-w-lg">
            <p className="font-semibold text-lg text-foreground">AI Insight</p>
            <p className="text-muted-foreground min-h-[2.5rem] transition-opacity duration-300 px-4">
              {isProcessing && !feedback ? <span className="italic">Analyzing...</span> : feedback || "Waiting for input..."}
            </p>
          </div>

          <Button
            onClick={handleStartStop}
            disabled={isProcessing}
            size="lg"
            className="w-full max-w-xs rounded-full text-lg font-semibold py-7 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-100"
            variant={isMonitoring ? "destructive" : "default"}
          >
            {isProcessing ? (
              <>
                <Loader className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : isMonitoring ? (
              <>
                <Square className="mr-2 h-5 w-5" />
                Stop Monitoring
              </>
            ) : (
              <>
                <Mic className="mr-2 h-5 w-5" />
                Start Monitoring
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter className="bg-muted/30 p-4 border-t">
          <div className="w-full">
            <h4 className="font-semibold mb-2 text-center text-sm text-muted-foreground">Event Log</h4>
            <div className="text-xs text-muted-foreground space-y-1 h-24 overflow-y-auto px-2 text-center font-mono">
              {events.length > 0 ? (
                events.map((event, index) => <p key={index}>{event}</p>)
              ) : (
                <p className="italic pt-8">Click "Start Monitoring" to begin.</p>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
      <footer className="text-center mt-8 text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} AuraCalm </p>
        <p>AI for a calmer you</p>
        <p>Designed by Rudraksh Tripathi</p>
      </footer>
    </div>
  );
}
