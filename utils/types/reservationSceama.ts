import { z } from "zod";

export const ReservationSheama = z.array(
  z.object({
    guests: z.number(),
    date: z.string(),
    email: z.string(),
    name: z.string(),
    hours: z.string(),
    alergy: z.string(),
    timeJourney: z.string(),
  })
);
export const ReservationFromBodySheama = z.object({
  guests: z.number(),
  date: z.string(),
  email: z.string(),
  name: z.string(),
  hours: z.string(),
  alergy: z.string(),
  timeJourney: z.string(),
});
export const DeleteReservationScheama = z.object({
  guests: z.number(),
  date: z.string(),
  email: z.string(),
  hours: z.string(),
});

export const UserDataReservation = z.array(DeleteReservationScheama);
