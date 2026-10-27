import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(80),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').max(72),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export const createSpaceSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(100),
  description: z.string().min(1, 'La descripción es obligatoria').max(500),
  price: z.number().positive('El precio debe ser positivo'),
  image: z.string().url('URL inválida').optional(),
});

export const updateSpaceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(500).optional(),
  price: z.number().positive().optional(),
  image: z.string().url().optional(),
});

export const createReservationSchema = z.object({
  spaceId: z.string().min(1, 'El espacio es obligatorio'),
  startAt: z.string().datetime('Fecha inválida'),
  hours: z.number().int().min(1).max(4),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateSpaceInput = z.infer<typeof createSpaceSchema>;
export type UpdateSpaceInput = z.infer<typeof updateSpaceSchema>;