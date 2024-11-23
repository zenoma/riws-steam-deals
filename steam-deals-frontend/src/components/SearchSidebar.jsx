import React from "react";
import { Facet } from "@elastic/react-search-ui";
import { MultiCheckboxFacet } from "@elastic/react-search-ui-views";

const SearchSidebar = () => (

  <div>
    <h3>Facets</h3>

    <Facet
      field="final_price"
      label="Final Price"
      view={MultiCheckboxFacet}
      filterType="any"
      key="final_price"
    />

    <Facet
      field="release_year"
      label="Release Year"
      view={MultiCheckboxFacet}
      filterType="any"
      key="release_year"
    />

    <Facet
      field="discount_pct"
      label="Discount Percentage (%)"
      view={MultiCheckboxFacet}
      filterType="any"
      key="discount_pct"
    />

    <Facet
      field="positive_review_pct"
      label="Positive Review Count (%)"
      view={MultiCheckboxFacet}
      filterType="any"
      key="positive_review_pct"
    />
  </div>

);

export default SearchSidebar;
