export type userResponse = {
  message: string;
};

export type userLists = {
  item: string;
  kind: string;
};
export type userListsResponse = {
  message: string;
  data: userLists[];
};

export type userData = {
  name: string;
  email: string;
  isAdmin: boolean;
  owned: userLists[];
  watchlist: userLists[];
  cart: userLists[];
};
