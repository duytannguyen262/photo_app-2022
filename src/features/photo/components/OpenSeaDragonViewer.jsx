/* eslint-disable react-hooks/exhaustive-deps */
import OpenSeaDragon from "openseadragon";
import React, { useEffect, useState } from "react";

const OpenSeaDragonViewer = ({ photoId, photoResolution }) => {
  const [viewer, setViewer] = useState(null);

  const InitOpenseadragon = (w, h) => {
    viewer && viewer.destroy();
    setViewer(
      OpenSeaDragon({
        id: "openSeaDragon",
        prefixUrl: "//openseadragon.github.io/openseadragon/images/",
        tileSources: {
          Image: {
            xmlns: "https://schemas.microsoft.com/deepzoom/2008",
            Url: `http://localhost:5000/api/photos/deep/${photoId}/`,
            Format: "jpeg",
            Overlap: "0",
            TileSize: "256",
            Size: {
              Width: `${w}`,
              Height: `${h}`,
            },
          },
        },
        animationTime: 0.5,
        blendTime: 0.1,
        constrainDuringPan: true,
        maxZoomPixelRatio: 2,
        // minZoomLevel: 1,
        visibilityRatio: 1,
        zoomPerScroll: 2,
      })
    );
  };
  useEffect(() => {
    if (photoResolution) {
      const [width, height] = photoResolution.split("x");
      InitOpenseadragon(width, height);
    }
    return () => {
      viewer && viewer.destroy();
    };
  }, []);

  return (
    <div
      id="openSeaDragon"
      style={{
        height: "50rem",
        width: "100%",
        margin: "3rem auto",
        backgroundColor: "black",
      }}
    ></div>
  );
};
export { OpenSeaDragonViewer };
