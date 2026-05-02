import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface SpeakMessageOptions {
  rate?: number;
  lang?: string;
}

interface SentenceRange {
  start: number;
  length: number;
}

function getSentenceRanges(text: string): SentenceRange[] {
  const ranges: SentenceRange[] = [];
  const pattern = /[^.!?\n]+[.!?]+|\S[^\n]*/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const sentence = match[0];
    if (sentence.trim()) {
      ranges.push({
        start: match.index,
        length: sentence.length,
      });
    }
  }

  return ranges.length > 0 ? ranges : [{ start: 0, length: text.length }];
}

export function useSpeechReader() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);
  const boundarySeenRef = useRef(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [highlightedCharIndex, setHighlightedCharIndex] = useState<number | null>(null);
  const [highlightedCharLength, setHighlightedCharLength] = useState<number | null>(null);
  const [highlightedSentenceIndex, setHighlightedSentenceIndex] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const canSpeak = useMemo(
    () => typeof window !== "undefined" && "speechSynthesis" in window,
    [],
  );

  const clearFallbackTimer = useCallback(() => {
    if (fallbackTimerRef.current !== null) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  }, []);

  const resetHighlight = useCallback(() => {
    setSpeakingMessageId(null);
    setHighlightedCharIndex(null);
    setHighlightedCharLength(null);
    setHighlightedSentenceIndex(null);
    setIsSpeaking(false);
    boundarySeenRef.current = false;
    utteranceRef.current = null;
    clearFallbackTimer();
  }, [clearFallbackTimer]);

  const stopSpeaking = useCallback(() => {
    clearFallbackTimer();

    if (canSpeak) {
      window.speechSynthesis.cancel();
    }

    resetHighlight();
  }, [canSpeak, clearFallbackTimer, resetHighlight]);

  const startSentenceFallback = useCallback(
    (text: string, rate: number) => {
      const ranges = getSentenceRanges(text);
      let index = 0;

      const advance = () => {
        if (boundarySeenRef.current || !ranges[index]) {
          clearFallbackTimer();
          return;
        }

        const current = ranges[index];
        setHighlightedSentenceIndex(index);
        setHighlightedCharIndex(current.start);
        setHighlightedCharLength(current.length);

        const estimatedDuration = Math.min(
          Math.max((current.length * 48) / Math.max(rate, 0.6), 900),
          3200,
        );

        fallbackTimerRef.current = window.setTimeout(() => {
          index += 1;
          if (index < ranges.length) {
            advance();
          }
        }, estimatedDuration);
      };

      fallbackTimerRef.current = window.setTimeout(() => {
        if (!boundarySeenRef.current) {
          advance();
        }
      }, 700);
    },
    [clearFallbackTimer],
  );

  const speakMessage = useCallback(
    (messageId: string, text: string, options: SpeakMessageOptions = {}) => {
      const cleanText = text.trim();

      if (!cleanText) {
        return false;
      }

      if (!canSpeak) {
        setSpeechError("Read-aloud is not supported in this browser.");
        return false;
      }

      stopSpeaking();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const rate = options.rate ?? 1;
      utterance.rate = rate;
      if (options.lang) {
        utterance.lang = options.lang;
      }

      utteranceRef.current = utterance;
      boundarySeenRef.current = false;
      setSpeechError(null);
      setSpeakingMessageId(messageId);
      setHighlightedCharIndex(0);
      setHighlightedCharLength(null);
      setHighlightedSentenceIndex(null);
      setIsSpeaking(true);

      utterance.onstart = () => {
        if (utteranceRef.current !== utterance) {
          return;
        }

        setSpeakingMessageId(messageId);
        setIsSpeaking(true);
        startSentenceFallback(cleanText, rate);
      };

      utterance.onboundary = (event) => {
        if (utteranceRef.current !== utterance) {
          return;
        }

        const boundaryEvent = event as SpeechSynthesisEvent & { charLength?: number };
        if (typeof boundaryEvent.charIndex !== "number") {
          return;
        }

        boundarySeenRef.current = true;
        clearFallbackTimer();
        setHighlightedCharIndex(boundaryEvent.charIndex);
        setHighlightedCharLength(
          typeof boundaryEvent.charLength === "number" && boundaryEvent.charLength > 0
            ? boundaryEvent.charLength
            : null,
        );
      };

      utterance.onend = () => {
        if (utteranceRef.current !== utterance) {
          return;
        }

        resetHighlight();
      };

      utterance.onerror = () => {
        if (utteranceRef.current !== utterance) {
          return;
        }

        setSpeechError("The browser could not read this answer aloud.");
        resetHighlight();
      };

      try {
        window.speechSynthesis.speak(utterance);
        return true;
      } catch {
        setSpeechError("Read-aloud could not start in this browser.");
        resetHighlight();
        return false;
      }
    },
    [canSpeak, clearFallbackTimer, resetHighlight, startSentenceFallback, stopSpeaking],
  );

  useEffect(
    () => () => {
      stopSpeaking();
    },
    [stopSpeaking],
  );

  return {
    canSpeak,
    speakMessage,
    stopSpeaking,
    speakingMessageId,
    highlightedCharIndex,
    highlightedCharLength,
    highlightedWordIndex: null,
    highlightedSentenceIndex,
    isSpeaking,
    isPaused: false,
    speechError,
  };
}
