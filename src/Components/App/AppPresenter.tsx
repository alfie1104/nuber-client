import PropTypes from "prop-types";
import React from "react";

interface IProps {
  isLoggedIn: boolean;
}

const AppPresenter: React.FC<IProps> = ({ isLoggedIn }) =>
  isLoggedIn ? <span>you are in</span> : <span>you are out</span>;

AppPresenter.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired
};

export default AppPresenter;
