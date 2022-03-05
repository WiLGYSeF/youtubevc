import React from 'react';

import styles from './Header.module.scss';

function Header() {
  return (
    <div className={styles.header}>
      <a href="/">
        <div className="left">
          <div className="logo">
            <div>
              <span>YouTube</span><span className="extension">VC</span>
            </div>
          </div>
          <div className="subtitle">
            YouTube Video Controller
          </div>
        </div>
      </a>
    </div>
  );
}

export default Header;
