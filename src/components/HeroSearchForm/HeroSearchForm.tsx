import React, { FC } from "react";
import NftSearchForm from "./NftSearchForm";

export type SearchTab = "Buy" | "Rent" | "Sell";

export interface HeroSearchFormProps {
  className?: string;
  currentTab?: SearchTab;
}

const HeroSearchForm: FC<HeroSearchFormProps> = ({
  className = "",
  currentTab = "Buy",
}) => {
  const renderForm = () => {
    return <NftSearchForm />;
  };

  return (
    <div
      className={`nc-HeroSearchForm w-full max-w-6xl py-5 lg:py-0 ${className}`}
      data-nc-id="HeroSearchForm"
    >
      {renderForm()}
    </div>
  );
};

export default HeroSearchForm;
