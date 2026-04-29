import { useCallback, useMemo, useRef, useState } from "react";

interface SpeechRecognitionResultLike {
  readonly transcript: string;
}

interface SpeechRecognitionAlternativeLike {
  readonly 0: SpeechRecognitionResultLike;
}

interface SpeechRecognitionResultListLike {
  readonly 0: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  readonly results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionErrorLike {
  readonly error?: string;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type SpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

function getRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") {
    return null;
  }

  const speechWindow = window as SpeechWindow;
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

export function useSpeech() {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const canSpeak = useMemo(
    () => typeof window !== "undefined" && "speechSynthesis" in window,
    [],
  );
  const canListen = useMemo(() => getRecognitionConstructor() !== null, []);

  const stopSpeaking = useCallback(() => {
    if (!canSpeak) {
      return;
    }

    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [canSpeak]);

  const speak = useCallback(
    (text: string, options: { rate?: number; lang?: string } = {}) => {
      if (!text.trim()) {
        return false;
      }

      if (!canSpeak) {
        setSpeechError("Read-aloud is not supported in this browser.");
        return false;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate ?? 1;
      if (options.lang) {
        utterance.lang = options.lang;
      }
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        setSpeechError("The browser could not read this text aloud.");
      };

      setSpeechError(null);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
      return true;
    },
    [canSpeak],
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  const startListening = useCallback(
    (onTranscript: (transcript: string) => void, options: { lang?: string } = {}) => {
      const Recognition = getRecognitionConstructor();
      if (!Recognition) {
        setSpeechError("Microphone input is not supported in this browser.");
        return false;
      }

      recognitionRef.current?.stop();
      const recognition = new Recognition();
      recognitionRef.current = recognition;
      recognition.lang = options.lang ?? "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onstart = () => {
        setSpeechError(null);
        setIsListening(true);
      };
      recognition.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript ?? "";
        if (transcript.trim()) {
          onTranscript(transcript.trim());
        }
      };
      recognition.onerror = (event) => {
        setSpeechError(
          event.error === "not-allowed"
            ? "Microphone permission was blocked. Allow microphone access and try again."
            : "The browser could not capture speech input.",
        );
      };
      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      try {
        recognition.start();
        return true;
      } catch {
        setIsListening(false);
        setSpeechError("Microphone input could not start. Please try again.");
        return false;
      }
    },
    [],
  );

  return {
    canSpeak,
    canListen,
    isSpeaking,
    isListening,
    speechError,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
  };
}
