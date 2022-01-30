import React, { ReactElement, useState } from 'react';

import YtpcAdd from './YtpcAdd';
import YtpcInputTime from './YtpcInputTime';

import '../../css/style.min.css';
import YtpcControlSelect from './YtpcControlSelect';

function YtpcInput() {
  const [controlInput, setControlInput] = useState<ReactElement>(<YtpcInputTime />);

  return (
    <div className='input'>
      <span>At <YtpcInputTime />, <YtpcControlSelect setControlInput={(element: ReactElement) => setControlInput(element)} /> to {controlInput}</span>
      <YtpcAdd />
    </div>
  );
}

export default YtpcInput;
