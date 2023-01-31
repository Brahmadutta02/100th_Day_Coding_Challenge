import { useEffect } from 'react';

// eslint-disable-next-line react-hooks/exhaustive-deps
export const useDidMount = (cb: React.EffectCallback) => useEffect(cb, []);
