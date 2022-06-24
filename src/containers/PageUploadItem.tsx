import Label from "components/Label/Label";
import React, {FC, useEffect, useState} from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Input from "shared/Input/Input";
import Textarea from "shared/Textarea/Textarea";
import { Helmet } from "react-helmet";
import FormItem from "components/FormItem";
import { RadioGroup } from "@headlessui/react";
import { nftsImgs } from "contains/fakeData";
import MySwitch from "components/MySwitch";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import NcImage from "shared/NcImage/NcImage";

import Web3 from "web3";
import {AbiItem} from 'web3-utils';

import {useMoralisWeb3Api,useWeb3ExecuteFunction, useMoralisFile ,useNewMoralisObject,useMoralis} from "react-moralis";


import {TokenContractAbi} from '../abi';
import {marketplaceContractAbi} from '../abi';
import {userDataFetched} from "../app/userData/getUserDataReducer";
import {useAppDispatch} from "../app/hooks";


const web3 = new Web3(Web3.givenProvider);

export interface PageUploadItemProps {
  className?: string;
}

const plans = [
  {
    name: "Crypto Legend - Professor",
    featuredImage: nftsImgs[0],
  },
  {
    name: "Crypto Legend - Professor",
    featuredImage: nftsImgs[1],
  },
  {
    name: "Crypto Legend - Professor",
    featuredImage: nftsImgs[2],
  },
  {
    name: "Crypto Legend - Professor",
    featuredImage: nftsImgs[3],
  },
  {
    name: "Crypto Legend - Professor",
    featuredImage: nftsImgs[4],
  },
  {
    name: "Crypto Legend - Professor",
    featuredImage: nftsImgs[5],
  },
];

