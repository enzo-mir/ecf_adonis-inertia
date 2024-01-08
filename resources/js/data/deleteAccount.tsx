export default function deleteAccount(email: string) {
  return fetch("/deleteAccount", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Connection: "keep-alive",
      Accept: "*",
    },
    body: JSON.stringify({
      email,
    }),
  });
}
