import { useForm } from "@inertiajs/inertia-react";
import React, { useState } from "react";
import { usersInformationType } from "../../../types/userType.store";
import styles from "../../../../css/admin_user.module.css";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { userDataStore } from "../../../data/store/connect.store";

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
  function FormComponent({ id, role, email, name }: usersInformationType) {
    const { post, processing, data, setData, reset } = useForm<
      usersInformationType & { password: string; emailChange: boolean }
    >({
      id,
      role,
      email,
      name,
      password: "",
      emailChange: false,
    });
    const defaultEmail = data.email;
    function handleChangeValues(
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
      setData({
        ...data,
        [e.target.name]:
          e.target.name === "role" ? parseInt(e.target.value) : e.target.value,
      });
    }

    function handlSubmitEdition(e: React.MouseEvent) {
      e.preventDefault();
      post("/admin/userUpdate", {
        data: { ...data, emailChange: defaultEmail !== data.email },
        onSuccess: () => {
          setCurrentId(null);
          setErrorMessage("");
        },

        onError: (message) => {
          setErrorMessage(message as unknown as string);
        },
      });
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
    </>
  );
};

export default AdminUser;
