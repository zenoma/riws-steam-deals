import React from "react";
import { SearchBox } from "@elastic/react-search-ui";

const SearchHeader = () => {
  return (
    <SearchBox debounceLength={0} />
  )};

export default SearchHeader;
