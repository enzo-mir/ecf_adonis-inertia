import { z } from "zod";

export const adminEditImageType = z.object({

  title: z.string(),
  description: z.string(),
  add: z.boolean(),
});
