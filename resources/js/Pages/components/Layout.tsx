import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { usePage } from "@inertiajs/inertia-react";
import { connectStore, userDataStore } from "../../data/store/connect.store";
import { cardStore, hourStore } from "../../data/store/apiData.store";
import { CardDataType, HourDataType } from "../../types/dataApiTypes";
import { User } from "../../types/userType.store";

const Layout = ({ children }) => {
  type propsType = {
    props: {
      hours: Array<HourDataType>;
      userData?: User;
      cardData?: CardDataType;
    };
  };

  const { props } = usePage() as unknown as propsType;
  const setHours = hourStore((state) => state.setHours);
  const setCardData = cardStore((state) => state.setCardStore);
  const setUserData = userDataStore((state) => state.setUserData);
  const [setConnectedUser, setConnectedAdmin] = connectStore((state) => [
    state.setConnectedUser,
    state.setConnectedAdmin,
  ]);

  useEffect(() => {
    setHours(props.hours);
    props.cardData && setCardData(props.cardData);

    if (props.userData?.user) {
      setUserData(props.userData);
      setConnectedUser(true);
    }

    if (props.userData?.admin) {
      setConnectedAdmin(true);
    }
  }, [props]);
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
