import React, { ReactElement } from 'react';

import styles from './Card.module.scss';

interface CardProps {
  header: string;
  contents: (ReactElement | string)[];
  imageSrc: string;
  imageAlt: string;
  imageTitle?: string;
  contentOnLeft?: boolean;
}

function Card(props: CardProps) {
  const contentOnLeft = props.contentOnLeft ?? true;

  const eContent = (
    <div>
      <div className="header">
        {props.header}
      </div>
      <div className="contents">
        {props.contents.map(
          (c, i) => (typeof c === 'string' ? (<p key={`p${i}`}>{c}</p>) : c),
        )}
      </div>
    </div>
  );

  const eImage = (
    <img src={props.imageSrc} alt={props.imageAlt} title={props.imageTitle ?? ''} />
  );

  return (
    <div className={styles.card}>
      <div className={['left', contentOnLeft ? 'content' : 'image'].join(' ')}>
        {contentOnLeft ? eContent : eImage}
      </div>
      <div className={['right', contentOnLeft ? 'image' : 'content'].join(' ')}>
        {contentOnLeft ? eImage : eContent}
      </div>
    </div>
  );
}

export default Card;
