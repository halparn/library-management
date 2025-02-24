interface ValidationErrorDetails {
  field?: string;
  value?: any;
}

export class ValidationError extends Error {
  details?: ValidationErrorDetails;

  constructor(message: string, details?: ValidationErrorDetails) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}