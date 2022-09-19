/* eslint-disable consistent-return */
const IMG_SIZE_THRESHOLD = { size: '3000' };
const MSG_MAX_LENGTH = { length: 1000 };

function getMeta(url: string, callback: (meta: ImgMeta) => void) {
  const img = new Image();
  img.src = url;
  img.onload = function () {
    callback({ width: img.width, height: img.height, size: img.sizes });
  };
}

function validateImage(
  img: File,
  next: any,
  onErr?: any,
  config = {
    threshold: { ...IMG_SIZE_THRESHOLD },
  }
) {
  const url = URL.createObjectURL(img);
  getMeta(url, (meta: ImgMeta) => {
    if (
      // TODO: wrong dimension validate
      // meta.width <= config.threshold.width &&
      // meta.height <= config.threshold.height &&
      meta.size <= config.threshold.size
    )
      next(img);
    else alert('img size to large, max 10Mb');
  });
}

function validateFile(content: File, next: any) {
  next(content);
  return true;
}

function validateText(
  content: string,
  next: any,
  onErr?: any,
  config = {
    threshold: { ...MSG_MAX_LENGTH },
  }
) {
  if (content.length <= config.threshold.length) next(content);
  else {
    alert('message not to long');
  }
}

function validateContent(
  content: string | File,
  config: {
    handler: any;
    type: 'file' | 'photo' | 'text';
  }
): boolean | void {
  switch (config.type) {
    case 'file':
      if (content instanceof File) return validateFile(content, config.handler);
      break;
    case 'photo':
      if (content instanceof File)
        return validateImage(content, config.handler);
      break;

    // text
    default:
      if (typeof content === 'string')
        return validateText(content, config.handler);
  }
}

type ImgMeta = {
  size: string;
  width: number;
  height: number;
};

export default validateContent;
