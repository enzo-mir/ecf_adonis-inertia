const adminImageDeleted = async (url: string) => {
  const resp = await fetch("/adminImageDeleted", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Connection: "keep-alive",
      Accept: "*",
    },
    body: JSON.stringify({
      url,
    }),
  });
  return await resp.json();
};

export default adminImageDeleted;
