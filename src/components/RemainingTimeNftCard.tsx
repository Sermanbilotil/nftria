import React, { FC } from "react";

interface Props {
  className?: string;
  contentClassName?: string;
}

const RemainingTimeNftCard: FC<Props> = ({
  className = "absolute top-[-0.2px] right-[-0.2px] flex items-center",
  contentClassName = "right-5 top-1/2 -translate-y-1/2",
}) => {
  return (
    <div className={className}>
      <svg
        className="text-white dark:text-neutral-900 w-44 md:w-[195px]"
        viewBox="0 0 195 55"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M195 55V0H0.163376C8.64729 0 16.5008 4.47914 20.8201 11.7812L39.4159 43.2188C43.7352 50.5209 51.5887 55 60.0726 55H195Z"
          fill="currentColor"
        />
      </svg>

      <div className={`absolute ${contentClassName}`}>
        <span className="block text-xs text-neutral-500 dark:text-neutral-400 tracking-wide">
          Remaining time
        </span>
        <span className="block md:text-lg font-semibold">3h : 15m : 20s</span>
      </div>
    </div>
  );
};

export default RemainingTimeNftCard;
