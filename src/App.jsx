// import React from 'react';
import { useState } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  // async () => {
  //   // see the note below on how to choose currentWindow or lastFocusedWindow
  //   const [tab] = await chrome.tabs.query({
  //     active: true,
  //     lastFocusedWindow: true,
  //   });
  //   setUrl(tab.url);
  //   // ..........
  // };
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    setUrl(tab.url);
  });
  chrome.tabs.onCreated.addListener(function (tab) {
    setUrl(tab.url);
  });
  chrome.tabs.onActivated.addListener(function (info) {
    chrome.tabs.get(info.tabId, function (tab) {
      setUrl(tab.url);
    });
  });
  return (
    <div className="container">
      <header className="header">
        <div className="logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M272 96c-78.6 0-145.1 51.5-167.7 122.5c33.6-17 71.5-26.5 111.7-26.5h88c8.8 0 16 7.2 16 16s-7.2 16-16 16H288 216s0 0 0 0c-16.6 0-32.7 1.9-48.3 5.4c-25.9 5.9-49.9 16.4-71.4 30.7c0 0 0 0 0 0C38.3 298.8 0 364.9 0 440v16c0 13.3 10.7 24 24 24s24-10.7 24-24V440c0-48.7 20.7-92.5 53.8-123.2C121.6 392.3 190.3 448 272 448l1 0c132.1-.7 239-130.9 239-291.4c0-42.6-7.5-83.1-21.1-119.6c-2.6-6.9-12.7-6.6-16.2-.1C455.9 72.1 418.7 96 376 96L272 96z" />
          </svg>
        </div>
        <div className="title">EcoSomethingIdk</div>
      </header>

      <div className="product-title">product title</div>

      <div className="product-container">
        <img
          className="image"
          src="https://cdn11.bigcommerce.com/s-lzx6le/images/stencil/1280x1280/products/1241/2902/167398L__04164.1557610883.jpg?c=2"
          alt=""
        />
        <div className="description">
          This product has yet to be implemented! url: {url}
        </div>
        <div className="materials">
          <div className="material">lolol</div>
        </div>
        <div>Sus score: 0</div>
      </div>

      <div className="rating">
        <div className="rating-circle yellow">
          <div className="rating-message">Maybe</div>
        </div>
      </div>

      <div className="alternatives">
        <div className="alternative-block">
          <img className="alternative-image" src="" alt="" />
          <div className="alternative-text"></div>
        </div>
        <div className="alternative-block"></div>
        <div className="alternative-block"></div>
        <div className="alternative-block"></div>
        <div className="alternative-block"></div>
      </div>
    </div>
  );
}

export default App;
