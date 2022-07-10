import React, { FC } from "react";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/solid";
import ButtonDropdown from "./ButtonDropdown";

export interface CategoryListBoxProps {
    className?: string;
    setCategory?: (active: string) => void;
}

const lists = [
    { name: "Animals & Pets" },
    { name: "Architecture" },
    { name: "Art & Abstract" },
    { name: "Cars & Vehicles" },
    { name: "Cultural Heritage & History" },
    { name: "Electronics & Gadgets" },
    { name: "Fashion & Style" },
    { name: "Food & Drink" },
    { name: "Furniture & Home" },
    { name: "Nature & Plants" },
    { name: "News & Politics" },
    { name: "People" },
    { name: "Places & Travel" },
    { name: "Science & Technology" },
    { name: "Sports & Fitness" },
    { name: "Weapons & Military" },
];

const CategoryListBox: FC<CategoryListBoxProps> = ({
                                                       setCategory,
                                                                 className = "",

                                                             }) => {
    const [selected, setSelected] = useState(lists[0]);



    const changeCategory = (value?: {}) => {
        // @ts-ignore
        setSelected(value)

        if(setCategory !== undefined) {
            // @ts-ignore
                setCategory(value)
        }

    }


    return (
        <div
            className={`md:w-[100%]`}
            data-nc-id="ArchiveFilterListBox"
        >
            <Listbox value={selected} onChange={(v: {}) => changeCategory(v)}>
                <div className="relative md:min-w-[200px]">
                    <Listbox.Button as={"div"}>
                        <ButtonDropdown>{selected.name}</ButtonDropdown>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute  z-20 w-[100%] max-h-[22rem] py-1 mt-1 overflow-auto text-sm text-neutral-900 dark:text-neutral-200 bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-900 dark:ring-neutral-700">
                            {lists.map((item, index: number) => (
                                <Listbox.Option
                                    key={index}
                                    className={({ active }) =>
                                        `${
                                            active
                                                ? "text-primary-700 dark:text-neutral-200 bg-primary-50 dark:bg-neutral-700"
                                                : ""
                                        } cursor-default select-none relative py-2 pl-10 pr-4`
                                    }
                                    value={item}
                                >
                                    {({ selected }) => (
                                        <>
                      <span
                          className={`${
                              selected ? "font-medium" : "font-normal"
                          } block truncate`}
                      >
                        {item.name}
                      </span>
                                            {selected ? (
                                                <span className="text-primary-700 absolute inset-y-0 left-0 flex items-center pl-3 dark:text-neutral-200">
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                                            ) : null}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
};

export default CategoryListBox;
