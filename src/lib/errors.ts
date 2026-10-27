export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL_ERROR';

export class ApiError extends Error {
  readonly status: number;
  readonly code: ErrorCode;
  readonly details?: Record<string, string[]>;

  constructor(status: number, code: ErrorCode, message: string, details?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'Los datos enviados no son válidos.', details?: Record<string, string[]>) {
    super(400, 'VALIDATION_ERROR', message, details);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'No autenticado.') {
    super(401, 'UNAUTHORIZED', message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'No autorizado para realizar esta acción.') {
    super(403, 'FORBIDDEN', message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'El recurso solicitado no existe.') {
    super(404, 'NOT_FOUND', message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Ya existe un recurso en conflicto con esta acción.') {
    super(409, 'CONFLICT', message);
    this.name = 'ConflictError';
  }
}