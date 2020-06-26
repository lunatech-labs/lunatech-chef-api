import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { DishesReducer } from "./dishes/DishesReducer";
import { LocationsReducer } from "./locations/LocationsReducer";
import { MenusReducer } from "./menus/MenusReducer";
import { SchedulesReducer } from "./schedules/SchedulesReducer";
import { UsersReducer } from "./users/UsersReducer";

export const ConfigureStore = () => {
  const store = createStore(
    combineReducers({
      locations: LocationsReducer,
      dishes: DishesReducer,
      menus: MenusReducer,
      schedules: SchedulesReducer,
      userData: UsersReducer,
    }),
    applyMiddleware(thunk, logger)
  );
  return store;
};
