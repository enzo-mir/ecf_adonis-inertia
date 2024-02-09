import { useForm } from "@inertiajs/inertia-react";
import React, { useState } from "react";
import { usersInformationType } from "../../../types/userType.store";
import styles from "../../../../css/admin_user.module.css";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { userDataStore } from "../../../data/store/connect.store";
import FormComponent from "./FormUserUpdate";

const AdminUser = ({
  usersInfo,
}: {
  usersInfo: Array<usersInformationType>;
}) => {
  const [currentId, setCurrentId] = useState<number>(null);
  const [deleteId, setDeleteId] = useState<number>(null);
  const [rolefilter, setRoleFilter] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const {
    post: postDeleteAcc,
    data: deleteAccData,
    processing,
    setData: setDeleteAccData,
  } = useForm<{ id: number }>({
    id: null,
  });
  const {
    post: postCreateAccount,
    data: accountInfos,
    processing: processingAccountCreate,
    setData: setAccountInfos,
    reset,
  } = useForm<usersInformationType & { password: string }>({
    id: null,
    name: "",
    email: "",
    role: 1,
    password: "",
  });
  const userData = userDataStore((state) => state.userData);
  function filteredByRole() {
    const filterByRole = usersInfo.sort((a, b) => {
      if (a.role > b.role) {
        return rolefilter ? 1 : -1;
      }
      if (a.role < b.role) {
        return rolefilter ? -1 : 1;
      }
      return 0;
    });
    return filterByRole;
  }

  function handleChangeCreateUserInfos(e: React.ChangeEvent<HTMLInputElement>) {
    setAccountInfos({
      ...accountInfos,
      [e.target.name]: e.target.value,
    });
  }

  function createUser(e: React.FormEvent) {
    e.preventDefault();
    postCreateAccount("/admin/createUser", {
      data: accountInfos,
      onSuccess: () => {
        setErrorMessage("");
        reset();
      },
      onError: (err) => {
        setErrorMessage(err as unknown as string);
      },
    });
  }

  return (
    <>
      {errorMessage ? (
        <p className={styles.errorMessage}>{errorMessage}</p>
      ) : null}
      <table className={styles.table}>
        <caption>Gestionnaire des utilisateurs</caption>
        <thead>
          <tr>
            <td>Nom</td>
            <td>Email</td>
            <td>Mot de passe</td>
            <td
              onClick={() => {
                setRoleFilter(rolefilter === true ? false : true);
              }}
            >
              Rôle
              <MdOutlineKeyboardArrowDown
                className={rolefilter ? styles.filteredArrow : ""}
              />
            </td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {filteredByRole().map((users, index) => {
            return (
              <tr key={index}>
                {currentId === users.id ? (
                  <FormComponent
                    setCurrentId={setCurrentId}
                    setErrorMessage={setErrorMessage}
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
                      {deleteId === users.id ? (
                        <>
                          <p>êtes vous sûr ?</p>
                          <button
                            disabled={processing}
                            onClick={() => {
                              postDeleteAcc(
                                `/admin/deletUser/${deleteAccData.id}`,
                                {
                                  onSuccess: () => {
                                    setDeleteId(null);
                                    setErrorMessage("");
                                  },
                                  onError: (err) => {
                                    setErrorMessage(err as unknown as string);
                                  },
                                }
                              );
                            }}
                          >
                            Oui
                          </button>
                          <button
                            onClick={() => {
                              setDeleteId(null);
                              setDeleteAccData({ id: null });
                            }}
                          >
                            Non
                          </button>
                        </>
                      ) : userData.email === users.email ? (
                        <button onClick={() => setCurrentId(users.id)}>
                          Modifier
                        </button>
                      ) : (
                        <>
                          <button onClick={() => setCurrentId(users.id)}>
                            Modifier
                          </button>
                          <button
                            onClick={() => {
                              setDeleteId(users.id);
                              setDeleteAccData({ id: users.id });
                            }}
                          >
                            Supprimer
                          </button>
                        </>
                      )}
                    </td>
                    {userData.email === users.email ? (
                      <td>
                        compte en cours
                        <br />
                        d'utilisation
                      </td>
                    ) : null}
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      <form className={styles.form_create} onSubmit={createUser}>
        <input
          type="text"
          name="name"
          placeholder="Entrer le nom"
          onChange={handleChangeCreateUserInfos}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Entrer l'email"
          onChange={handleChangeCreateUserInfos}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Entrer le mot de passe"
          onChange={handleChangeCreateUserInfos}
          required
        />
        <select name="role">
          <option value={1}>Admin</option>
        </select>
        <input
          type="submit"
          value="Créer un compte admin"
          disabled={processingAccountCreate}
        />
      </form>
    </>
  );
};

export default AdminUser;
