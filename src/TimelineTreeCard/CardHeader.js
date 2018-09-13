import React from 'react';
import PropTypes from 'prop-types';

function CardHeader({ filename, name }) {
  return (
    <div className="card__header">
      <h2 className="title card__title">{name}</h2>
    </div>
  );
}

CardHeader.propTypes = {
  filename: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default CardHeader;
