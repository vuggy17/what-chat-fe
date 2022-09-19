import { v4 as uuidv4 } from 'uuid';

export default function genId(isGroup = false) {
  return isGroup ? `g-${uuidv4()}` : uuidv4();
}
