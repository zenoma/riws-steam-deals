import ElasticsearchConnector from "@elastic/search-ui-elasticsearch-connector";

const connector = new ElasticsearchConnector({
  host: "http://localhost:9200",
  index: "steam_deals",
});

const config = {
  alwaysSearchOnInitialLoad: true,
  apiConnector: connector,
  hasA11yNotifications: true,
  searchQuery: {
    result_fields: {
      title: { raw: {} },
      url: { raw: {} },
      release_day_month: { raw: {} },
      release_year: { raw: {} },
      review_summary: { raw: {} },
      positive_review_pct: { raw: {} },
      review_count: { raw: {} },
      original_price: { raw: {} },
      discount_pct: { raw: {} },
      final_price: { raw: {} },
      img_url: { raw: {} },
    },
    search_fields: {
      title: {},
    },
    disjunctiveFacets: ["release_year", "discount_pct", "positive_review_pct", "final_price"],
    facets: {
      release_year: { type: "value", size: 30 },
      discount_pct: { type: "value", size: 10 },
      positive_review_pct: { type: "value", size: 10 },
      final_price: {
        type: "range",
        ranges: [
          { from: 0, to: 10, name: "<10€" },
          { from: 10, to: 20, name: "10€ - 20€" },
          { from: 20, to: 30, name: "20€ - 30€" },
          { from: 30, to: 40, name: "30€ - 40€" },
          { from: 40, to: 50, name: "40€ - 50€" },
          { from: 50, to: 60, name: "50€ - 60€" },
          { from: 60, to: 70, name: "60€ - 70€" },
          { from: 70, to: 80, name: "70€ - 80€" },
          { from: 80, to: 90, name: "80€ - 90€" },
          { from: 90, to: 100, name: "90€ - 100€" },
          { from: 100, to: 10000, name: ">100€" },
        ]
      },
    },
  },
};

export default config;

