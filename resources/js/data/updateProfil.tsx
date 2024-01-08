import { UpdatedFormDataType } from "../types/userManagmentType";

export default async function updateProfil(userInfo: UpdatedFormDataType) {
  const postUpdateAccount = fetch("/updateAccount", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      name: userInfo.name,
      email: userInfo.email,
      password: userInfo.password,
      guests: userInfo.guests,
      alergy: userInfo.alergy,
      oldEmail: userInfo.oldEmail,
    }),
  }).then((res) => res.json());

  return postUpdateAccount;
}
