import React, { FC, useState } from "react";
import { Helmet } from "react-helmet";
import {useAppSelector} from "../app/hooks";



import { Unity, useUnityContext } from "react-unity-webgl";


export interface PageSearchProps {
    className?: string;
}

const UnityApp: FC<PageSearchProps> = ({ className = "" }) => {

    const { unityProvider } = useUnityContext({
        productName: "React Unity",
        companyName: "NFTRIA",
        loaderUrl: "build/TestWebGL.loader.js",
        dataUrl: "build/TestWebGL.data",
        frameworkUrl: "build/TestWebGL.framework.js",
        codeUrl: "build/TestWebGL.loader.wasm",
        webglContextAttributes: {
            preserveDrawingBuffer: true,
        },
    });

    return (
        <div className={`nc-PageSearch  ${className}`} data-nc-id="PageSearch">
            <Helmet>
                <title>App || Nftria</title>
            </Helmet>

            <div
                className={`nc-HeadBackgroundCommon h-24 2xl:h-28 top-0 left-0 right-0 w-full bg-primary-50 dark:bg-neutral-800/20 `}
                data-nc-id="HeadBackgroundCommon"
            />
            <div className="container">

            </div>

            <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
                <main>

                    <Unity unityProvider={unityProvider} style={{ width: '100%', height: 600,  }} />

                </main>


                <div className="relative py-16 lg:py-28">

                </div>



            </div>
        </div>
    );
};

export default UnityApp;
