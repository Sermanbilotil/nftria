import Label from "components/Label/Label";
import React, {FC, useEffect, useState} from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Input from "shared/Input/Input";
import Textarea from "shared/Textarea/Textarea";
import { Helmet } from "react-helmet";
import FormItem from "components/FormItem";
import {Listbox, RadioGroup} from "@headlessui/react";
import { nftsImgs } from "contains/fakeData";
import MySwitch from "components/MySwitch";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import NcImage from "shared/NcImage/NcImage";
import Web3 from "web3";
import {selectCurrentUserData, userDataFetched} from "../app/userData/getUserDataReducer";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import CategoryListBox from "../components/CategoryListBox";
//Moralis
import {useMoralisWeb3Api,useWeb3ExecuteFunction,useMoralisQuery, useMoralisFile ,useNewMoralisObject,useMoralis} from "react-moralis";
import Moralis from "moralis/types";
import {upload} from "@testing-library/user-event/dist/upload";
import Avatar from "../shared/Avatar/Avatar";


const web3 = new Web3(Web3.givenProvider);

export interface PageUploadItemProps {
  className?: string;
}

const plans = [
  {
    name: "My First Collection",
    image: nftsImgs[0],
  },

];

const PageUploadItem: FC<PageUploadItemProps> = ({className = ""}) => {

  const dispatch = useAppDispatch();
  //user
  const currentUserData = useAppSelector(selectCurrentUserData);
  //Create items
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState(null)
  const [userCollections, setUserCollections] = useState(plans)
  const [newCollection, setNewCollection] = useState('')
  const [collectionPhoto, setCollectionPhoto] = useState<any>()
  const [collectionPhotoURL, setCollectionPhotoURL] = useState<any>()

  const [photoSrc, setPhotoSrc] = useState('')
  const [itemName, setItemName] = useState('')

  //NFT Models
  const [userModels, setUserModels] = useState([])
  const [filteredModels, setFilteredModels] = useState([])
  const [showModels, setShowModels] = useState(false)
  const [model, setModel] = useState('')


  const [price, setPrice] = useState('')
  const [supply, seSupply] = useState('')
  const [userLink, setUserLink] = useState('')
  const [itemDescription, setItemDescription] = useState('')
  const [itemCollection, setItemCOllection] = useState('')
  const [selected, setSelected] = useState(userCollections[0]);
  const [category, setCategory] = useState('');
  //Details
  const [royalties, setRoyalties] = useState('')
  const [sizeMb, setSizeMb] = useState('')
  const [propertie, setPropertie] = useState('')
  //Swither
  const [onSale, setOnSale] = useState(false)
  const [instantSale, setInstantSale] = useState(false)
  const [unlock, setUnlock] = useState(false)
  //Moralis
  const {user, setUserData, Moralis, account, isAuthenticated, enableWeb3, isWeb3Enabled} = useMoralis();
  const {saveFile,} = useMoralisFile();
  const contractProcessor = useWeb3ExecuteFunction();
  const {save} = useNewMoralisObject("collections");
  const Web3Api = useMoralisWeb3Api();

  const allCollections = useMoralisQuery("collections", (query: any) =>
          query.equalTo("ethAddress", currentUserData.ethAddress),
      [],
      {autoFetch: false});


  const takeFile = (e: any) => {
    setFile(e.target.files[0])
    setPhotoSrc(URL.createObjectURL(e.target.files[0]))

  }

  useEffect(() => {
    if (!isWeb3Enabled) {
      enableWeb3();
    }

    allCollections.fetch({
      onSuccess: (result) => {
        console.log('result all', result, result.length)

        if(result.length === 0) {
          setUserCollections(plans)
          return
        }
        const getCol: ((prevState: { name: string; image: string; }[]) => { name: string; image: string; }[]) | Moralis.Attributes[] = []

        result.map(col => {
          // @ts-ignore
          return  getCol.push(col.attributes)
        })
        // @ts-ignore
        setUserCollections(getCol)
      }
    })
    getUserModels()

  }, [])

  const getUserModels = () => {

   if(currentUserData.userNFT !== undefined) {
     const allModels = currentUserData.userNFT.split('*')
     // @ts-ignore
     setUserModels(allModels)
     // @ts-ignore
     setFilteredModels(allModels)

   }

  }


  const mintNFT = async (account: any, uri: string, img: string) => {
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
        // @ts-ignore
        const hash = result.hash
        // // @ts-ignore
        // setUserData({userCollections: {[selected.name]:  collectionData }})
        // @ts-ignore
        let userName
        let userId
        let address
        // @ts-ignore
        console.log('user', user.get("userName"))
        console.log('selectes', selected)
        if(user) {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              userName = user.get("userName"),
              userId =  user.get("objectId"),
              address = user.get("ethAddress")
        }
        // @ts-ignore
        const token = {
          name: itemName,
          unitymodel: model,
          userId: userId,
          userName: userName,
          ethAddress: address,
          category: category,
          isLiked:  false,
          description: itemDescription,
          link: userLink,
          collection: selected,
          royalties: royalties,
          sizeMb: sizeMb,
          price: price,
          propertie: propertie,
          onSale: onSale.toString(),
          instantSale: instantSale.toString(),
          unlock: unlock.toString(),
          hash: hash,
          externalUrl: uri,
          image: img,
          inStork: "20",
          likesNumber: '10',

        }

        const collectionData = {
          name: selected.name,
          userId: userId,
          userName: userName,
          ethAddress: address,
          unitymodel: model,
          image: selected.image,
          description: '',
          items: [token]
        }

        const checkCollection =  allCollections.fetch({
          onSuccess: (result) => {
            const  filteredCol = result.filter(item => {
              return item.attributes.name === selected.name
            })
            if(result.length === 0 || filteredCol.length == 0) {
              saveCollection(collectionData)
            } else {
              const items = filteredCol[0].attributes.items
              items.push(token)

              upDateCollectione(items)
            }
          }
        });
        console.log('checkCollection',checkCollection)
      },
      onError: (error) => {
        alert(error.message);
        setIsLoading(false)
      },
    });

  }
  const addNewCollection = () => {
    const colExist = userCollections.some(col => col.name == newCollection)
    if(collectionPhoto) {
      saveFile("photo.jpg", collectionPhoto, {
        type: "image/png",
        onSuccess: (result: any) => {

          if(newCollection.length > 0 && !colExist) {
            const newCol =  [{
              name: newCollection,
              image: result._url.length > 0 ?  result._url : nftsImgs[1],
            }]
            // @ts-ignore
            setSelected(newCol)
            setUserCollections(userCollections.concat(newCol))
            console.log(userCollections)
          } else {
            colExist ? alert("Pls,write a unique collection name")
                : alert("Pls,write collection name")
          }
        },
        onError: (error: any) => console.log('error',error),
      });
    }



  }
  const takePhoto = (e: any) => {
    setCollectionPhoto(e.target.files[0])

    setCollectionPhotoURL(URL.createObjectURL(e.target.files[0]))
  }


  const fetchTransactions = async () => {

    // get BSC transactions for a given address
    // with most recent transactions appearing first
    const options = {
      chain: "mumbai",
      address: currentUserData.ethAddress,
    };
    // @ts-ignore
    const bscTransactions = await Web3Api.account.getTransactions(options);
    console.log('bscTransactions',bscTransactions);
  };

  const saveCollection = async (collectionData: any) => {
    console.log('save data', collectionData)
    save(collectionData, {
      onSuccess: (data: any) => {
        // Execute any logic that should take place after the object is saved.
        console.log(data)

      },
      onError: (error: any) => {
        // Execute any logic that should take place if the save fails.
        // error is a Moralis.Error with an error code and message.
        alert("Failed to create new object, with error code: " + error.message);
      },
    });
  };

  const upDateCollectione = async(newItems: []) => {
    const checkCollections = Moralis.Object.extend('collections');
    const query = new Moralis.Query(checkCollections);
    query.equalTo("name", selected.name);
    const collection = await query.first();

    // @ts-ignore
    collection.set('items', newItems)
    // @ts-ignore
    await collection.save();

    console.log('col',collection);
  }


  const uploadFile = async (event: any) => {
    event.preventDefault();
    setIsLoading(true)
      const metadata = {
        name: itemName,
        category: category,
        isLiked:  false,
        description: itemDescription,
        link: userLink,
        collection: selected,
        royalties: royalties,
        sizeMb: sizeMb,
        price: price,
        propertie: propertie,
        onSale: onSale.toString(),
        instantSale: instantSale.toString(),
        unlock: unlock.toString(),
        creator: currentUserData.ethAddress,
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
      await mintNFT(account, nftResult[0].ipfs(),nftResult[1] );

    } catch (error: any) {
      setIsLoading(false)
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
      } else if (price.length == 0 ) {
        alert('Enter a price')
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
      category: category,
      collection: selected,
      creator: currentUserData.ethAddress,
      price: price,
      inStock: supply,
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
    return [ resultNft, imagePath];
  };

  const searchModels = (e: any) => {
    setShowModels(true )

    const filteredModels = userModels.filter(item => {
      const value = e.target.value.toLowerCase()
      // @ts-ignore
      return item.toLowerCase().search(value) !== -1
    })

    setFilteredModels(filteredModels)

    setModel(e.target.value)
  }



  // @ts-ignore
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
            <FormItem label="Your model">

              <form className="flex items-center mt-2">
                <label htmlFor="simple-search" className="sr-only">Search</label>
                <div className="relative w-full">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor"
                         viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"/>
                    </svg>
                  </div>
                  <input type="text" id="simple-search" className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-neutral-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                         placeholder="Select model"
                          value={model}
                         onChange={(e) => searchModels(e)}
                         onClick={() => showModels ?  setShowModels(false) : setShowModels(true ) }
                  />

                  {showModels &&  <ul  className=" h-auto max-h-[20em] z-20 absolute left-0 right-0 m-0 bg-gray-50 dark:bg-neutral-900  overflow-auto py-2  border border-neutral-200 dark:border-neutral-700 cursor-pointer focus:outline-none" >
                        {filteredModels.map((item, i) => {
                          return  <li key={i} onClick={() => [setModel(item), setShowModels(false)]} className=" text-white mt-3 bg-gray-50 dark:bg-neutral-900 px-6 py-5  pt-1 pb-1 bg-gray-50  cursor-pointer   hover:bg-neutral-100 dark:hover:bg-neutral-800" >{item}</li>
                        })}
                      </ul> }
                </div>
              </form>
            </FormItem>
            {/* ---- */}

            {/* ---- */}
            <FormItem label="Item Name">

              <Input defaultValue="NFT name"  onChange={(e) => setItemName(e.target.value)} />
            </FormItem>
            {/* ---- */}

            {/* ---- */}
            <FormItem label="Item Price">
              <Input defaultValue="100"   onChange={(e) => setPrice(e.target.value)} />
            </FormItem>
            {/* ---- */}

            <FormItem label="Choose category">
              <CategoryListBox setCategory={setCategory} />
            </FormItem>

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
              <h3 className="text-lg sm:text-2xl font-semibold mb-5">
                Choose an exiting collection or create a new one
              </h3>
              <Label>Choose collection</Label>
              <RadioGroup value={selected} onChange={setSelected}>
                <RadioGroup.Label className="sr-only">
                  Collections list
                </RadioGroup.Label>
                <div className="flex  overflow-auto py-2 space-x-4 customScrollBar">
                  {userCollections.map((plan, index) => (
                    <RadioGroup.Option
                      key={index}
                      value={plan}
                      className={({ active, checked }) =>
                        `${
                          active
                            ? "ring-2 ml-2 ring-offset-2 ring-offset-sky-300 ring-white ring-opacity-60"
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
                                      src={plan.image}
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

            <FormItem label="Create new collection">

              <div className="flex-shrink-0 flex items-start mb-4 mt-3">
                <div className="relative rounded-full overflow-hidden flex">
                  <Avatar profilePhoto={collectionPhotoURL|| nftsImgs[3]} sizeClass="w-32 h-32" />

                  <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
                    <svg
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                          d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                      />
                    </svg>

                    <span className="mt-1 text-xs">Change Image</span>
                  </div>
                  <input
                      type="file"
                      onChange={takePhoto}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>


              <Input onChange={(e) => setNewCollection(e.target.value)}   placeholder="Collection name" />

              <ButtonPrimary onClick={(e: void) => addNewCollection()} className="flex-1 mt-3" >Add collection</ButtonPrimary>
            </FormItem>


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

            <FormItem label="Supply">
              <Input placeholder="Number of copies"  onChange={(e) => seSupply(e.target.value)} />
            </FormItem>

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
