import React from 'react';
import BarLoader from "react-spinners/BarLoader";
import image1 from "./IMAGE/ordinateur.png";
import image4 from "./IMAGE/ordinateur2.png";
import image2 from "./IMAGE/deuxpc.png";
import image3 from "./IMAGE/cadenas.png";

const TEXTS = ["Welcome to Transfereo", "connecting...", "Send any file"];
const IMAGES = [image1, image2, image4];

const LoadingPage = ({ textIndex, imageIndex }) => {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <img
        src={IMAGES[imageIndex % IMAGES.length]}
        className={imageIndex === 0 ? 'image1' : 'image2'}
        alt=""
      />
      <div className="mt-4 text-center">
        <BarLoader color="#1C27CA" width="100%" />
        <div className="section_text mt-3">
          <h1 className="h4">
            {TEXTS[textIndex % TEXTS.length]}
          </h1>
          <h5 className="text-muted d-flex justify-content-center align-items-center mt-2">
            <img
              src={image3}
              width="18"
              height="18"
              alt=""
              className="me-2"
            />
            End-to-end secure
          </h5>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
