import React from "react";

export default function Loading() {
  return (
    <div className="market_multi_throbber">
      <div className="LoadingWrapper">
        <div className="LoadingThrobber">
          <div className="Bar Bar1" />
          <div className="Bar Bar2" />
          <div className="Bar Bar3" />
        </div>
      </div>
    </div>
  );
}