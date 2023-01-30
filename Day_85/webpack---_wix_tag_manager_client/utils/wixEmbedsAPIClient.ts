import { PageInfo } from '../types';

export function getCurrentPageInfo(window: any): PageInfo {
  return (
    (window.wixEmbedsAPI.getCurrentPageInfo &&
      typeof window.wixEmbedsAPI.getCurrentPageInfo === 'function' &&
      window.wixEmbedsAPI.getCurrentPageInfo()) ||
    {}
  );
}
