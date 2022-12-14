// @ts-nocheck

import React, {FC, useEffect, useState} from "react";
import { Helmet } from "react-helmet";

export interface PageSearchProps {
    className?: string;
}

const UnityApp: FC<PageSearchProps> = ({ className = "" }) => {
        const height = window.innerHeight
    // const unityContext = new UnityContext({
    //     productName: "React Unity",
    //     companyName: "NFTRIA",
    //     loaderUrl: "Build/TestWebGL.loader.js",
    //     dataUrl: "Build/TestWebGL.data",
    //     frameworkUrl: "Build/TestWebGL.framework.js",
    //     codeUrl: "Build/TestWebGL.loader.wasm",
    //     streamingAssetsUrl: "StreamingAssets",
    // });
    const [progression, setProgression] = useState(0);
    const [didError, setDidError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // useEffect(function () {
    //     unityContext.on("error", function (message) {
    //         setDidError(true);
    //         setErrorMessage(message);
    //         console.log('error msg',  message)
    //     });
    // }, []);
    //
    // useEffect(function () {
    //     unityContext.on("progress", function (progression) {
    //         setProgression(progression);
    //     });
    // }, []);


  useEffect(() => {
      let container = document.querySelector("#unity-container");
      let canvas = document.querySelector("#unity-canvas");
      let loadingBar = document.querySelector("#unity-loading-bar");
      let progressBarFull = document.querySelector("#unity-progress-bar-full");
      let fullscreenButton = document.querySelector("#unity-fullscreen-button");
      let warningBanner = document.querySelector("#unity-warning");

      // Shows a temporary message banner/ribbon for a few seconds, or
      // a permanent error message on top of the canvas if type=='error'.
      // If type=='warning', a yellow highlight color is used.
      // Modify or remove this function to customize the visually presented
      // way that non-critical warnings and error messages are presented to the
      // user.
      function unityShowBanner(msg, type) {
          function updateBannerVisibility() {
              warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
          }
          var div = document.createElement('div');
          div.innerHTML = msg;
          warningBanner.appendChild(div);
          if (type == 'error') div.style = 'background: red; padding: 10px;';
          else {
              if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
              setTimeout(function() {
                  warningBanner.removeChild(div);
                  updateBannerVisibility();
              }, 5000);
          }
          updateBannerVisibility();
      }

      let buildUrl = "build";
      let loaderUrl = buildUrl + "/TestWebGL.loader.js";
      let config = {
          dataUrl: buildUrl + "/TestWebGL.data",
          frameworkUrl: buildUrl + "/TestWebGL.framework.js",
          codeUrl: buildUrl + "/TestWebGL.wasm",
          streamingAssetsUrl: "StreamingAssets",
          companyName: "DefaultCompany",
          productName: "WebGL Test",
          productVersion: "0.1",
          showBanner: unityShowBanner,
      };

      // By default Unity keeps WebGL canvas render target size matched with
      // the DOM size of the canvas element (scaled by window.devicePixelRatio)
      // Set this to false if you want to decouple this synchronization from
      // happening inside the engine, and you would instead like to size up
      // the canvas DOM size and WebGL render target sizes yourself.
      // config.matchWebGLToCanvasSize = false;

      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
          container.className = "unity-mobile";
          // Avoid draining fillrate performance on mobile devices,
          // and default/override low DPI mode on mobile browsers.
          config.devicePixelRatio = 1;
          unityShowBanner('WebGL builds are not supported on mobile devices.');
      } else {
          canvas.style.width = "100%";
          canvas.style.height = "750px";
      }
      loadingBar.style.display = "block";

      let script = document.createElement("script");
      script.src = loaderUrl;
      script.onload = () => {
          createUnityInstance(canvas, config, (progress) => {
              progressBarFull.style.width = 100 * progress + "%";
          }).then((unityInstance) => {
              loadingBar.style.display = "none";
              fullscreenButton.onclick = () => {
                  unityInstance.SetFullscreen(1);
              };
          }).catch((message) => {
              alert(message);
          });
      };
      document.body.appendChild(script);
  }, [])


    return (
        <div className={`nc-PageSearch  ${className}`} data-nc-id="PageSearch">

            <Helmet>
                <title>App || Nftria</title>
            </Helmet>


            <div className="container  py-16 lg:pb-28  pr-0 pl-0 lg:pt-10 space-y-16 lg:space-y-28">
                <main>
                    <div id="unity-container" className="unity-desktop">
                        <canvas id="unity-canvas" width={"100%"} height={height}></canvas>
                    <div id="unity-loading-bar">
                        <div id="unity-logo"></div>
                        <div id="unity-progress-bar-empty">
                            <div id="unity-progress-bar-full"></div>
                        </div>
                    </div>
                    <div id="unity-warning"> </div>
                    <div id="unity-footer">
                        <div id="unity-webgl-logo"></div>
                        <div id="unity-fullscreen-button"></div>

                    </div>
            </div>
                </main>

            </div>
        </div>
    );
};

export default UnityApp;
