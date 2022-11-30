import { Message, TextMessage } from 'renderer/domain';

interface Handler {
  setNext(handler: Handler): Handler;

  handle(request: Message): Promise<Message> | any; // return null if it left untouched by any handler
}

/**
 * The default chaining behavior can be implemented inside a base handler class.
 */
export default abstract class AbstractHandler implements Handler {
  private nextHandler?: Handler;

  handle(request: Message): Promise<any> | any {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }

    return null;
  }

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    // Returning a handler from here will let us link handlers in a
    // convenient way like this:
    // monkey.setNext(squirrel).setNext(dog);
    return handler;
  }
}
