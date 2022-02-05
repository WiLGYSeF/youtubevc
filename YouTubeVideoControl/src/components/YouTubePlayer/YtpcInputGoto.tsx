import { YtpcControlInput } from './YtpcControlInput';
import YtpcInputTime from './YtpcInputTime';

import '../../css/style.min.css';

function YtpcInputGoto(props: YtpcControlInput) {
  return (
    <YtpcInputTime
      setTime={(seconds: number) => props.setControlInputState({
        goto: seconds,
      })}
    />
  );
}

export default YtpcInputGoto;
