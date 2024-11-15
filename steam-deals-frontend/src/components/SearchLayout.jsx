import React from "react";
import { Layout, ErrorBoundary } from "@elastic/react-search-ui-views";
import SearchHeader from "./SearchHeader";
import SearchResults from "./SearchResults";
import SearchPaging from "./SearchPaging";
import SearchSidebar from "./SearchSidebar";

const SearchLayout = ({ wasSearched }) => (
  <ErrorBoundary>
    <Layout
      header={<SearchHeader />}
      sideContent={<SearchSidebar />}
      bodyContent={<SearchResults />}
      bodyFooter={<SearchPaging wasSearched={wasSearched} />}
    />
  </ErrorBoundary>
);

export default SearchLayout;
