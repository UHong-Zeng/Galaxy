import *  as z from 'zod';

export const UserLocationValidation = z.object({
  target: z.string().min(3, {
    message: "Must be at least 2 characters.",
  }).max(50),
})