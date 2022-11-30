import { ImageBubbleProps, MessageBubbleProps } from './type';

export function extractImageBubbleProps(
  props: MessageBubbleProps
): ImageBubbleProps {
  const { attachments, attachmentsMeta, text, ...rest } = props;
  return {
    attachments,
    attachmentsMeta,
    description: text,
    ...rest,
  };
}

export function foo() {}
