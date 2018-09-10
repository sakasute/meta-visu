import React from 'react';

function CardHeader(props) {
  const { filename } = props;
  return (
    <div className="card__header">
      <h2 className="title card__title">{filename}</h2>
    </div>
  );
}

export default CardHeader;
