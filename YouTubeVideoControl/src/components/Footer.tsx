import React from 'react';

import styles from './Footer.module.scss';

function Footer() {
  return (
    <div className={styles.footer}>
      <div />
      <div className="right">
        <div className="github">
          <a
            href={process.env.REACT_APP_GITHUB_URL}
            rel="external noopener noreferrer"
            target="_blank"
          >
            <img src="/img/icon/github.png" alt="GitHub" title="GitHub" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
