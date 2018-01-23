export class DetailedError extends Error {
  public details: any;

  constructor({ message, details} ) {
    super(message)
    this.details = details
  }
}
