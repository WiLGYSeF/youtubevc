import { useEffect, useState } from 'react';

export default function useStatePropBacked<T>(prop: T): [state: T, setState: (newState: T) => void] {
  const [state, setState] = useState<T>(prop);

  useEffect(() => {
    setState(prop);
  }, [prop]);

  return [state, setState];
}
