import React, {FC, useEffect, useState} from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import {Helmet} from "react-helmet";
import NcModal from "shared/NcModal/NcModal";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import NcImage from "shared/NcImage/NcImage";
import QrCodeImg from "images/qr-code.png";
import metamaskImg from "images/metamask.webp";
import walletconnectImg from "images/walletconnect.webp";
import walletlinkImg from "images/walletlink.webp";
import fortmaticImg from "images/fortmatic.webp";
import {useMoralis, useMoralisQuery, useMoralisWeb3Api} from "react-moralis";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import { useHistory } from "react-router-dom";

import {
    userDataFetched,
    changeLoginState,
    selectCurrentUserData, logoutUser,

} from "app/userData/getUserDataReducer";



export interface PageConnectWalletProps {
    className?: string;
}

const plans = [
    {
        name: "Metamask",
        img: metamaskImg,
        soon: false,
    },
    {
        name: "Walletconnect",
        img: walletconnectImg,
        soon: false,
    },
    {
        name: "Walletlink",
        img: walletlinkImg,
        soon: true,
    },
    {
        name: "Fortmatic",
        img: fortmaticImg,
        soon: true,
    },
];
const PageConnectWallet: FC<PageConnectWalletProps> = ({className = ""}) => {
    const hiatory = useHistory()

    const Web3Api = useMoralisWeb3Api();
    const { authenticate,setUserData,Moralis, isAuthenticated,refetchUserData, isAuthenticating, user, account, logout } = useMoralis();


    const [showModal, setShowModal] = useState(false);
    const dispatch = useAppDispatch();
    const currentUserData = useAppSelector(selectCurrentUserData);



    useEffect(() => {
        dispatch(changeLoginState(isAuthenticated));

            if(isAuthenticated && user) {
                fetchAllNfts()

                const ethAddress = user.get("ethAddress")
                console.log('email',currentUserData.email,currentUserData.userName, user)

                // if( currentUserData.userName == undefined ) {
                //     console.log('username Unnamed now')
                //     setUserData({userName: 'Unnamed'})
                // }
                dispatch(userDataFetched({ ethAddress: ethAddress }))
                hiatory.push("/");
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);


    const fetchAllNfts = async () => {

        const options = {
            chain: "mumbai",
            address: account,
            token_address: "0x0b874cF7b842Ce12Cc8aF81a200dC0Db0d1b5f3F",
        };

        const polygonNFTs = await Web3Api.account.getNFTsForContract(options as any);
        const tokenUri = polygonNFTs?.result?.map((data) => {
            const { metadata, owner_of } = data;

            if (metadata) {
                const metadataObj = JSON.parse(metadata);
                return metadataObj;
            } else {
                return undefined;
            }

        });
        dispatch(userDataFetched({ nfts: tokenUri }))
        console.log('user tokens', tokenUri)

    };



    const login = async (i: number) => {
        console.log('i', i, !isAuthenticated, user)
        if (!isAuthenticated) {
            switch (i) {
                case 0:
                    return  await authenticate({signingMessage: "Log in using Moralis and metamask" })
                        .then(function (user) {
                            console.log('metAMASK LOGIN',  user);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                case 1:
                    return await authenticate({ provider: "walletconnect",
                        mobileLinks: [
                            "metamask",
                            "trust",
                        ] })
                        .then(function (user) {
                            console.log('user walletconnect', user);

                        })
                        .catch(function (error) {
                            console.log(error);
                        });



            }



        }
    }

    const logOut = async () => {
        console.log("logged out");
        await logout();
        dispatch(logoutUser({login: false} ))
    }

    const renderContent = () => {
        return (
            <form action="#">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
                    Scan to connect
                </h3>
                <span className="text-sm">
          Open Coinbase Wallet on your mobile phone and scan
        </span>

                <div
                    className="p-5 border bg-white dark:bg-neutral-300 border-neutral-200 dark:border-neutral-700 rounded-xl flex items-center justify-center mt-4">
                    <NcImage className="w-40" src={QrCodeImg}/>
                </div>

                <div className="mt-5 space-x-3">
                    <ButtonPrimary type="submit">Install app</ButtonPrimary>
                    <ButtonSecondary type="button">Cancel</ButtonSecondary>
                </div>
            </form>
        );
    };

    return (
        <div
            className={`nc-PageConnectWallet ${className}`}
            data-nc-id="PageConnectWallet"
        >
            <Helmet>
                <title>Connect Wallet || NFT React Template</title>
            </Helmet>
            <div className="container">
                <div className="my-12 sm:lg:my-16 lg:my-24 max-w-3xl mx-auto space-y-8 sm:space-y-10">
                    {/* HEADING */}
                    <div className="max-w-2xl">
                        <h2 className="text-3xl sm:text-4xl font-semibold">
                            Connect your wallet.
                        </h2>
                        <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
              Connect with one of our available wallet providers or create a new
              one.
            </span>
                    </div>
                    <div className="w-full border-b-2 border-neutral-100 dark:border-neutral-700"></div>
                    <div className="mt-10 md:mt-0 space-y-5 sm:space-y-6 md:sm:space-y-8">
                        <div className="space-y-3">
                            {plans.map((plan,i) => (
                                <div
                                    key={plan.name}
                                    onClick={() => login(i)}
                                    typeof="button"
                                    tabIndex={0}
                                    className="relative rounded-xl hover:shadow-lg hover:bg-neutral-50 border
                border-neutral-200 dark:border-neutral-700 px-3 sm:px-5 py-4 cursor-pointer flex
                focus:outline-none focus:shadow-outline-blue focus:border-blue-500 dark:bg-neutral-800
                dark:text-neutral-100 dark:hover:bg-neutral-900 dark:hover:text-neutral-200"
                                >
                                    <div className="flex items-center w-full">
                                        <NcImage
                                            src={plan.img}
                                            containerClassName="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 p-2 sm:p-3 bg-white rounded-full overflow-hidden shadow-lg"
                                        />
                                        <div
                                            className={`ml-6 sm:ml-8 font-semibold text-xl  sm:text-2xl w-full`}
                                        >
                                            <div className="flex justify-between  ">
                                                {plan.name}
                                                {plan.soon ? <div
                                                    className={` text-neutral-500 font-medium flex sm:text-sm text-xs  items-center`}
                                                >
                                                    Coming soon
                                                </div> : null}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ---- */}
                        <div className="pt-2 ">
                            <ButtonPrimary href={"/"} className="flex-1">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M9.57 5.92993L3.5 11.9999L9.57 18.0699"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeMiterlimit="10"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M20.5 12H3.67004"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeMiterlimit="10"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>

                                <span className="ml-2">Go Back Home</span>
                            </ButtonPrimary>
                        </div>
                    </div>
                </div>
            </div>

            <NcModal
                renderTrigger={() => null}
                isOpenProp={showModal}
                renderContent={renderContent}
                contentExtraClass="max-w-md"
                onCloseModal={() => setShowModal(false)}
                modalTitle="Connect Wallet"
            />
        </div>
    );
};

export default PageConnectWallet;
