import { useState } from "react";
import { hourStore } from "../../../data/store/apiData.store";
import { MdEditSquare } from "react-icons/md";

import { useForm } from "@inertiajs/inertia-react";

export default function HourEditing() {
  const [errorHour, setErrorHour] = useState(false);
  const [hoursEdit, setHoursEdit] = useState(false);

  const [hours, setHour] = hourStore((state) => [state.hours, state.setHours]);
  const { post } = useForm();

  function editionFinished() {
    const inputs: NodeListOf<HTMLInputElement> =
      document.querySelectorAll("table tr input");
    inputs.forEach((input) => {
      const element = document.createElement("td");
      element.innerText = input.value;
      (input as Node).parentNode!.replaceChild(element, input);
      const childs = (element as Node).parentNode!.children;
      element.addEventListener("click", (e: MouseEvent) => {
        editingHours(
          e! as unknown as React.MouseEvent<HTMLElement>,
          (e!.target as HTMLElement).textContent,
          (element as Node).parentNode!.firstChild!.textContent,
          childs[1] == element ? "lunch" : "dinner"
        );
        setHoursEdit(true);
      });
    });
  }

  function editingHours(
    event: React.MouseEvent<HTMLElement>,
    text: string | null,
    day: string | null,
    time: string | null
  ) {
    const element: HTMLInputElement = document.createElement("input");
    element.classList.add(time as string);
    element.setAttribute("id", day as string);
    element.onkeydown = (e) => {
      if (e.code === "Enter") {
        submitHourEdition(
          document.querySelectorAll("article table tbody input")
        );
      }
    };
    element.value = text as string;
    (event!.target as HTMLElement).parentNode!.replaceChild(
      element,
      event!.target as HTMLElement
    );
  }

  async function submitHourEdition(elem: NodeListOf<HTMLInputElement>) {
    const data: Array<object> = [];
    for (let index = 0; index < elem.length; index++) {
      const element = elem[index];
      const day = elem[0].parentElement!.firstChild!.textContent;
      const time = element.getAttribute("class");
      data.push({ day: day, time: time, target: element.value });
    }

    let hourRegexTesting;
    for (let i = 0; i < elem.length; i++) {
      const hourRegexe = new RegExp(
        /^(fermer)|([0-1][0-9]|2[0-4])h([1-5][0-9]|60|0[1-9]|[1-9]0)? - ([0-1][0-9]|2[0-4])h([1-5][0-9]|60|0[1-9]|[1-9]0)?$/dgim
      );
      const inputs = elem[i];
      hourRegexTesting = hourRegexe.test(inputs.value);
    }
    if (hourRegexTesting) {
      setErrorHour(false);
      const response = fetch("/admin/hoursEdition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          data,
        }),
      });

      if ((await response).ok) {
        response.then((r) => r.json()).then((data) => setHour(data.hours));
        editionFinished();
      } else {
        setErrorHour(true);
      }
    } else setErrorHour(true);
  }

  return (
    <>
      <h1>Horaires d&#39;ouvertures</h1>
      <p>(Cliquez sur les horaires pour les éditer)</p>
      <p className={errorHour ? "format" : ""}>
        Format horaires, exemples : <br />
        12h - 15h, 12h30 - 15h10, fermer
      </p>
      <table>
        <thead>
          <tr>
            <td>jour</td>
            <td>midi</td>
            <td>soir</td>
          </tr>
          <tr>
            <td></td>
            <td>ouverture-fermeture</td>
            <td>ouverture-fermeture</td>
          </tr>
        </thead>
        <tbody>
          {hours?.map((elem, id) => {
            return (
              <tr key={id}>
                <>
                  <td>{elem.day}</td>
                  <td
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      editingHours(
                        e,
                        (e.target as HTMLElement).textContent,
                        elem.day,
                        "lunch"
                      );
                      setHoursEdit(true);
                    }}
                  >
                    {elem.lunch}
                  </td>
                  <td
                    onClick={(e) => {
                      editingHours(
                        e,
                        (e.target as HTMLElement).textContent,
                        elem.day,
                        "dinner"
                      );
                      setHoursEdit(true);
                    }}
                  >
                    {elem.dinner}
                  </td>
                </>
              </tr>
            );
          })}
        </tbody>
      </table>
      {hoursEdit ? (
        <div className="ctaEdit">
          <button
            onClick={() =>
              submitHourEdition(
                document.querySelectorAll("article table tbody input")
              )
            }
          >
            <p>Édition finit</p>
            <MdEditSquare color="#fff" />
          </button>
        </div>
      ) : null}
    </>
  );
}
