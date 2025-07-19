import { capitalize, toLowerCase } from '@/utils/transformStr';
import { z } from 'zod';

export const createBaseUserSchema = z.object({
  name: z
    .string({
      required_error: 'El campo "Nombre" es obligatorio',
    })
    .min(1)
    .transform(capitalize),
  lastName: z
    .string({
      required_error: 'El campo "Apellido" es obligatorio',
    })
    .min(1)
    .transform(capitalize),
  email: z
    .string({
      required_error: 'El campo "Email" es obligatorio',
    })
    .email()
    .transform(toLowerCase),
  isActive: z.boolean().optional().default(true),
});

/* ADMIN */
export const createFarmanalisisUserSchema = createBaseUserSchema.extend({});

export const updateFarmanalisisUserSchema = createBaseUserSchema.extend({
  id: z.number().min(1),
});

export const getListFarmanalisisUserSchema = z.object({
  q: z.string().optional(),
  isActive: z.boolean().optional(),
  distributorId: z.number().optional(),
  pharmacyId: z.number().optional(),
  roleId: z.union([z.coerce.number(), z.array(z.coerce.number())]).optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export const updateProfileFarmanalisisUserSchema = createBaseUserSchema
  .extend({
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasAny =
      data.currentPassword || data.newPassword || data.confirmPassword;

    if (hasAny) {
      // Validar que todos estén presentes si alguno lo está
      if (!data.currentPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La contraseña actual es requerida.',
          path: ['currentPassword'],
        });
      }

      if (!data.newPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La nueva contraseña es requerida.',
          path: ['newPassword'],
        });
      }

      if (!data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La confirmación de la nueva contraseña es requerida.',
          path: ['confirmPassword'],
        });
      }

      // Si están presentes, validar coincidencia entre newPassword y confirmPassword
      if (
        data.newPassword &&
        data.confirmPassword &&
        data.newPassword !== data.confirmPassword
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La nueva contraseña y su confirmación no coinciden.',
          path: ['confirmPassword'],
        });
      }
    }
  });

export type GetListFarmanalisisUserInput = z.infer<
  typeof getListFarmanalisisUserSchema
>;
export type CreateFarmanalisisUserInput = z.infer<
  typeof createFarmanalisisUserSchema
>;
export type UpdateFarmanalisisUserInput = z.infer<
  typeof updateFarmanalisisUserSchema
>;
export type UpdateProfileFarmanalisisUserInput = z.infer<
  typeof updateProfileFarmanalisisUserSchema
>;
/* END ADMIN */

/* DISTRIBUTORS */
export const createDistributorUserSchema = createBaseUserSchema.extend({
  distributorId: z.number().min(1, {
    message: 'El campo "DistributorId" es obligatorio',
  }),
});

export const updateDistributorUserSchema = createBaseUserSchema.extend({
  distributorId: z.number().min(1, {
    message: 'El campo "DistributorId" es obligatorio',
  }),
  id: z.number().min(1),
});

export type CreateDistributorUserInput = z.infer<
  typeof createDistributorUserSchema
>;
export type UpdateDistributorUserInput = z.infer<
  typeof updateDistributorUserSchema
>;
/* END DISTRIBUTORS */

/* PHARMACY */
export const createPharmacyUserSchema = createBaseUserSchema
  .extend({
    pharmacyId: z.number().min(1, {
      message: 'El campo "PharmacyId" es obligatorio',
    }),
    roleId: z.number().min(1, {
      message: 'El campo "RoleId" es obligatorio',
    }), // role 2: farmacyUser / role 3: sucursal
    branchesIds: z
      .array(z.object({ id: z.number(), name: z.string().optional() }))
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.roleId === 3) {
      // Para role 3, branchesIds debe existir y tener al menos un elemento
      if (!data.branchesIds || data.branchesIds.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'El requerido asignar al menos una sucursal a un usuario',
          path: ['branchesIds'],
        });
      }
    }
  });

export const updatePharmacyUserSchema = createBaseUserSchema
  .extend({
    pharmacyId: z.number().min(1, {
      message: 'El campo "PharmacyId" es obligatorio',
    }),
    roleId: z.number().min(1, {
      message: 'El campo "RoleId" es obligatorio',
    }), // role 2: farmacyUser / role 3: sucursal
    branchesIds: z
      .array(z.object({ id: z.number(), name: z.string().optional() }))
      .optional(),
    id: z.number().min(1),
  })
  .superRefine((data, ctx) => {
    if (data.roleId === 3) {
      // Para role 3, branchesIds debe existir y tener al menos un elemento
      if (!data.branchesIds || data.branchesIds.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'El requerido asignar al menos una sucursal a un usuario',
          path: ['branchesIds'],
        });
      }
    }
  });

export type CreatePharmacyUserInput = z.infer<typeof createPharmacyUserSchema>;
export type UpdatePharmacyUserInput = z.infer<typeof updatePharmacyUserSchema>;
/* END PHARMACY */

/* SELLER */
export const createSellerUserSchema = createBaseUserSchema.extend({
  sellerCode: z.string().min(1),
});

export const updateSellerUserSchema = createBaseUserSchema.extend({
  sellerCode: z.string().min(1),
  id: z.number().min(1),
});

export type CreateSellerUserInput = z.infer<typeof createSellerUserSchema>;
export type UpdateSellerUserInput = z.infer<typeof updateSellerUserSchema>;
/* END SELLER */
