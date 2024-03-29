import api from "../api";

export const BOOK_REQUEST = "BOOK_REQUEST";
export const BOOK_SUCCESS = "BOOK_SUCCESS";
export const BOOK_ERROR = "BOOK_ERROR";
export const BOOK_SEARCH = "BOOK_SEARCH";
export const BOOK_ADDREAD = "BOOK_ADDREAD";
export const BOOK_ADDREAD_ERROR = "BOOK_ADDREAD_ERROR";
export const BOOK_ADDREAD_SUCCESS = "BOOK_ADDREAD_SUCCESS";
export const BOOK_GETREAD = "BOOK_GETREAD";
export const BOOK_GETREAD_SUCCESS = "BOOK_GETREAD_SUCCESS";
export const BOOK_GETREAD_ERROR = "BOOK_GETREAD_ERROR";

function searchBooks(search) {
  return {
    type: BOOK_SEARCH,
    isFetching: true,
    message: null,
    searchUrl: search,
    books: null
  };
}

function requestBooks() {
  return {
    type: BOOK_REQUEST,
    isFetching: true,
    message: null,
    books: null
  };
}

function bookSuccess(books, search, singleBook) {
  return {
    type: BOOK_SUCCESS,
    isFetching: false,
    books,
    singleBook,
    searchUrl: search,
    message: null
  };
}

function bookError(message) {
  return {
    type: BOOK_ERROR,
    isFetching: false,
    book: null,
    message
  };
}

function requestAddBook() {
  return {
    type: BOOK_ADDREAD,
    isFetching: true,
    message: null
  };
}

function addBookSuccess() {
  return {
    type: BOOK_ADDREAD_SUCCESS,
    isFetching: false,
    message: null
  };
}
function bookAddReadError(message) {
  return {
    type: BOOK_ADDREAD_ERROR,
    isFetching: false,
    message
  };
}

function getReadsSuccess(reviews) {
  return {
    type: BOOK_GETREAD_SUCCESS,
    isFetching: false,
    message: null,
    reviews
  };
}

function getReadsError(message) {
  return {
    type: BOOK_GETREAD_ERROR,
    isFetching: false,
    message,
    review: null
  };
}

export const addReadBook = (values, endpoint) => {
  return async dispatch => {
    dispatch(requestAddBook());
    try {
      const data = await api.post(values, endpoint);
      dispatch(addBookSuccess(data));
    } catch (e) {
      dispatch(bookAddReadError(e));
    }
  };
};

export const getRead = endpoint => {
  return async dispatch => {
    dispatch(requestAddBook());
    try {
      const data = await api.get(endpoint);
      dispatch(getReadsSuccess(data));
    } catch (e) {
      dispatch(getReadsError(e));
    }
  };
};

export const deleteRead = (id, endpoint) => {
  return async dispatch => {
    dispatch(requestAddBook());

    try {
      await api.deleteRead(id, endpoint);

      const data = await api.get("users/me/read");
      dispatch(getReadsSuccess(data));
    } catch (e) {
      dispatch(getReadsError(e));
    }
  };
};

export const fetchBooks = (endpoint, search, shouldGetOneBook) => {
  return async dispatch => {
    dispatch(requestBooks());
    dispatch(searchBooks(search));

    try {
      const data = await api.get(endpoint, `?${search}`);
      shouldGetOneBook
        ? dispatch(bookSuccess(null, search, data))
        : dispatch(bookSuccess(data, search));
    } catch (e) {
      dispatch(bookError(e));
    }
  };
};
