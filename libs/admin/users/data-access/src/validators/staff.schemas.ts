import { z } from 'zod';

import type { StaffRole } from '@admin/users/model';

const staffRoleSchema = z.enum(['Admin', 'Seo', 'Manager'] satisfies StaffRole[]);

/** Runtime shape of a staff account; the mapper receives data that passed this schema. */
export const staffAccountSchema = z.object({
  id: z.string(),
  email: z.string(),
  fullName: z.string(),
  role: staffRoleSchema,
  isBlocked: z.boolean(),
  avatarUrl: z.string().nullish(),
});

/** Runtime shape of an account that can be given staff access. */
export const staffCandidateSchema = z.object({
  id: z.string(),
  email: z.string(),
  fullName: z.string(),
  isCustomer: z.boolean(),
});

/** Runtime shape of the signed-in person's profile. */
export const staffProfileSchema = z.object({
  id: z.string(),
  email: z.string(),
  fullName: z.string(),
  role: staffRoleSchema,
  avatarUrl: z.string().nullish(),
});

export const avatarSchema = z.object({ avatarUrl: z.string() });
