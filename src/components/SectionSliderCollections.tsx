import React, { FC, useEffect, useState } from "react";
import Heading from "components/Heading/Heading";
import Glide from "@glidejs/glide";
import CollectionCard from "./CollectionCard";
import CollectionCard2 from "./CollectionCard2";
import { Link } from "react-router-dom";
import {useAppSelector} from "../app/hooks";
import {selectCurrentAllData} from "../app/allData/getAllDataReducer";

export interface SectionSliderCollectionsProps {
  className?: string;
  itemClassName?: string;
  cardStyle?: "style1" | "style2";
}

const UNIQUE_CLASS = "glide_SectionSliderCollections_";
const OPTIONS: Glide.Options = {
  perView: 3,
  gap: 32,
  bound: true,
  breakpoints: {
    1280: {
      gap: 28,
      perView: 2.5,
    },
    1024: {
      gap: 20,
      perView: 2.15,
    },
    768: {
      gap: 20,
      perView: 1.5,
    },

    500: {
      gap: 20,
      perView: 1,
    },
  },
};

const SectionSliderCollections: FC<SectionSliderCollectionsProps> = ({
  className = "",
  cardStyle = "style1",
}) => {
  const allCollections = useAppSelector(selectCurrentAllData).collections;


  const [slider] = useState(new Glide(`.${UNIQUE_CLASS}`, OPTIONS));

  const [collections, setColeections] = useState([]);


  useEffect(() => {
    setColeections(allCollections)
  }, [allCollections]);

  useEffect(() => {
    setTimeout(() => {
      let moutedSlider = slider.mount();
      return () => moutedSlider.destroy();
    }, 600)
  }, [slider]);



  const MyCollectionCard =
    cardStyle === "style1" ? CollectionCard : CollectionCard2;

  return (
    <div className={`nc-SectionSliderCollections ${className}`}>
      <div className={`${UNIQUE_CLASS} flow-root`}>
        <Heading
          isCenter={false}
          hasNextPrev
          desc="Discover the new creative economy"
          rightPopoverText="last 7 days"
        >
          Top collections
        </Heading>
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {collections.map((card: any, i: number) => {

              return <li  key={i} className={`glide__slide`}>
                <MyCollectionCard
                    imgs={[
                      card.image,
                      card.image,
                      card.image,
                      card.image,
                    ]}
                    name={card.name}
                    userName={card.userName}
                    items={card.items}
                />
              </li>
            })}
            <li className={`glide__slide   `}>
              <Link to={"/page-search"} className="block relative group">
                <div className="relative rounded-2xl overflow-hidden h-[410px]">
                  <div className="h-[410px] bg-black/5 dark:bg-neutral-800"></div>
                  <div className="absolute inset-y-6 inset-x-10  flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center relative">
                      <span className="text-xl font-semibold">Collections</span>
                      <svg
                        className="absolute left-full w-5 h-5 ml-2 rotate-45 group-hover:scale-110 transition-transform"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.0701 9.57L12.0001 3.5L5.93005 9.57"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 20.4999V3.66992"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-sm mt-1">Show me more</span>
                  </div>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SectionSliderCollections;
