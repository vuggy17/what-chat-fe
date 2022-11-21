export function parseStatus(
  status: 'sending' | 'sent_error' | 'idle' | undefined
) {
  switch (status) {
    case 'sending':
      return 'Sending...';
    case 'sent_error':
      return 'Failed to send';
    default:
      return '';
  }
}

export function parseDescription({
  preview,
  status,
  typing,
}: {
  preview: string;
  status: 'sending' | 'sent_error' | 'idle' | undefined;
  typing: boolean;
}) {
  if (typing) return 'Typing...';
  if (status !== 'idle') return parseStatus(status);
  return preview;
}

export function parseParticipantToChatName(participants: string[]): string {
  if (participants.length === 1) {
    return participants[0];
  }
  return participants.map((p) => p).join(', ');
}

export function parseMessageToPreviewText(message: string | File): string {
  if (typeof message === 'string') return message;
  return message.name;
}
