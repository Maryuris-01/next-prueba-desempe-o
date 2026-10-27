// Clase base: cualquier error que venga "de la API" (con o sin código HTTP conocido).
export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// El fetch nunca llegó al servidor: backend caído, sin internet, CORS, etc.
export class NetworkError extends ApiError {
  constructor(
    message = 'No se pudo conectar con el servidor. Verifica tu conexión o que el backend esté corriendo.',
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

// 400: el body enviado no pasó las validaciones del backend.
export class ValidationError extends ApiError {
  fieldErrors?: string[];

  constructor(message = 'Los datos enviados no son válidos.', fieldErrors?: string[]) {
    super(message, 400);
    this.name = 'ValidationError';
    this.fieldErrors = fieldErrors;
  }
}

// 401 / 403: no autenticado o sin permisos para la acción.
export class AuthError extends ApiError {
  constructor(message = 'No estás autorizado para realizar esta acción.', status = 401) {
    super(message, status);
    this.name = 'AuthError';
  }
}

// 404: el recurso no existe.
export class NotFoundError extends ApiError {
  constructor(message = 'El recurso solicitado no existe.') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

// 409: conflicto (ej. favorito duplicado, email ya registrado).
export class ConflictError extends ApiError {
  constructor(message = 'Ya existe un recurso en conflicto con esta acción.') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}