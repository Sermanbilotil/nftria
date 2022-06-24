import React, { FC } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";



export interface AccordionProps {
    description?: string,
    id?: string,
    address?: string,
}

const AccordionInfo: FC<AccordionProps> = ({description, id, address}) => {
  return (
    <div className="w-full rounded-2xl">
      <Disclosure defaultOpen>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between w-full px-4 py-2 font-medium text-left bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-500 rounded-lg hover:bg-neutral-200 focus:outline-none focus-visible:ring focus-visible:ring-neutral-500 focus-visible:ring-opacity-75">
              <span>Descriptions</span>
              <ChevronUpIcon
                className={`${
                  open ? "transform rotate-180" : ""
                } w-5 h-5 text-neutral-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel
              className="px-4 pt-4 pb-2 text-neutral-500 text-sm dark:text-neutral-400"
              as="p"
            >
                {description}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <Disclosure defaultOpen as="div" className="mt-5 md:mt-8">
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between w-full px-4 py-2 font-medium text-left bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-500 rounded-lg hover:bg-neutral-200 focus:outline-none focus-visible:ring focus-visible:ring-neutral-500 focus-visible:ring-opacity-75">
              <span>Details</span>
              <ChevronUpIcon
                className={`${
                  open ? "transform rotate-180" : ""
                } w-5 h-5 text-neutral-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 flex flex-col text-xs text-neutral-500 dark:text-neutral-400 overflow-hidden">
              <span>2000 x 2000 px.IMAGE(685KB)</span>
              <br />
              <span>Contract Address</span>
              <span className="text-base text-neutral-900 dark:text-neutral-100 line-clamp-1">
                {address}
              </span>

              <br />
              <span>Token ID</span>
              <span className="text-base text-neutral-900 dark:text-neutral-100">
             {id}
              </span>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}


export default AccordionInfo
