import { Message, TextMessage } from 'renderer/domain';

interface Handler<Input, Output> {
  setNext(handler: Handler<Input, Output>): Handler<Input, Output>;

  handle(request: Input): Promise<Output> | any; // return null if it left untouched by any handler
}

/**
 * The default chaining behavior can be implemented inside a base handler class.
 */
export default abstract class AbstractHandler<I, O> implements Handler<I, O> {
  private nextHandler?: Handler<I, O>;

  handle(request: I): Promise<O> | any {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }

    return null;
  }

  public setNext(handler: Handler<I, O>): Handler<I, O> {
    this.nextHandler = handler;
    // Returning a handler from here will let us link handlers in a
    // convenient way like this:
    // monkey.setNext(squirrel).setNext(dog);
    return handler;
  }
}
