import React, {FC, Fragment, useEffect, useState} from "react";
import { Helmet } from "react-helmet";
import BackgroundSection from "components/BackgroundSection/BackgroundSection";
import NcImage from "shared/NcImage/NcImage";
import CardNFT from "components/CardNFT";
import Pagination from "shared/Pagination/Pagination";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import authorBanner from "images/nfts/authorBanner.png";
import { nftsImgs } from "contains/fakeData";
import NftMoreDropdown from "components/NftMoreDropdown";
import ButtonDropDownShare from "components/ButtonDropDownShare";
import SectionBecomeAnAuthor from "components/SectionBecomeAnAuthor/SectionBecomeAnAuthor";
import SocialsList from "shared/SocialsList/SocialsList";
import FollowButton from "components/FollowButton";
import VerifyIcon from "components/VerifyIcon";
import {RadioGroup, Tab} from "@headlessui/react";
import CardAuthorBox3 from "components/CardAuthorBox3/CardAuthorBox3";
import ArchiveFilterListBox from "components/ArchiveFilterListBox";
import SectionGridAuthorBox from "components/SectionGridAuthorBox/SectionGridAuthorBox";
import {useAppSelector} from "../../app/hooks";
import ProfileIcon from "../../images/ribbon.png"
import Label from "../../components/Label/Label";
import {useMoralis, useMoralisQuery, useMoralisWeb3Api} from "react-moralis";
import Moralis from "moralis";
import {Link} from "react-router-dom";
import CollectionCard from "../../components/CollectionCard";
import CollectionCard2 from "../../components/CollectionCard2";

//reduxcers
import {changeLoginState, selectCurrentUserData, userDataFetched} from "../../app/userData/getUserDataReducer";
import {selectCurrentAllData} from "../../app/allData/getAllDataReducer";


export interface AuthorPageProps {
  className?: string;
  cardStyle?: "style1" | "style2";
  history?: any ;
}

export interface  userDataState {
  profilePhoto?: File | undefined,
  photoSrc?: string,
  userName?: string,
  email?: string,
  aboutUser?: string,
  website?: string,
  facebook?: string,
  twitter?: string,
  telegram?: string,
  userNFT?: string,
  ethAddress?: string,
  login?: boolean,
  error?: boolean,
  nfts?: ({ metadataObj: any; token_id: string; token_address: string; owner_of: string; } | undefined)[] | undefined
  // state?: "loading" | "playing" | "paused" | "ended" | null;
}


const plans = [
  {
    name: "My First Collection",
    image: nftsImgs[0],
  },

];

