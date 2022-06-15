import React, {ReactNode, useEffect} from "react";
import { useLocation } from "react-router-dom";
import HeaderLogged from "components/Header/HeaderLogged";
import Header2 from "components/Header/Header2";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {changeLoginState, selectCurrentUserData, userDataFetched} from "../app/userData/getUserDataReducer";
import {MediaRunningState} from "../app/mediaRunning/mediaRunning";
import {useMoralis} from "react-moralis";

const SiteHeader = () => {
  let location = useLocation();

  const currentUserData = useAppSelector(selectCurrentUserData);
  const isLogged = currentUserData.login

 console.log('User login', isLogged)

  return isLogged ? <HeaderLogged   /> : <Header2 /> ;
};

export default SiteHeader;
