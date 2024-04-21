/* eslint-disable react/prop-types */
import "./AlternativeBlock.css";

function AlternativeBlock({ imgLink, imgAlt, description, price, blockLink }) {
  return (
    <div className="alterative-block">
      <img
        className="alternative-image"
        src={imgLink}
        alt={imgAlt ? imgAlt : "an image"}
      />
      <p className="alternative-description">{description}</p>
      <p className="alternative-price">${price}</p>
      <a
        className="alternative-block-link"
        href={blockLink}
        target="_blank"
        rel="noopener noreferrer"
      ></a>
    </div>
  );
}

export default AlternativeBlock;
