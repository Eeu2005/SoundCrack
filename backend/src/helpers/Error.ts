export class ErrorStatus extends Error {
  message: string;
  statusCode?: number | undefined;

  constructor(message: string, statusCode: number = 500) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}
