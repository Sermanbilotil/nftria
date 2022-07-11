import React, {FC, useEffect, useState} from "react";
import CardNFT from "components/CardNFT";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import HeaderFilterSection from "components/HeaderFilterSection";
import {useAppSelector} from "../../app/hooks";
import {selectCurrentAllData} from "../../app/allData/getAllDataReducer";
import CardNFT2 from "../../components/CardNFT2";

//
export interface SectionGridFeatureNFTProps {}

const SectionGridFeatureNFT: FC<SectionGridFeatureNFTProps> = () => {

    const [nftPage, setNftPage] = useState(1)
    const [nfts, setNfts] = useState([])

    const allNFT = useAppSelector(selectCurrentAllData);

  return (
    <div className="nc-SectionGridFeatureNFT relative">
      <HeaderFilterSection />
      <div
        className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 `}
      >
          {allNFT.nfts !== undefined && allNFT.nfts.map((item, index) => {

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
      <div className="flex mt-16 justify-center items-center">
        <ButtonSecondary onClick={() => setNftPage(nftPage + 1)} >Show me more</ButtonSecondary>
      </div>
    </div>
  );
};

export default SectionGridFeatureNFT;
