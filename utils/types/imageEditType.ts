import { z } from "zod";
const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png", "svg"];
export const imagesAddType = z.object({
  image: z
    .any()
    .refine((files) => files?.size <= 500000, {
      message: "Limite de taille : 500 Ko",
    })
    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.subtype), {
      message: "Les formats accéptés : .jpg, .jpeg, .png and .svg",
    }),
  title: z.string().trim(),
  description: z.string().trim(),
});

export const imagesUpdateType = imagesAddType
  .extend({
    old_url: z.string(),
  })
  .partial({
    image: true,
  });
