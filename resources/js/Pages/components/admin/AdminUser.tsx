import React from "react";
import { usersInformationType } from "../../../types/userType.store";

const AdminUser = ({
  usersInfo,
}: {
  usersInfo: Array<usersInformationType>;
}) => {
  console.log(usersInfo);

  return (
    <>
      <h1>Gestionnaire des utilisateurs</h1>
      <section>
        <table>
          <caption>Clients</caption>
          <thead>
            <tr>
              <td>Nom</td>
              <td>Email</td>
              <td>Mot de passe</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {usersInfo.map((users, index) => {
              return (
                users.role === 0 && (
                  <tr key={index}>
                    <td>{users.name}</td>
                    <td>{users.email}</td>
                    <td>*********</td>
                    <td>
                      <button>Modifier</button>
                      <button>Supprimer</button>
                    </td>
                  </tr>
                )
              );
            })}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AdminUser;
