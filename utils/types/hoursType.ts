import { z } from "zod";

export const HourType = z.array(
  z.object({
    time: z.string().default("lunch" || "dinner"),
    day: z.string().trim(),
    target: z.string()
  })
);
