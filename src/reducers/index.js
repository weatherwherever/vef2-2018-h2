import { combineReducers } from "redux";
import auth from "./auth";
import register from "./register";
import books from "./books";
import bookAltering from "./bookAltering";
import getAllUsers from "./getAllUsers";

export default combineReducers({
  auth,
  register,
  books,
  bookAltering,
  getAllUsers
});
