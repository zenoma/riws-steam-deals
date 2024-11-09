import React from "react";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import { SearchProvider, WithSearch } from "@elastic/react-search-ui";
import config from "./config";
import SearchLayout from "./components/SearchLayout";
import "./App.css";

export default function App() {
  return (
    <SearchProvider config={config}>
      <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
        {({ wasSearched }) => <SearchLayout wasSearched={wasSearched} />}
      </WithSearch>
    </SearchProvider>
  );
}

