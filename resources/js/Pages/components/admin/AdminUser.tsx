import { useForm } from "@inertiajs/inertia-react";
import React, { useState } from "react";
import { usersInformationType } from "../../../types/userType.store";
import styles from "../../../../css/admin_user.module.css";

const AdminUser = ({
  usersInfo,
}: {
  usersInfo: Array<usersInformationType>;
}) => {
  const [currentId, setCurrentId] = useState<number>(null);

  function FormComponent({ id, role, email, name }: usersInformationType) {
    const { post, processing, data, setData, reset } = useForm<
      usersInformationType & { password: string }
    >({
      id,
      role,
      email,
      name,
      password: "",
    });
    function handleChangeValues(
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
      setData({ ...data, [e.target.name]: e.target.value });
    }

    function handlSubmitEdition(e: React.MouseEvent) {
      e.preventDefault();
      post("/admin/userUpdate", { data });
    }
    return (
      <>
        <td>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChangeValues}
          />
        </td>
        <td>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChangeValues}
          />
        </td>

        <td>
          <input
            type="text"
            name="password"
            value={data.password}
            onChange={handleChangeValues}
          />
        </td>

        <td>
          <select name="role" onChange={handleChangeValues}>
            {role === 0 ? (
              <>
                <option value={0}>Client</option>
                <option value={1}>Admin</option>
              </>
            ) : (
              <>
                <option value={1}>Admin</option>
                <option value={0}>Client</option>
              </>
            )}
          </select>
        </td>

        <td>
          <button onClick={handlSubmitEdition} disabled={processing}>
            Confirmer
          </button>
          <button
            onClick={() => {
              setCurrentId(null);
              reset();
            }}
          >
            Annuler
          </button>
        </td>
      </>
    );
  }

  return (
    <table className={styles.table}>
      <caption>Gestionnaire des utilisateurs</caption>
      <thead>
        <tr>
          <td>Nom</td>
          <td>Email</td>
          <td>Mot de passe</td>
          <td>Rôle</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        {usersInfo.map((users, index) => {
          return (
            <tr key={index}>
              {currentId === index ? (
                <FormComponent
                  id={users.id}
                  name={users.name}
                  email={users.email}
                  role={users.role}
                />
              ) : (
                <>
                  <td>{users.name}</td>
                  <td>{users.email}</td>
                  <td>*********</td>
                  <td>{users.role === 0 ? "client" : "admin"}</td>
                  <td>
                    <button onClick={() => setCurrentId(index)}>
                      Modifier
                    </button>
                    <button>Supprimer</button>
                  </td>
                </>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AdminUser;
