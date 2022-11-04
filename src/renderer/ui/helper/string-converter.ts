export function parseStatus(status: 'sending' | 'sent_error' | undefined) {
  console.log('parseStatus', status);
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
  status: 'sending' | 'sent_error' | undefined;
  typing: boolean;
}) {
  if (typing) return 'Typing...';
  if (status) return parseStatus(status);
  return preview;
}

export function parseParticipantToChatName(participants: string[]): string {
  if (participants.length === 1) {
    return participants[0];
  }
  return participants.map((p) => p).join(', ');
}
