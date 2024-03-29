import React, { Component } from "react";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { fetchBooks, addReadBook } from "../../actions/books";
import Button from "../../components/button";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import "./Book.css";
import PropTypes from "prop-types";

class Book extends Component {
  static propTypes = {
    book: PropTypes.shape({
      author: PropTypes.string,
      category: PropTypes.number,
      categorytitle: PropTypes.string,
      description: PropTypes.string,
      id: PropTypes.number,
      isbn10: PropTypes.string,
      isbn13: PropTypes.string,
      language: PropTypes.string,
      pagecount: PropTypes.stirng,
      published: PropTypes.string,
      title: PropTypes.string
    }),
    dispatch: PropTypes.func,
    history: PropTypes.shape({
      action: PropTypes.string,
      block: PropTypes.func,
      createHref: PropTypes.func,
      go: PropTypes.func,
      goBack: PropTypes.func,
      goForward: PropTypes.func,
      length: PropTypes.number,
      listen: PropTypes.func
    }),
    location: PropTypes.shape({
      hash: PropTypes.string,
      key: PropTypes.string,
      pathname: PropTypes.string,
      search: PropTypes.string
    }),
    match: PropTypes.shape({
      path: PropTypes.string,
      url: PropTypes.string,
      isExact: PropTypes.bool,
      params: PropTypes.shape({
        id: PropTypes.string
      })
    }),
    message: PropTypes.array
  };
  state = { addRead: false, rating: 1, review: "" };
  async componentDidMount() {
    this.props.dispatch(
      fetchBooks(`books/${this.props.match.params.id}`, null, true)
    );
  }

  onClickRead = e => {
    this.setState({ addRead: true });
  };
  closeReview = e => {
    this.setState({ addRead: false });
  };
  onClickBack = e => {
    this.props.history.goBack();
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { review, rating } = this.state;
    const bookId = this.props.book.id;
    this.props.dispatch(
      addReadBook(
        { review, rating: Number(rating), bookId: Number(bookId) },
        "/users/me/read"
      )
    );
    this.setState({ addRead: false });
  };

  render() {
    const { book, isFetching, message = null, user } = this.props;

    if (isFetching || !book) {
      return <div>Sæki gögn...</div>;
    }

    if (message) {
      return <div>Villa við að sækja gögn</div>;
    }

    if (book.hasOwnProperty("error")) {
      if ((book.error = "Book not found")) {
        return <div>Bók fannst ekki</div>;
      }
    }

    return (
      <ReactCSSTransitionGroup
        transitionName="registerAnimation"
        transitionAppear={true}
        transitionAppearTimeout={1500}
        transitionEnter={false}
        transitionLeave={false}
      >
        <Helmet title={book.title} />
        <div className="book--container">
          <div>
            <h1>{book.title}</h1>
            <p>Eftir {book.author}</p>
            <p>ISBN13: {book.isbn13}</p>
            <p>{book.categorytitle}</p>
            <p>{book.description}</p>
            <p>{book.review}</p>
            <p>{book.pagecount} síður</p>
            <p>Gefin út {book.published}</p>
            <p>Tungumál {book.language}</p>
          </div>
          <Link to={`/books/${book.id}/edit`}>Breyta bók</Link>
          {this.state.addRead && (
            <form className="review--container" onSubmit={this.handleSubmit}>
              <label htmlFor="review">Um bók:</label>
              <textarea
                rows="8"
                cols="50"
                name="review"
                value={this.state.review}
                onChange={this.handleChange}
              />
              <label htmlFor="rating">Einkunn:</label>
              <select
                name="rating"
                value={this.state.rating}
                onChange={this.handleChange}
              >
                <option value="1">1 </option>
                <option value="2">2</option>
                <option value="3">3 </option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <div className="review--buttons">
                <Button children={"Vista"} />
                <Button
                  onClick={this.closeReview}
                  className="danger"
                  children={"Hætta við"}
                />
              </div>
            </form>
          )}
          {user && <Button onClick={this.onClickRead} children={"Lesin bók"} />}
          <Button onClick={this.onClickBack} children={"Til Baka"} />
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}

const mapStateToProps = state => {
  return {
    isFetching: state.books.isFetching,
    message: state.books.message,
    book: state.books.singleBook,
    user: state.auth.user
  };
};

export default connect(mapStateToProps)(Book);
