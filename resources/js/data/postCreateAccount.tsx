import { FormDataSignin } from "../types/userManagmentType";

export default async function postCreateAccount(signinData: FormDataSignin) {
  const postAccount = fetch("/createAccount", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      name: signinData.name,
      email: signinData.email,
      password: signinData.password,
      guests: signinData.guests,
      alergy: signinData.alergy,
    }),
  });

  return postAccount;
}
