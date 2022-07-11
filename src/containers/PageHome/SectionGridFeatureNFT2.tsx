import React, {FC, useState} from "react";
import HeaderFilterSection from "components/HeaderFilterSection";
import CardNFT2 from "components/CardNFT2";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import {useAppSelector} from "../../app/hooks";
import {selectCurrentAllData} from "../../app/allData/getAllDataReducer";
import CardNFT from "../../components/CardNFT";

//
export interface SectionGridFeatureNFT2Props {}

const SectionGridFeatureNFT2: FC<SectionGridFeatureNFT2Props> = () => {
    const [nftPage, setNftPage] = useState(1)
    const [nfts, setNfts] = useState([])

    const allNFT = useAppSelector(selectCurrentAllData);

  return (
    <div className="nc-SectionGridFeatureNFT2 relative">
      <HeaderFilterSection />
      <div className={`grid gap-6 lg:gap-8 sm:grid-cols-2 xl:grid-cols-3`}>
          {allNFT.nfts !== undefined && allNFT.nfts.map((item, index) => {

              if(item !== undefined && index < nftPage * 6) {
                  const nft = item.metadataObj
                  return nft !== undefined &&  <CardNFT2
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
        <ButtonPrimary onClick={() => setNftPage(nftPage + 1)} >Show me more</ButtonPrimary>
      </div>
    </div>
  );
};

export default SectionGridFeatureNFT2;