const AuthorPage: FC<AuthorPageProps> = (props, { className = "" ,cardStyle = "style1",}) => {
  const Web3Api = useMoralisWeb3Api()
  const MyCollectionCard =
      cardStyle === "style1" ? CollectionCard : CollectionCard2;

  let [categories] = useState([
    "Collections",
    "Collectibles",
    "Created",
    "Liked",
    "Following",
    "Followers",
  ]);

  const {user} = useMoralis();

  let currentUserData = useAppSelector(selectCurrentUserData);


  const allNFT = useAppSelector(selectCurrentAllData);


  const collectionEth = window.location.pathname.split('/').reverse()[0].replace(/%20/g, ' ')
  let allCollections = useMoralisQuery("collections", (query: any) =>
          query.equalTo("ethAddress",collectionEth),
      [],
      {autoFetch: true, live: true});


  const [nftPage, setNftPage] = useState(1)

  const [userCollections, setUserCollections] = useState<any[]>([])
  const [createdNFTs, setCreatedNFTs] = useState<any[]>([])
  const [selected, setSelected] = useState();

  const [userData, setUserData] = useState<userDataState>({});
  const [userNfts, setUserNfts] = useState<any[] | undefined>([]);

  const shortEth = userData.ethAddress !== undefined ? userData.ethAddress.substr(1, 15) + '...' + userData.ethAddress.substr(userData.ethAddress.length - 4) : ''


  useEffect(() => {

    if(props.history.location.state  && props.history.location.state.creator) {
      console.log('history', props.history)
      setUserData(props.history.location.state.creator)
      fetchUserNfts(props.history.location.state.creator.ethAddress)
    } else {
      console.log('main', currentUserData)
      setUserData(currentUserData)
    }

    allCollections.fetch({
      onSuccess: (result) => {

        if(result.length === 0) {
          setUserCollections(plans)
          return
        }
        const getCol: ((prevState: { name: string; image: string; }[]) => { name: string; image: string; }[]) | Moralis.Attributes[] = []
        result.map(col => {
          // @ts-ignore
          return  getCol.push(col.attributes)
        })
        console.log('user col', getCol, collectionEth)
        // @ts-ignore
        setUserCollections(getCol)
      }
    })

  }, [])

  useEffect(() => {
    tabFilters(collectionEth)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allNFT]);

  useEffect(() => {

    Moralis.Cloud.run('getUser', { ethAddress:  collectionEth })
        .then(result =>   {
          setUserData(result[0].attributes)

        })
    tabFilters(collectionEth)
    fetchUserNfts(collectionEth)
    getUserCollections()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  const getUserCollections = async () => {
    const collections = Moralis.Object.extend("collections");
    const query = new Moralis.Query(collections);
    query.equalTo("ethAddress", collectionEth);
    const object = await query.find();
    // @ts-ignore
    let DATA = JSON.parse(
        JSON.stringify(object)
    )
    setUserCollections(DATA)

  }

  const tabFilters = (eth: any) => {
    const address = eth

    if(allNFT !== undefined && allNFT.nfts !== undefined) {
      const created = allNFT.nfts.filter((nft: any) => {
        if(nft !== undefined &&  nft.metadataObj !== undefined) {
         return nft.metadataObj.creator === address
        }
      })
      console.log('created', created)
      setCreatedNFTs(created)
    }

  };


  const fetchUserNfts = async (eth: string) => {

    const options = {
      chain: "mumbai",
      address: eth,
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
      // eslint-disable-next-line no-unreachable
    });

    setUserNfts(tokenUri)
    console.log('user tokens', tokenUri)

  };


  return (
    <div className={`nc-AuthorPage  ${className}`} data-nc-id="AuthorPage">
      <Helmet>
        <title>Creator || Nftria</title>
      </Helmet>

      {/* HEADER */}
      <div className="w-full">
        <div className="relative w-full h-40 md:h-60 2xl:h-72">
          <NcImage
            containerClassName="absolute inset-0"
            src={authorBanner}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="container -mt-10 lg:-mt-16">
          <div className="relative bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 p-5 lg:p-8 rounded-3xl md:rounded-[40px] shadow-xl flex flex-col md:flex-row">
            <div className="w-32 lg:w-44 flex-shrink-0 mt-12 sm:mt-0">
              <NcImage
                src={userData.photoSrc}
                containerClassName="aspect-w-1 aspect-h-1 rounded-3xl overflow-hidden"
              />
            </div>
            <div className="pt-5 md:pt-1 md:ml-6 xl:ml-14 flex-grow">
              <div className="max-w-screen-sm ">
                <h2 className="inline-flex items-center text-2xl sm:text-3xl lg:text-4xl font-semibold">
                  <span>{userData.userName}</span>
                  <VerifyIcon
                    className="ml-2"
                    iconClass="w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8"
                  />
                </h2>
                <div className="flex items-center text-sm font-medium space-x-2.5 mt-2.5 text-green-600 cursor-pointer">
                  <span className="text-neutral-700 dark:text-neutral-300">
                    {shortEth}
                  </span>
                  <div className={"active:opacity-[0.5]"} onClick={() => userData.ethAddress !== undefined ? navigator.clipboard.writeText(userData.ethAddress) : ''}>

                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
                      <path
                          d="M18.05 9.19992L17.2333 12.6833C16.5333 15.6916 15.15 16.9083 12.55 16.6583C12.1333 16.6249 11.6833 16.5499 11.2 16.4333L9.79999 16.0999C6.32499 15.2749 5.24999 13.5583 6.06665 10.0749L6.88332 6.58326C7.04999 5.87492 7.24999 5.25826 7.49999 4.74992C8.47499 2.73326 10.1333 2.19159 12.9167 2.84993L14.3083 3.17493C17.8 3.99159 18.8667 5.71659 18.05 9.19992Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                      />
                      <path
                          d="M12.5498 16.6583C12.0331 17.0083 11.3831 17.3 10.5915 17.5583L9.2748 17.9917C5.96646 19.0583 4.2248 18.1667 3.1498 14.8583L2.08313 11.5667C1.01646 8.25833 1.8998 6.50833 5.20813 5.44167L6.5248 5.00833C6.86646 4.9 7.19146 4.80833 7.4998 4.75C7.2498 5.25833 7.0498 5.875 6.88313 6.58333L6.06646 10.075C5.2498 13.5583 6.3248 15.275 9.7998 16.1L11.1998 16.4333C11.6831 16.55 12.1331 16.625 12.5498 16.6583Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <span className="block mt-4 text-sm text-neutral-500 dark:text-neutral-400">
                 {userData.aboutUser}
                </span>
              </div>
              <div className="mt-4 ">
                <SocialsList facebook={userData.facebook} twitter={userData.twitter} telegram={userData.telegram} itemClass="block w-7 h-7" />
              </div>
            </div>
            <div className="absolute md:static left-5 top-4 sm:left-auto sm:top-5 sm:right-5 flex flex-row-reverse justify-end">
              <NftMoreDropdown
                actions={[
                  {
                    id: "report",
                    name: "Report abuse",
                    icon: "las la-flag",
                  },
                ]}
                containerClassName="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 dark:bg-neutral-800 cursor-pointer"
              />
              <ButtonDropDownShare
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 dark:bg-neutral-800 cursor-pointer mx-2"
                panelMenusClass="origin-top-right !-right-5 !w-40 sm:!w-52"
              />

              <FollowButton
                isFollowing={false}
                fontSize="text-sm md:text-base font-medium"
                sizeClass="px-4 py-1 md:py-2.5 h-8 md:!h-10 sm:px-6 lg:px-8"
              />
            </div>
          </div>
        </div>

      </div>
      {/* ====================== END HEADER ====================== */}

      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
        <main>

          <Tab.Group>
            <div className="flex flex-col lg:flex-row justify-between ">
              <Tab.List className="flex space-x-0 sm:space-x-2 overflow-x-auto ">
                {categories.map((item) => (
                  <Tab key={item} as={Fragment}>
                    {({ selected }) => (
                      <button
                        className={`flex-shrink-0 block font-medium px-4 py-2 text-sm sm:px-6 sm:py-2.5 capitalize rounded-full focus:outline-none ${
                          selected
                            ? "bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900"
                            : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900 hover:bg-neutral-100/70 dark:hover:bg-neutral-800"
                        } `}
                      >
                        {item}
                      </button>
                    )}
                  </Tab>
                ))}
              </Tab.List>
              <div className="mt-5 lg:mt-0 flex items-end justify-end">
                <ArchiveFilterListBox />
              </div>
            </div>
            <Tab.Panels>

              <Tab.Panel className="">
                {/* LOOP ITEMS */}
                  <div className="mb-10 mt-10">
                    <h3 className="text-lg sm:text-2xl font-semibold mb-5">
                      Choose collections
                    </h3>

                      <div className="flex  overflow-auto py-2 space-x-4 customScrollBar ">
                        {userCollections.length > 0 && userCollections.map((plan, index) => {

                          return  <li   key={index} className={`list-none min-w-[350px] `}>
                            <MyCollectionCard
                                imgs={[
                                  plan.image,
                                  plan.image,
                                  plan.image,
                                  plan.image,
                                ]}
                                name={plan.name}
                                userName={plan.userName}
                                items={plan.items}
                            />
                          </li>
                        })}
                      </div>

                    {/*<RadioGroup value={selected}  onChange={setSelected}>*/}
                    {/*  <RadioGroup.Label className="sr-only">*/}
                    {/*    Server size*/}
                    {/*  </RadioGroup.Label>*/}
                    {/*  <div className="flex  overflow-auto py-2 space-x-4 customScrollBar">*/}
                    {/*    {userCollections.length > 0 && userCollections.map((plan, index) => {*/}
                    {/*        return <li   key={index} className={`glide__slide`}>*/}
                    {/*          <MyCollectionCard*/}
                    {/*              imgs={[*/}
                    {/*                plan.image,*/}
                    {/*                plan.image,*/}
                    {/*                plan.image,*/}
                    {/*                plan.image,*/}
                    {/*              ]}*/}
                    {/*              name={plan.name}*/}
                    {/*              userName={plan.userName}*/}
                    {/*              items={plan.items}*/}
                    {/*          />*/}
                    {/*        </li>*/}
                    {/*    })}*/}
                    {/*  </div>*/}

                    {/*</RadioGroup>*/}
                  </div>

              </Tab.Panel>
              <Tab.Panel className="">
                {/* LOOP ITEMS */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8 lg:mt-10">

                  { userNfts !== undefined && userNfts?.length > 0 ? userNfts.map((item, index) => {

                    if(item !== undefined && index < nftPage * 8) {
                      const nft = item.metadataObj
                      return nft !== undefined &&  <CardNFT
                          key={index}
                          isLiked
                          uri={nft.image}
                          inStock={nft.inStock}
                          likesNumber={nft.likesNumber}
                          name={nft.name}
                          price={nft.price}
                          externalUrl={nft.externalUrl}
                          id={item.token_id}
                          address={item.token_address}

                      />
                    }

                  }) : currentUserData.nfts !== undefined && currentUserData.nfts.map((item, index) => {

                    if(item !== undefined && index < nftPage * 8) {
                      const nft = item.metadataObj
                      return nft !== undefined &&  <CardNFT
                          key={index}
                          isLiked
                          uri={nft.image}
                          inStock={nft.inStock}
                          likesNumber={nft.likesNumber}
                          name={nft.name}
                          price={nft.price}
                          externalUrl={nft.externalUrl}
                          id={item.token_id}
                          address={item.token_address}

                      />
                    }
                  })}

                </div>

                {/* PAGINATION */}
                <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
                  <Pagination />
                  <ButtonPrimary onClick={() => setNftPage(nftPage + 1)}>Show me more</ButtonPrimary>
                </div>
              </Tab.Panel>
              <Tab.Panel className="">
                {/* LOOP ITEMS */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8 lg:mt-10">
                  { createdNFTs.map((item, index) => {
                      if(item !== undefined && item.metadataObj && index <= nftPage * 8) {
                        const nft = item.metadataObj
                        return nft !== undefined &&  <CardNFT
                            key={index}
                            isLiked
                            uri={nft.image}
                            inStock={nft.inStock}
                            likesNumber={nft.likesNumber}
                            name={nft.name}
                            price={nft.price}
                            externalUrl={nft.externalUrl}
                            id={item.token_id}
                            address={item.token_address}

                        />
                      }
                  })}
                </div>

                {/* PAGINATION */}
                <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
                  <Pagination />
                  <ButtonPrimary onClick={() => setNftPage(nftPage + 1)}>Show me more</ButtonPrimary>
                </div>
              </Tab.Panel>
              <Tab.Panel className="">
                {/* LOOP ITEMS */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8 lg:mt-10">
                  {Array.from("11111111").map((_, index) => (
                    <CardNFT isLiked key={index}
                             uri={''}
                             inStock={''}
                             likesNumber={''}
                             name={''}
                             price={''}
                    />
                  ))}
                </div>

                {/* PAGINATION */}
                <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
                  <Pagination />
                  <ButtonPrimary onClick={() => setNftPage(nftPage + 1)}>Show me more</ButtonPrimary>
                </div>
              </Tab.Panel>
              <Tab.Panel className="">
                {/* LOOP ITEMS */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8 lg:mt-10">
                  {Array.from("11111111").map((_, index) => (
                    <CardAuthorBox3 following key={index} />
                  ))}
                </div>

                {/* PAGINATION */}
                <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
                  <Pagination />
                  <ButtonPrimary onClick={() => setNftPage(nftPage + 1)} >Show me more</ButtonPrimary>
                </div>
              </Tab.Panel>
              <Tab.Panel className="">
                {/* LOOP ITEMS */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mt-8 lg:mt-10">
                  {Array.from("11111111").map((_, index) => (
                    <CardAuthorBox3 following={false} key={index} />
                  ))}
                </div>

                {/* PAGINATION */}
                <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
                  <Pagination />
                  <ButtonPrimary onClick={() => setNftPage(nftPage + 1)}>Show me more</ButtonPrimary>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>

        </main>

        {/* === SECTION 5 === */}
        <div className="relative py-16 lg:py-28">
          <BackgroundSection />
          <SectionGridAuthorBox data={Array.from("11111111")} boxCard="box4" />
        </div>

        {/* SUBCRIBES */}
        <SectionBecomeAnAuthor />
      </div>
    </div>
  );
};
function CheckIcon(props: any) {
  return (
      <svg viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
        <path
            d="M7 13l3 3 7-7"
            stroke="#fff"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
      </svg>
  );
}
export default AuthorPage;
