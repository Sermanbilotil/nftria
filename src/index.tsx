import React from "react";
import ReactDOM from "react-dom";
import './polyfill'
//
import "./styles/index.scss";
import "./index.css";
import "./fonts/line-awesome-1.3.0/css/line-awesome.css";
import "rc-slider/assets/index.css";

//
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {Provider} from "react-redux";
import {persistor, store} from "./app/store";
import {PersistGate} from "redux-persist/integration/react";
import {MoralisProvider} from "react-moralis";

ReactDOM.render(

        <MoralisProvider serverUrl="https://gxo6ck5wjopq.usemoralis.com:2053/server"
                         appId="h0KVrD5XXXT7pqwmZL7USCuNrdqiq2icJpwobjSq">
            <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App/>
            </PersistGate>
            </Provider>
        </MoralisProvider>
    ,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