const PageUploadItem: FC<PageUploadItemProps> = ({ className = "" }) => {

  const dispatch = useAppDispatch();
  //Moralis
  const { user, Moralis,account, isAuthenticated ,enableWeb3, isWeb3Enabled} = useMoralis();
  const { saveFile,} = useMoralisFile();
  const contractProcessor = useWeb3ExecuteFunction();

  //Create items
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState(null)
  const [photoSrc, setPhotoSrc] = useState('')
  const [itemName, setItemName] = useState('')
  const [userLink, setUserLink] = useState('')
  const [itemDescription, setItemDescription] = useState('')
  const [itemCollection, setItemCOllection] = useState('')
  const [selected, setSelected] = useState(plans[1]);
  //Details
  const [royalties, setRoyalties] = useState('')
  const [sizeMb, setSizeMb] = useState('')
  const [propertie, setPropertie] = useState('')
  //Swither
  const [onSale, setOnSale] = useState(false)
  const [instantSale, setInstantSale] = useState(false)
  const [unlock, setUnlock] = useState(false)




  const takeFile = (e: any) => {

    setFile(e.target.files[0])
    setPhotoSrc(URL.createObjectURL(e.target.files[0]))

  }

  useEffect(  () => {
    if (!isWeb3Enabled) {
      enableWeb3();
    }
  }, [])

  const mintNFT = async (account: any, uri: string) => {
    console.log('mint start',)
    let options ={
      contractAddress: "0x0b874cF7b842Ce12Cc8aF81a200dC0Db0d1b5f3F",
      functionName: "safeMint",
      abi: [
        {
          "inputs": [{"internalType": "address", "name": "to", "type": "address"}, {
            "internalType": "string",
            "name": "uri",
            "type": "string"
          }], "name": "safeMint", "outputs": [], "stateMutability": "payable", "type": "function"
        },
      ],
      params: {
        to: account,
        uri: uri,
      },
      msgValue: Moralis.Units.ETH(0.1),
    }

    await contractProcessor.fetch({
      params: options,
      onSuccess: (result) => {
        console.log("Succesful Mint", result);
        setIsLoading(false)
        alert("Your NFT has been successfully Minted")
      },
      onError: (error) => {
        alert(error.message);
        setIsLoading(false)
      },
    });

  }


  const uploadFile = async (event: any) => {
    event.preventDefault();
    setIsLoading(true)
      const metadata = {
        name: itemName,
        description: itemDescription,
        link: userLink,
        collection: '1',
        royalties: royalties,
        sizeMb: sizeMb,
        price: '100',
        propertie: propertie,
        onSale: onSale.toString(),
        instantSale: instantSale.toString(),
        unlock: unlock.toString(),
      }

    try {
      const result = await saveFile(
          "nft.json",
          { base64: btoa(JSON.stringify(metadata)) },
          {
            type: "base64",
            saveIPFS: true,
          }
      );
      // @ts-ignore
      const nftResult = await uploadNftMetada(result.ipfs());
      // @ts-ignore
      console.log('result.ipfs()',result.ipfs())
      console.log('nftResult',nftResult)
      // @ts-ignore
      await mintNFT(account, nftResult.ipfs());

    } catch (error: any) {
      alert(error.message);
    }

  }

  const uploadNftMetada = async (url: string) => {

      if(file == null ) {
        alert('Please select a file')
        return
      } else if (itemName.length == 0 ) {
        alert('Please give the item a name')
        return
      }
    console.log('uploadNftMetada',url)
    const image = new Moralis.File(itemName, file);
    await image.saveIPFS();
    // @ts-ignore
    const imagePath = image.ipfs()

    const metadataNft = {
      image: imagePath,
      name: itemName,
      price: '100',
      inStock: '25',
      likesNumber: '22',
      externalUrl: url,
    };
    const resultNft = await saveFile(
        "metadata.json",
        { base64: btoa(JSON.stringify(metadataNft)) },
        {
          type: "base64",
          saveIPFS: true,
        }
    );
    return resultNft;
  };


  return (
    <div
      className={`nc-PageUploadItem ${className}`}
      data-nc-id="PageUploadItem"
    >
      <Helmet>
        <title>Create Item || NFT React Template</title>
      </Helmet>
      <div className="container">
        <div className="my-12 sm:lg:my-16 lg:my-24 max-w-4xl mx-auto space-y-8 sm:space-y-10">
          {/* HEADING */}
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-semibold">
              Create New Item
            </h2>
            <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
              You can set preferred display name, create your profile URL and
              manage other personal settings.
            </span>
          </div>
          <div className="w-full border-b-2 border-neutral-100 dark:border-neutral-700"></div>
          <div className="mt-10 md:mt-0 space-y-5 sm:space-y-6 md:sm:space-y-8">
            <div>
              <h3 className="text-lg sm:text-2xl font-semibold">
                Image, Video, Audio, or 3D Model
              </h3>
              <span className="text-neutral-500 dark:text-neutral-400 text-sm">
                File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV,
                OGG, GLB, GLTF. Max size: 100 MB
              </span>
              <div className="mt-5 ">
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-6000 border-dashed rounded-xl">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-neutral-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                    <div className="flex text-sm text-neutral-6000 dark:text-neutral-300">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer  rounded-md font-medium text-primary-6000 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload a file</span>

                        <input
                          onChange={takeFile}
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              {photoSrc &&   <div className="mt-5 ">
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-6000 border-dashed rounded-xl">
                  <div className="space-y-1 text-center">
                        <img
                            className={`inset-0 w-full h-full object-cover `}
                            src={photoSrc}
                            alt={'uploaded item'}
                        />
                  </div>
                </div>
              </div>}
            </div>

            {/* ---- */}
            <FormItem label="Item Name">
              <Input defaultValue="NFT name"  onChange={(e) => setItemName(e.target.value)} />
            </FormItem>

            {/* ---- */}
            <FormItem
              label="External link"
              desc="Nftria will include a link to this URL on this item's detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details."
            >
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                  https://
                </span>
                <Input onChange={(e) => setUserLink(e.target.value)} className="!rounded-l-none" placeholder="abc.com" />
              </div>
            </FormItem>

            {/* ---- */}
            <FormItem
              label="Description"
              desc={
                <div>
                  The description will be included on the item's detail page
                  underneath its image.{" "}
                  <span className="text-green-500">Markdown</span> syntax is
                  supported.
                </div>
              }
            >
              <Textarea onChange={(e) => setItemDescription(e.target.value)} rows={6} className="mt-1.5" placeholder="..." />
            </FormItem>

            <div className="w-full border-b-2 border-neutral-100 dark:border-neutral-700"></div>

            <div>
              <Label>Choose collection</Label>
              <div className="text-neutral-500 dark:text-neutral-400 text-sm">
                Choose an exiting collection or create a new one
              </div>
              <RadioGroup value={selected} onChange={setSelected}>
                <RadioGroup.Label className="sr-only">
                  Server size
                </RadioGroup.Label>
                <div className="flex overflow-auto py-2 space-x-4 customScrollBar">
                  {plans.map((plan, index) => (
                    <RadioGroup.Option
                      key={index}
                      value={plan}
                      className={({ active, checked }) =>
                        `${
                          active
                            ? "ring-2 ring-offset-2 ring-offset-sky-300 ring-white ring-opacity-60"
                            : ""
                        }
                  ${
                    checked
                      ? "bg-teal-600 text-white"
                      : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }
                    relative flex-shrink-0 w-44 rounded-xl border border-neutral-200 dark:border-neutral-700 px-6 py-5 cursor-pointer flex focus:outline-none `
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
                                      src={plan.featuredImage}
                                    />
                                  </RadioGroup.Description>
                                  {checked && (
                                    <div className="flex-shrink-0 text-white">
                                      <CheckIcon className="w-6 h-6" />
                                    </div>
                                  )}
                                </div>
                                <RadioGroup.Label
                                  as="p"
                                  className={`font-semibold mt-3  ${
                                    checked ? "text-white" : ""
                                  }`}
                                >
                                  {plan.name}
                                </RadioGroup.Label>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* ---- */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-2.5">
              {/* ---- */}
              <FormItem label="Royalties">
                <Input onChange={(e) => setRoyalties(e.target.value)} type="number" placeholder="20%" />
              </FormItem>
              {/* ---- */}
              <FormItem label="Size">
                <Input onChange={(e) => setSizeMb(e.target.value)} placeholder="165Mb" />
              </FormItem>
              {/* ---- */}
              <FormItem label="Propertie">
                <Input onChange={(e) => setPropertie(e.target.value)} placeholder="Propertie" />
              </FormItem>
            </div>

            {/* ---- */}
            <MySwitch enabled={onSale} setEnabled={setOnSale} />

            {/* ---- */}
            <MySwitch
                enabled={instantSale}
                setEnabled={setInstantSale}
              label="Instant sale price"
              desc="Enter the price for which the item will be instantly sold"
            />

            {/* ---- */}
            <MySwitch
              enabled={unlock}
              setEnabled={setUnlock}
              label="Unlock once purchased"
              desc="Content will be unlocked after successful transaction"
            />

            {/* ---- */}
            <div className="pt-2 flex flex-col sm:flex-row space-y-3 sm:space-y-0 space-x-0 sm:space-x-3 ">
              <ButtonPrimary onClick={(e: void) => uploadFile(e)} className="flex-1" loading={isLoading} >Upload item</ButtonPrimary>

              <ButtonSecondary className="flex-1">Preview item</ButtonSecondary>

            </div>
          </div>
        </div>
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

export default PageUploadItem;
