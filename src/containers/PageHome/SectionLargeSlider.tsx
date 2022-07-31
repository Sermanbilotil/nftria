import CardLarge1 from "components/CardLarge1/CardLarge1";
import { nftsLargeImgs } from "contains/fakeData";
import React, { FC, useState } from "react";
import {useAppSelector} from "../../app/hooks";
import {selectCurrentAllData} from "../../app/allData/getAllDataReducer";
import {creatorState} from "../NftDetailPage/NftDetailPage";

export interface SectionLargeSliderProps {
  className?: string;
}

const SectionLargeSlider: FC<SectionLargeSliderProps> = ({
  className = "",
}) => {
  const allNFT = useAppSelector(selectCurrentAllData);

  const [indexActive, setIndexActive] = useState(0);


  const handleClickNext = () => {
    setIndexActive((state) => {
      if (state >= 2) {
        return 0;
      }
      return state + 1;
    });
  };

  const handleClickPrev = () => {
    setIndexActive((state) => {
      if (state === 0) {
        return 2;
      }
      return state - 1;
    });
  };



  return (
    <div className={`nc-SectionLargeSlider relative ${className}`}>
      {allNFT.nfts && allNFT.nfts.map((item: any, index: number) => {
        if(index < 3) {
            return  <CardLarge1
              data={item.metadataObj}
              key={index}
              isShowing={indexActive === index}
              featuredImgUrl={nftsLargeImgs[index]}
              onClickNext={handleClickNext}
              onClickPrev={handleClickPrev}
              />
            }
      })}
    </div>
  );
};

export default SectionLargeSlider;
