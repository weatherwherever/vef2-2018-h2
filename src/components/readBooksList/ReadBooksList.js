import React, { Component } from "react";
import { connect } from "react-redux";
import Button from "../../components/button";
import queryString from "query-string";
import { Link } from "react-router-dom";
import { getRead } from "../../actions/books";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import "./ReadbooksList.css";
import PropTypes from "prop-types";
import { deleteRead } from '../../actions/books';

class readBooksList extends Component {
  static propTypes = {
    deleteOption: PropTypes.bool,
    dispatch: PropTypes.func,
    isFetching: PropTypes.bool,
    meReadBooks: PropTypes.bool,
    review: PropTypes.shape({
      limit: PropTypes.number,
      offset: PropTypes.number,
      items: PropTypes.array
    })
  };
  urlpage = Number(queryString.parse(this.props.location).page - 1);

  state = {
    page: this.urlpage > 0 ? this.urlpage : 0
  };

  componentDidMount() {
    const { dispatch, meReadBooks, userId } = this.props;
    const { page } = this.state;
    const offset = `offset=${page * 10}`;
    if (meReadBooks) {
      dispatch(getRead(`users/me/read?${offset}`));
    } else {
      dispatch(getRead(`users/${userId}/read?${offset}`));
    }
  }

  handlePageClick = key => {
    this.setState((prevState, props) => {
      return {
        page: Number(prevState.page) + (key === "prev" ? -1 : 1)
      };
    }, this.componentDidMount);
  };

  handleDelete = e => {
    e.preventDefault();

    const { dispatch } = this.props;

    dispatch(deleteRead(e.target.parentNode.id, "/users/me/read"));
  };
  if(isFetching) {
    return <div>Loading...</div>;
  }

  render() {
    const { isFetching, reviews, deleteOption } = this.props;

    const { page } = this.state;

    if (isFetching) {
      return <div>Loading...</div>;
    }
    
    return (
      <ReactCSSTransitionGroup
        transitionName="bookUpdate"
        transitionAppear={true}
        transitionAppearTimeout={1500}
        transitionEnter={false}
        transitionLeave={false}
      >
        <div className="readbooks--container" key={1}>
          <h1>Lesnar Bækur</h1>
          {reviews &&
            reviews.items.map(book => {
              return (
                <form key={book.id} id={book.id} onSubmit={this.handleDelete}>
                  <Link to={`/books/${book.book_id}`}>
                    <h3>{book.title}</h3>
                  </Link>
                  <p>Einkunn: {book.rating}</p>
                  {book.review && <p>Um bókina: {book.review}</p>}
                  {deleteOption && (
                    <Button className="danger" onClick={this.handleDelete}>
                      Eyda
                    </Button>
                  )}
                </form>
              );
            })}
          {page > 0 && (
            <Button
              onClick={() => this.handlePageClick("prev")}
              children={"Fyrri síða"}
            />
          )}
          <span>Síða {page + 1}</span>
          {reviews &&
            reviews.items.length === 10 && (
              <Button
                onClick={() => this.handlePageClick("next")}
                children={"Næsta síða"}
              />
            )}
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}

const mapStateToProps = state => {
  return {
    reviews: state.books.reviews,
    isFetching: state.books.isFetching
  };
};
export default connect(mapStateToProps)(readBooksList);
