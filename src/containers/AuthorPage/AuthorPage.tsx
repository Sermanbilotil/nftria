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
import {selectCurrentUserData} from "../../app/userData/getUserDataReducer";
import ProfileIcon from "../../images/ribbon.png"
import Label from "../../components/Label/Label";
import {useMoralis, useMoralisQuery} from "react-moralis";
import Moralis from "moralis/types";
import {Link} from "react-router-dom";

export interface AuthorPageProps {
  className?: string;
}

const plans = [
  {
    name: "My First Collection",
    image: nftsImgs[0],
  },


];

const AuthorPage: FC<AuthorPageProps> = ({ className = "" }) => {

  let [categories] = useState([
    "Collectibles",
    "Created",
    "Liked",
    "Following",
    "Followers",
  ]);

  const {user} = useMoralis();

  const currentUserData = useAppSelector(selectCurrentUserData);
  const allCollections = useMoralisQuery("collections", (query: any) =>
          // @ts-ignore
          query.equalTo("ethAddress",user?.get("ethAddress")),
      [],
      {autoFetch: false});

  const shortEth = currentUserData.ethAddress !== undefined && currentUserData.ethAddress.substr(1, 15) + '...' + currentUserData.ethAddress.substr(currentUserData.ethAddress.length - 4)

  const [userCollections, setUserCollections] = useState<any[]>([])
  const [selected, setSelected] = useState();


  useEffect(() => {
    console.log('start get col', currentUserData.ethAddress)
    allCollections.fetch({
      onSuccess: (result) => {
        console.log('result all', result, result.length)


        const getCol: ((prevState: { name: string; image: string; }[]) => { name: string; image: string; }[]) | Moralis.Attributes[] = []

        result.map(col => {
          // @ts-ignore
          return  getCol.push(col.attributes)
        })
        // @ts-ignore
        setUserCollections(getCol)
      }
    })
  }, [currentUserData.ethAddress])


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
                src={currentUserData.photoSrc || ProfileIcon}
                containerClassName="aspect-w-1 aspect-h-1 rounded-3xl overflow-hidden"
              />
            </div>
            <div className="pt-5 md:pt-1 md:ml-6 xl:ml-14 flex-grow">
              <div className="max-w-screen-sm ">
                <h2 className="inline-flex items-center text-2xl sm:text-3xl lg:text-4xl font-semibold">
                  <span>{currentUserData.userName}</span>
                  <VerifyIcon
                    className="ml-2"
                    iconClass="w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8"
                  />
                </h2>
                <div className="flex items-center text-sm font-medium space-x-2.5 mt-2.5 text-green-600 cursor-pointer">
                  <span className="text-neutral-700 dark:text-neutral-300">
                    {shortEth}
                  </span>
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

                <span className="block mt-4 text-sm text-neutral-500 dark:text-neutral-400">
                  Punk #4786 / An OG Cryptopunk Collector, hoarder of NFTs.
                  Contributing to @ether_cards, an NFT Monetization Platform.
                </span>
              </div>
              <div className="mt-4 ">
                <SocialsList itemClass="block w-7 h-7" />
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
                    <RadioGroup value={selected}  onChange={setSelected}>
                      <RadioGroup.Label className="sr-only">
                        Server size
                      </RadioGroup.Label>
                      <div className="flex  overflow-auto py-2 space-x-4 customScrollBar">
                        {userCollections.length > 0 && userCollections.map((plan, index) => {

                            return <RadioGroup.Option
                                key={index}
                                value={plan}
                                className={({ active, checked }) =>
                                    `ring-2 ml-2 ring-offset-2  ${
                                        active
                                            ? "ring-2 ml-2 ring-offset-2 ring-offset-sky-300 ring-white ring-opacity-60"
                                            : ""
                                    }
                    relative  flex-shrink-0 w-44 rounded-xl border border-neutral-200 dark:border-neutral-700 px-6 py-5 cursor-pointer flex focus:outline-none `
                                }
                            >
                              {({ active, checked }) => (
                                  <>
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex items-center">
                                        <div className="text-sm">
                                          <div className="flex items-center justify-between">
                                            <RadioGroup.Description
                                                as="div"
                                                className={"rounded-full w-16"}
                                            >
                                              <NcImage
                                                  containerClassName="aspect-w-1 aspect-h-1 rounded-full overflow-hidden"
                                                  src={plan.image}
                                              />
                                            </RadioGroup.Description>
                                          </div>
                                          <RadioGroup.Label
                                              as="p"
                                              className={`font-semibold mt-3`}
                                          >
                                            {plan.name}
                                          </RadioGroup.Label>
                                          <Link  to={{pathname: `/page-collection/${plan.name}`, state: {
                                              name: plan.name,
                                            },}} className="absolute inset-0 "></Link>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                              )}

                            </RadioGroup.Option>
                        })}
                      </div>

                    </RadioGroup>
                  </div>

              </Tab.Panel>
              <Tab.Panel className="">
                {/* LOOP ITEMS */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8 lg:mt-10">
                  {currentUserData.nfts !== undefined && currentUserData.nfts.map((item, index) => {
                      if(item !== undefined) {
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
                  <ButtonPrimary loading>Show me more</ButtonPrimary>
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
                  <ButtonPrimary loading>Show me more</ButtonPrimary>
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
                  <ButtonPrimary loading>Show me more</ButtonPrimary>
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
                  <ButtonPrimary loading>Show me more</ButtonPrimary>
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
