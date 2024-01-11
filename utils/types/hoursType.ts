import { z } from "zod";

export const HourType = z.object({
  data: z.array(
    z.object({
      time: z
        .string()
        .trim()
        .refine((val) => val === "lunch" || "dinner", {
          message: "Période de temps non valable",
        }),
      day: z.string().trim(),
      target: z
        .string()
        .refine(
          (val) =>
            /^(fermer)|([0-1][0-9]|2[0-4])h([1-5][0-9]|60|0[1-9]|[1-9]0)? - ([0-1][0-9]|2[0-4])h([1-5][0-9]|60|0[1-9]|[1-9]0)?$/dgim.test(
              val
            ),
          {
            message:
              "Format horaires, exemples : 12h - 15h, 12h30 - 15h10, fermer",
          }
        ),
    })
  ),
});
