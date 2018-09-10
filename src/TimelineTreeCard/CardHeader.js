import React from 'react';

function CardHeader(props) {
  const { filename, name } = props;
  return (
    <div className="card__header">
      <h2 className="title card__title">{name}</h2>
    </div>
  );
}

export default CardHeader;
