import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { usePage } from "@inertiajs/inertia-react";
import { connectStore, userDataStore } from "../../data/store/connect.store";
import {
  cardStore,
  hourStore,
  imageStore,
} from "../../data/store/apiData.store";
import { CardDataType, HourDataType, Image } from "../../types/dataApiTypes";
import { User } from "../../types/userType.store";

const Layout = ({ children }) => {
  type propsType = {
    props: {
      hours: Array<HourDataType>;
      user?: User;
      cardData?: CardDataType;
      imagesData?: Image[];
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
  const setImages = imageStore((state) => state.setImages);

  useEffect(() => {
    setHours(props.hours);
    props.cardData && setCardData(props.cardData);
    props.imagesData && setImages(props.imagesData);

    if (props.user) {
      if (props.user.role === 1) {
        setConnectedAdmin(true);
      } else {
        setUserData(props.user);
        setConnectedUser(true);
      }
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
