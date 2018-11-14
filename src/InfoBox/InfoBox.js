import React from 'react';
import './InfoBox.css';

export default function InfoBox({ children, handleClose, layoutStyles }) {
  return (
    <div style={layoutStyles} className="infoBox">
      <button type="button" className="infoBox__closeBtn" onClick={handleClose}>
        <img src="assets/material-close.svg" alt="register panel toggle" />
      </button>
      {children}
    </div>
  );
}
