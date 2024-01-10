import { z } from "zod";
export const signinType = z
  .object({
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
      ),
    confirmPassword: z.string(),
    guests: z
      .number()
      .min(1, { message: "Le nombre d'invité doit être supérieur à 1" })
      .max(9, { message: "Le nombre d'invité doit être inférieur à 10" }),
    alergy: z
      .string()
      .refine((value) => /^([a-z+A-Z\\,]+[a-z+A-Z])$/gm.test(value) || !value, {
        message: "Syntaxe des alergies : alergie1,alergie2 ...",
      }),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "La confirmation du mot de passe ne correspond pas",
      path: ["confirmPassword"],
    }
  );

export type FormDataSignin = z.infer<typeof signinType>;

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
export type UpdatedFormDataType = z.infer<typeof updateZodType>;

export const LoginDataType = z.object({
  email: z.string().email({ message: "Veuillez entrer un email valid" }),
  password: z.string({ invalid_type_error: "Une erreur est survenus" }),
});
