import debounce from 'just-debounce-it';
import { useCallback, useEffect, useState } from 'react';

type WindowSize = {
  width: number | null;
  height: number | null;
};

export default (): WindowSize => {
  const hasWindow = typeof window === 'object';

  const getSize = useCallback(
    () => ({
      width: hasWindow ? window.innerWidth : null,
      height: hasWindow ? window.innerHeight : null,
    }),
    [hasWindow],
  );

  const [windowSize, setWindowSize] = useState(getSize());

  useEffect(() => {
    if (!hasWindow) {
      return () => {};
    }

    const handleResize = debounce(
      (): void => {
        setWindowSize(getSize());
      },
      100,
      true,
    );

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [hasWindow, getSize]);

  return windowSize;
};
