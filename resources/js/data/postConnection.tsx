export default async function postConnection<T>(
  email: string,
  password: string
) {
  const postAccount: Promise<T> = fetch("/authLogin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  }).then((res) => res.json());

  return postAccount;
}
