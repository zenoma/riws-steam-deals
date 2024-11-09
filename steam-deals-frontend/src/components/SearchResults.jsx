import React from "react";
import { Results } from "@elastic/react-search-ui";
import CustomResultView from "./CustomResultView";

const SearchResults = () => (
  <Results
    titleField="title"
    urlField="url"
    thumbnailField="img_url"
    shouldTrackClickThrough
    resultView={CustomResultView}
 />
);

export default SearchResults;
