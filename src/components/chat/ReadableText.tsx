interface ReadableTextProps {
  text: string;
  isSpeaking: boolean;
  highlightedCharIndex?: number | null;
  highlightedCharLength?: number | null;
  speakingMessageId?: string | null;
  messageId: string;
}

function getActiveRange(text: string, index: number | null | undefined, length?: number | null) {
  if (index === null || index === undefined || index < 0 || index >= text.length) {
    return { start: 0, end: text.length };
  }

  if (length && length > 0) {
    return {
      start: index,
      end: Math.min(index + length, text.length),
    };
  }

  let start = index;
  let end = index;

  while (start > 0 && /\S/.test(text[start - 1])) {
    start -= 1;
  }

  while (end < text.length && /\S/.test(text[end])) {
    end += 1;
  }

  if (start === end) {
    end = Math.min(index + 1, text.length);
  }

  return { start, end };
}

function PlainParagraphs({ text }: { text: string }) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <div className="space-y-3">
      {(paragraphs.length > 0 ? paragraphs : [text]).map((paragraph, index) => (
        <p
          key={`${paragraph.slice(0, 18)}-${index}`}
          className="text-sm leading-7 text-ink sm:text-base"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function ReadableText({
  text,
  isSpeaking,
  highlightedCharIndex,
  highlightedCharLength,
  speakingMessageId,
  messageId,
}: ReadableTextProps) {
  const active = isSpeaking && speakingMessageId === messageId;

  if (!active) {
    return <PlainParagraphs text={text} />;
  }

  const { start, end } = getActiveRange(text, highlightedCharIndex, highlightedCharLength);
  const before = text.slice(0, start);
  const current = text.slice(start, end);
  const after = text.slice(end);

  return (
    <p className="whitespace-pre-wrap text-sm leading-7 text-ink sm:text-base">
      <span className={highlightedCharIndex === null ? "reading-muted" : undefined}>
        {before}
      </span>
      <span className="reading-highlight">{current || text}</span>
      <span className={highlightedCharIndex === null ? "reading-muted" : undefined}>
        {after}
      </span>
    </p>
  );
}
