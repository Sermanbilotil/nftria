import React, { FC } from "react";
import MainNav2Logged from "./MainNav2Logged";
import {useAppSelector} from "../../app/hooks";
import {selectCurrentUserData} from "../../app/userData/getUserDataReducer";

export interface HeaderLoggedProps {
    logOut?: any,
    userName?: string,
    ethAddress?: string,
}

const HeaderLogged: FC<HeaderLoggedProps> = ({logOut,} ) => {





  return (
    <div className="nc-HeaderLogged relative w-full z-40 ">
      {/* NAV */}
      <MainNav2Logged  />
    </div>
  );
};

export default HeaderLogged;
