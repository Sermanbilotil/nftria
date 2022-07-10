import mediaRunningReducer from "./mediaRunning/mediaRunning";
import getUserDataReducer from "./userData/getUserDataReducer";
import getAllDataReducer from "./allData/getAllDataReducer";

const rootReducers = {
  mediaRunning: mediaRunningReducer,
  userData: getUserDataReducer,
  allData: getAllDataReducer,
};

export default rootReducers;
