/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable promise/always-return */
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-cycle
import { MessageBubbleProps } from './chat-bubble';
import { CircleChecked, CircleDashed } from './icons';

interface ImageBubbleProps
  extends MessageBubbleProps,
    React.HTMLAttributes<HTMLDivElement> {
  uploaded: boolean;
  chatId: Id;
  id: Id;
  type: MessageType;
}

export default function ImageBubble({ ...props }: ImageBubbleProps) {
  const [uploadStatus, setUploadStatus] = useState(0);

  // upload file then notify controller that file is ready to send
  useEffect(() => {
    // check if file upload is in progress

    if (!props.uploaded) {
      console.log('uploading image');

      // const uploadProgress = messageController.getUploadProgress(props.id);
      // if (uploadProgress) {
      //   setUploadStatus(uploadProgress.percentage);
      //   return;
      // }

      // messageController
      //   .uploadFile(props.content, {
      //     chatId: props.chatId,
      //     id: props.id,
      //     type: 'photo',
      //   })
      //   .then((res) => {
      //     if (res) {
      //       console.info(res);
      //       messageController.notifyFileReady(res.id, res.path); // mark file as uploaded, and replace its path with the remote path
      //       // messageController.sendMessage(res, {
      //       //   type: 'photo',
      //       //   chatId: props.chatId,
      //       // });
      //     }
      //   })
      //   .catch((err) => console.error('Error on loading bubble image', err));
    }
  }, []);

  return (
    <div
      {...props}
      className="w-auto h-[300px] overflow-hidden flex"
      style={{ flexDirection: props.self ? 'row-reverse' : 'inherit' }}
    >
      {props.self && (
        <div className="h-full flex items-end">
          {props.uploaded ? <CircleChecked /> : <CircleDashed />}
        </div>
      )}
      <img src={props.path} alt="img" className="w-auto h-[300px]" />
    </div>
  );
}
