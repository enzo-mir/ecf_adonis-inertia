import { useForm } from "@inertiajs/inertia-react";
import React from "react";
import { usersInformationType } from "../../../types/userType.store";

function FormComponent({
  id,
  role,
  email,
  name,
  setCurrentId,
  setErrorMessage,
}: usersInformationType & {
  setCurrentId(val: number): void;
  setErrorMessage(val: string): void;
}) {
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

export default FormComponent;
