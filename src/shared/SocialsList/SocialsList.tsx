import { SocialType } from "shared/SocialsShare/SocialsShare";
import React, { FC } from "react";
import facebookIcon from "images/socials/facebook.svg";
import twitterIcon from "images/socials/twitter.svg";
import telegramIcon from "images/socials/telegram.svg";
import youtubeIcon from "images/socials/youtube.svg";
import {useAppSelector} from "../../app/hooks";
import {selectCurrentUserData} from "../../app/userData/getUserDataReducer";

export interface SocialsListProps {
  className?: string;
  itemClass?: string;
  socials?: SocialType[];
  facebook?: string
  twitter?: string,
  telegram?: string,
}




const SocialsList: FC<SocialsListProps> = ({
  className = "",
  itemClass = "block w-6 h-6",
  facebook= '',
    twitter= '',
    telegram= '',
}) => {

  const currentUserData = useAppSelector(selectCurrentUserData);

  const  socials = [
    { name: "Facebook", icon: facebookIcon, href: facebook },
    { name: "Twitter", icon: twitterIcon, href: twitter },
    // { name: "Youtube", icon: youtubeIcon, href: '#'},
    { name: "Telegram", icon: telegramIcon, href: telegram },
  ];


  return (
    <nav
      className={`nc-SocialsList flex space-x-2.5 text-2xl text-neutral-6000 dark:text-neutral-300 ${className}`}
      data-nc-id="SocialsList"
    >
      {socials.map((item, i) => (
        <a
          key={i}
          className={`${itemClass}`}
          href={item.href?.includes('https://') ? item.href : 'https://' + item.href }
          target="_blank"
          rel="noopener noreferrer"
          title={item.name}
        >
          <img src={item.icon} alt="" />
        </a>
      ))}
    </nav>
  );
};

export default SocialsList;
