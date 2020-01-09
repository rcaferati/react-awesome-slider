import React from 'react';
import './section.css';

const Section = ({ children, wrapper = true, backgroundColor = '#FFFFFF' }) => {
  return (
    <section className="section" style={{ backgroundColor }}>
      {wrapper ? <div className="section-wrapper">{children}</div> : children}
    </section>
  );
};

export default Section;
