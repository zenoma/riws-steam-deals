import React from "react";
import PropTypes from "prop-types";
import "./CustomResultView.css";

const CustomResultView = ({ result }) => {
  return (
    <div className="custom-result">
      <a href={result.url.raw} target="_blank" rel="noopener noreferrer" className="result-link">
        <div className="result-image-container">
          <img
            src={result.img_url.raw || "default-image.jpg"}
            alt={result.title.raw}
            className="result-image"
          />
        </div>
        <div className="result-details">
          <h3 className="result-title">{result.title.raw || "Unknown Title"}</h3>
          <p className="result-release-date">
            <span className="text-label">Release Date:</span>{" "}
            <span className="text-value">
              {result.release_year.raw
                ? `${result.release_day_month.raw} ${result.release_year.raw}`
                : "Not available"}
            </span>
          </p>

          <div className="result-info-blocks">
            <div className="result-reviews">
              <p>
                <span className="text-label">Review Summary:</span>{" "}
                <span className="text-value">{result.review_summary?.raw || "No reviews"}</span>
              </p>
              <p>
                <span className="text-label">Positive Reviews:</span>{" "}
                <span className="text-value">{result.positive_review_pct?.raw || "N/A"}%</span>
              </p>
              <p>
                <span className="text-label">Total Reviews:</span>{" "}
                <span className="text-value">{result.review_count?.raw || 1}</span>
              </p>
            </div>

            <div className="result-prices">
              <p>
                <span className="text-label">Original Price:</span>{" "}
                <span className="text-value">{result.original_price?.raw || "N/A"}</span>
              </p>
              <p className="result-discount">
                <span className="text-label">Discount:</span>{" "}
                <span className="text-value">{result.discount_pct?.raw || 1}%</span>
              </p>
              <p className="result-final-price">
                <span className="text-label">Final Price:</span>{" "}
                <span className="text-value">{result.final_price?.raw ? `${result.final_price.raw}€` : "N/A"}</span>
              </p>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

CustomResultView.propTypes = {
  result: PropTypes.object.isRequired,
};

export default CustomResultView;

