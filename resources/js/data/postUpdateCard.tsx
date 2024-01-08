export default async function postUpdateCard(
  oldTitle: string,
  oldDesc: string | null,
  cardInfo: { title: string; desc: string; price: number; formula: string },
  choiceEdit: string
) {
  const resp = await fetch("/updateCard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      oldTitle,
      oldDesc,
      cardInfo,
      choiceEdit,
    }),
  });
  return await resp.json();
}
