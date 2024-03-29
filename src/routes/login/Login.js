import React, { Component } from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import { loginUser, logoutUser } from "../../actions/auth";
import Button from "../../components/button";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./Login.css";

class Login extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    history: PropTypes.shape({
      action: PropTypes.string,
      block: PropTypes.func,
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
    isAuthenticated: PropTypes.bool,
    isFetching: PropTypes.bool
  };

  state = {
    username: "",
    password: ""
  };

  componentDidMount() {
    this.maybeRedirect();
  }

  handleInputChange = e => {
    const { name, value } = e.target;
    if (name) {
      this.setState({ [name]: value });
    }
  };

  maybeRedirect = () => {
    const { isAuthenticated, history } = this.props;
    if (isAuthenticated) {
      history.push("/");
    }
  };

  handleSubmit = e => {
    e.preventDefault();

    const { dispatch } = this.props;
    const { username, password } = this.state;

    dispatch(loginUser({ username, password }, "/login")).then(() => {
      this.maybeRedirect();
    });
  };

  handleLogout = e => {
    e.preventDefault();

    const { dispatch } = this.props;

    dispatch(logoutUser());
  };

  render() {
    const { username, password } = this.state;

    const { isAuthenticated, isFetching, message } = this.props;

    if (isAuthenticated) {
      return <Button onClick={this.handleLogout}>Útskrá</Button>;
    }

    if (isFetching) {
      return (
        <p>
          Skrái inn <em>{username}</em>...
        </p>
      );
    }

    let alert;
    if (!Array.isArray(message) && message) {
      alert = <p className="alert--text">{message}</p>;
    } else {
      alert =
        message &&
        message.map((item, index) => {
          return (
            <div key={index}>
              <p className="alert--text">{item.message}</p>
            </div>
          );
        });
    }
    return (
      <ReactCSSTransitionGroup
        transitionName="registerAnimation"
        transitionAppear={true}
        transitionAppearTimeout={1500}
        transitionEnter={false}
        transitionLeave={false}
      >
        <Helmet title="Innskráning" />
        <div className="register--container">
          <h1>Innskráning</h1>
          <ReactCSSTransitionGroup
            transitionName="messageAnimation"
            transitionAppear={true}
            transitionAppearTimeout={10000}
            transitionEnter={false}
            transitionLeave={false}
          >
            {alert}
          </ReactCSSTransitionGroup>
          <form onSubmit={this.handleSubmit}>
            <div className="register--input">
              <label htmlFor="username">Username: </label>
              <input
                required
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={this.handleInputChange}
              />
            </div>
            <div className="register--input">
              <label htmlFor="password">Password: </label>
              <input
                required
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={this.handleInputChange}
              />
            </div>
            <div className="login--button">
              <Button disabled={isFetching}>Innskrá</Button>
            </div>
          </form>
          <div>
            <Link to="/register">Nýskráning</Link>
          </div>
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}

const mapStateToProps = state => {
  return {
    isFetching: state.auth.isFetching,
    isAuthenticated: state.auth.isAuthenticated,
    message: state.auth.message
  };
};

export default connect(mapStateToProps)(Login);
