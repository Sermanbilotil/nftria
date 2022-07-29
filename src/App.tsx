import React ,  { useEffect }  from "react";
import MyRouter from "routers/index";
import {useMoralis, useMoralisQuery, useMoralisWeb3Api} from "react-moralis";
import {changeLoginState, userDataFetched,} from "./app/userData/getUserDataReducer";
import {nftDataFetched} from "./app/allData/getAllDataReducer";

import {useAppDispatch} from "./app/hooks";
import Moralis from "moralis/types";


function App() {

    const {
        authenticate,
        setUserData,
        isAuthenticated,
        refetchUserData,
        isAuthenticating,
        user,
        account,
        logout
    } = useMoralis();
    const dispatch = useAppDispatch();
    const Web3Api = useMoralisWeb3Api();


    useEffect(() => {
        dispatch(changeLoginState(isAuthenticated));
        if (isAuthenticated && user) {
            fetchUserNfts()

            const userName = user.get("userName")
            const photoSrc = user.get("photoSrc")
            const ethAddress = user.get("ethAddress")
            const email = user.getEmail()
            const aboutUser = user.get("aboutUser")
            const website = user.get("website")
            const facebook = user.get("facebook")
            const twitter = user.get("twitter")
            const telegram = user.get("telegram")
            const userNFT = user.get("userNFT")

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
                userNFT: userNFT,
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    const fetchUserNfts = async () => {
        console.log('account', account)
        const options = {
            chain: "mumbai",
            address: account,
            token_address: "0x0b874cF7b842Ce12Cc8aF81a200dC0Db0d1b5f3F",
        };

        const polygonNFTs = await Web3Api.account.getNFTsForContract(options as any);
        const tokenUri = polygonNFTs?.result?.map((data) => {
            const {metadata, owner_of, token_id, token_address} = data;

            if (metadata) {
                const metadataObj = JSON.parse(metadata);
                return {metadataObj, token_id, token_address, owner_of};
            } else {
                return undefined;
            }

        });
        dispatch(userDataFetched({nfts: tokenUri}))
        console.log('user tokens', tokenUri)

    };


    useEffect(() => {
        fetchAllNfts()
        fetchAllConnections()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const fetchAllNfts = async () => {
        const options = {
            chain: "mumbai",
            address: "0x0b874cF7b842Ce12Cc8aF81a200dC0Db0d1b5f3F",
        };
        const polygonNFTs = await Web3Api.token.getNFTOwners(options as any);
        const tokenUri = polygonNFTs?.result?.map((data) => {
            const {metadata, owner_of, token_id, token_address} = data;
            if (metadata) {
                const metadataObj = JSON.parse(metadata);
                return {metadataObj, token_id, token_address, owner_of};
            } else {
                return undefined;
            }
        });
        console.log('nfts', tokenUri)
        dispatch(nftDataFetched({nfts: tokenUri}))
    };


    const allCollections = useMoralisQuery("collections", (query: any) =>
            query.equalTo(),
        [],
        {autoFetch: false});

    const fetchAllConnections = async () => {
        let collectionsArr: Moralis.Attributes[] = []
        await allCollections.fetch({
            onSuccess: (result) => {
                     result.map(col => {
                         const shortCol = {
                             name: col.attributes.name,
                             image: col.attributes.image,
                             userName: col.attributes.userName,
                             items: col.attributes.items,
                             description: col.attributes.description,
                             ethAddress: col.attributes.ethAddress
                         }
                        return collectionsArr.push(shortCol)
                    })
                console.log('arr',collectionsArr)
                }})
        dispatch(nftDataFetched({ collections: collectionsArr }))
    };


    return (
    <div className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
      <MyRouter />
    </div>
  );
}

export default App;
