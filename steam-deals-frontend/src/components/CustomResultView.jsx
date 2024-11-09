import React from "react";
import PropTypes from "prop-types";
import "./CustomResultView.css";

const CustomResultView = ({ result }) => {
  return (
    <div>
      <a className="custom-result" href={result.url.raw} target="_blank" rel="noopener noreferrer">
    <div>
        <img
          src={result.img_url.raw || "default-image.jpg"}
          alt={result.title.raw}
          className="result-image"
        />
    </div>
      <div className="result-content">
        <h3 className="result-title">{result.title.raw}</h3>
        <p className="result-release-date">
          Release Date: {result.release_date?.raw || "Not available"}
        </p>
        <p className="result-review-summary">
          Review Summary: {result.review_summary?.raw || "No reviews"}
        </p>
        <p className="result-positive-review-pct">
          Positive Reviews: {result.positive_review_pct?.raw || "N/A"}%
        </p>
        <p className="result-review-count">
          Total Reviews: {result.review_count?.raw || 0}
        </p>
        <p className="result-original-price">
          Original Price: {result.original_price?.raw ? `${result.original_price.raw}` : "N/A"}
        </p>
        <p className="result-discount-pct">
          Discount: {result.discount_pct?.raw || 0}%
        </p>
        <p className="result-final-price">
          Final Price: {result.final_price?.raw ? `${result.final_price.raw}€` : "N/A"}
        </p>
      </div>
      </a>
    </div>
  );
};

CustomResultView.propTypes = {
  result: PropTypes.object.isRequired,
};

export default CustomResultView;
