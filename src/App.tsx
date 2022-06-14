import React ,  { useEffect }  from "react";
import MyRouter from "routers/index";
import {useMoralis} from "react-moralis";
import {changeLoginState, userDataFetched} from "./app/userData/getUserDataReducer";
import {useAppDispatch} from "./app/hooks";



function App() {

    const { authenticate, setUserData,isAuthenticated,refetchUserData, isAuthenticating, user, account, logout } = useMoralis();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(changeLoginState(isAuthenticated));
        if(isAuthenticated && user) {

            const userName = user.get("userName")
            const photoSrc = user.get("photoSrc")
            const ethAddress = user.get("ethAddress")
            const email = user.getEmail()
            const aboutUser = user.get("aboutUser")
            const website = user.get("website")
            const facebook = user.get("facebook")
            const twitter = user.get("twitter")
            const telegram = user.get("telegram")


            dispatch(userDataFetched({
                userName: userName,
                photoSrc: photoSrc,
                ethAddress: ethAddress,
                email: email,
                aboutUser: aboutUser,
                website: website,
                facebook: facebook,
                twitter: twitter,
                telegram: telegram,
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);


    return (
    <div className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
      <MyRouter />
    </div>
  );
}

export default App;
