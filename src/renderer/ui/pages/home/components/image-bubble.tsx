/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable promise/always-return */
import React, { useEffect, useState } from 'react';
import messageController from 'renderer/controllers/message.controller';
// eslint-disable-next-line import/no-cycle
import { MessageBubbleProps } from './chat-bubble';

type ImageBubbleProps = MessageBubbleProps & {
  uploaded: boolean;
  chatId: Id;
  id: Id;
  type: MessageType;
};

export default function ImageBubble({ ...props }: ImageBubbleProps) {
  const [uploadStatus, setUploadStatus] = useState(0);
  const msgId = `msg-${Math.random()}`;

  // if (props.uploaded) {
  //   return (
  //     <div className="w-auto h-[300px] overflow-hidden ">
  //       <img src={props.path} alt="img" className="w-auto h-[300px]" />
  //     </div>
  //   );
  // }

  // upload file then notify controller that file is ready to send
  useEffect(() => {
    // check if file upload is in progress

    if (!props.uploaded) {
      console.log('uploading image');

      const uploadProgress = messageController.getUploadProgress(props.id);
      if (uploadProgress) {
        setUploadStatus(uploadProgress.percentage);
        return;
      }

      messageController
        .uploadFile(props.content, {
          chatId: props.chatId,
          id: props.id,
          type: 'photo',
        })
        .then((res) => {
          if (res) {
            console.info(res);
            messageController.notifyFileReady(res.id, res.path); // mark file as uploaded, and replace its path with the remote path
            // messageController.sendMessage(res, {
            //   type: 'photo',
            //   chatId: props.chatId,
            // });
          }
        })
        .catch((err) => console.error('Error on loading bubble image', err));
    }
  }, []);

  return (
    <div className="w-auto h-[300px] overflow-hidden ">
      {props.uploaded ? 'Image updated' : 'Image not updated'}
      <img src={props.path} alt="img" className="w-auto h-[300px]" />
    </div>
  );
}
