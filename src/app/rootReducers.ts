import mediaRunningReducer from "./mediaRunning/mediaRunning";
import getUserDataReducer from "./userData/getUserDataReducer";

const rootReducers = {
  mediaRunning: mediaRunningReducer,
  userData: getUserDataReducer,
};

export default rootReducers;
