import { z } from "zod";

export const UserDbSceama = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  guests: z.number(),
  alergy: z.string(),
  role: z.number().min(0).max(1),
  oldEmail: z.string().optional(),
});
export const CreateUserScheama = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  guests: z.number(),
  alergy: z.string(),
  oldEmail: z.string().optional(),
});
export const updateZodType = z.object({
  name: z.string().refine((value) => /^[a-zA-Z]+$/.test(value), {
    message: "Le champs nom doit contenir uniquement des lettres",
  }),
  email: z.string().email({ message: "email invalide" }),
  password: z
    .string()
    .refine(
      (value) => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(value),
      {
        message:
          "Le mot de passe doit être composé d'une majuscule, minuscule, d'un chiffre et avoir une longueur de 8 charactères",
      }
    )
    .nullable(),
  oldEmail: z.string().email({ message: "email invalide" }),
  guests: z
    .number()
    .min(1, { message: "Le nombre d'invité doit être supérieur à 1" })
    .max(9, { message: "Le nombre d'invité doit être inférieur à 10" }),
  alergy: z
    .string()

    .refine((value) => /^([a-z+A-Z\\,]+[a-z+A-Z])$/gm.test(value) || !value, {
      message: "Syntaxe des alergies : alergie1,alergie2 ...",
    }),
});
export const LoginUserScheama = z.object({
  email: z.string().email(),
  password: z.string(),
});
