import React, { FC } from "react";

export interface LabelProps {
  className?: string;
}

const Label: FC<LabelProps> = ({ className = "", children }) => {
  return (
    <label
      className={`nc-Label text-base font-medium text-neutral-900 dark:text-neutral-200 ${className}`}
      data-nc-id="Label"
    >
      {children}
    </label>
  );
};

export default Label;
