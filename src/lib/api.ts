import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { ApiError } from './errors';

export type RouteContext = { params: Promise<Record<string, string>> };

type Handler = (req: NextRequest, ctx: RouteContext) => Promise<NextResponse>;

export function jsonOk<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function jsonError(
  code: string,
  message: string,
  status: number,
  details?: Record<string, string[]>,
): NextResponse {
  return NextResponse.json(
    { error: { code, message, ...(details ? { details } : {}) } },
    { status },
  );
}

export function withErrorHandler(handler: Handler): Handler {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (error) {
      if (error instanceof ApiError) {
        return jsonError(error.code, error.message, error.status, error.details);
      }
      if (error instanceof ZodError) {
        return jsonError(
          'VALIDATION_ERROR',
          'Datos inválidos',
          400,
          error.flatten().fieldErrors as Record<string, string[]>,
        );
      }
      console.error('[UNHANDLED ERROR]', error);
      return jsonError('INTERNAL_ERROR', 'Error interno del servidor', 500);
    }
  };
}