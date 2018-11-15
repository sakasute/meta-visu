import React from 'react';
import './InfoBox.css';

export default function InfoBox({ children, layoutStyles }) {
  return (
    <div style={layoutStyles} className="infoBox">
      {children}
    </div>
  );
}
