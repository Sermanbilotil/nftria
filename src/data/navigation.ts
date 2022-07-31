import { NavItemType } from "shared/Navigation/NavigationItem";
import ncNanoId from "utils/ncNanoId";

const otherPageChildMenus: NavItemType[] = [


  {
    id: ncNanoId(),
    href: "/page-search",
    name: "Search page",
  },
  {
    id: ncNanoId(),
    href: "/page-upload-item",
    name: "Upload Item",
  },
  {
    id: ncNanoId(),
    href: "/connect-wallet",
    name: "Connect Wallet",
  },

  {
    id: ncNanoId(),
    href: "/blog",
    name: "Blog Page",
    type: "dropdown",
    children: [
      {
        id: ncNanoId(),
        href: "/blog",
        name: "Blog Page",
      },
      {
        id: ncNanoId(),
        href: "/blog-single",
        name: "Blog Single",
      },
    ],
  },
];

export const NAVIGATION_DEMO_2: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "#",
    name: "Discover",
    type: "dropdown",
    children: otherPageChildMenus,
  },
  // {
  //   id: ncNanoId(),
  //   href: "/#",
  //   name: "Help center",
  // },
];
