import React from "react";
import { PagingInfo, ResultsPerPage, Paging } from "@elastic/react-search-ui";

const SearchPaging = ({ wasSearched }) => (
  <>
    {wasSearched && <PagingInfo />}
    {wasSearched && <ResultsPerPage />}
    <Paging />
  </>
);

export default SearchPaging;
