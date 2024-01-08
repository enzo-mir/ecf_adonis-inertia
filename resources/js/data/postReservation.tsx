const postReservation = (guests: number, date: string, email: string, name: string, hours: string, alergy: string, timeJourney: string) => {
  return fetch("/reservation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Connection: "keep-alive",
      Accept: "*",
    },
    body: JSON.stringify({
      guests,
      date,
      email,
      name,
      hours,
      alergy,
      timeJourney,
    }),
  }).then((response) => response.json());
};

export default postReservation;
