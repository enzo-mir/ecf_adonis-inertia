import { HourToSend } from "../types/dataApiTypes";

export default async function adminHoursPost(dataHours: Array<HourToSend>) {
  return fetch("/adminHours", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      data: dataHours,
    }),
  }).then((resp) => resp.json());
}
