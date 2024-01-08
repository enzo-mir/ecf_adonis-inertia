export const query = async () => {
  return await fetch("/dataApi", {
    method: "POST",
    headers: {
      Connection: "keep-alive",
      Accept: "*",
    },
  }).then((r) => r.json());
};
