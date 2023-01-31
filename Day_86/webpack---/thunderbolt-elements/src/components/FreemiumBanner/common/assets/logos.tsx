import * as React from 'react';

type DownLoadLogoProps = { className: string };
type WixLogoProps = { rootClass: string; dotClass: string };

export const DownloadLogo: React.FC<DownLoadLogoProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 177.32 142.49">
    <defs>
      <style>
        {
          '.cls-1{fill:none;stroke:#9d288c;stroke-miterlimit:10;stroke-width:13px}'
        }
      </style>
    </defs>
    <title>Artboard 1</title>
    <path
      className="cls-1"
      d="M28.66 65.5V104s0 14.5 13 14.5h94.5s12.5-.5 12.5-13.5V65.5"
    />
    <path className="cls-1" d="M90.11 89.76v-75m-23 50.5l22 24.5 24-24" />
  </svg>
);

export const WixLogo: React.FC<WixLogoProps> = ({ rootClass, dotClass }) => (
  <svg className={rootClass} viewBox="0 0 28 10.89" aria-label="wix">
    <path
      d="M16.02.2c-.55.3-.76.78-.76 2.14a2.17 2.17 0 0 1 .7-.42 3 3 0 0 0 .7-.4A1.62 1.62 0 0 0 17.22 0a3 3 0 0 0-1.18.2z"
      className={dotClass}
    ></path>
    <path d="M12.77.52a2.12 2.12 0 0 0-.58 1l-1.5 5.8-1.3-4.75a4.06 4.06 0 0 0-.7-1.55 2.08 2.08 0 0 0-2.9 0 4.06 4.06 0 0 0-.7 1.55L3.9 7.32l-1.5-5.8a2.12 2.12 0 0 0-.6-1A2.6 2.6 0 0 0 0 .02l2.9 10.83a3.53 3.53 0 0 0 1.42-.17c.62-.33.92-.57 1.3-2 .33-1.33 1.26-5.2 1.35-5.47a.5.5 0 0 1 .34-.4.5.5 0 0 1 .4.5c.1.3 1 4.2 1.4 5.5.4 1.5.7 1.7 1.3 2a3.53 3.53 0 0 0 1.4.2l2.8-11a2.6 2.6 0 0 0-1.82.53zm4.43 1.26a1.76 1.76 0 0 1-.58.5c-.26.16-.52.26-.8.4a.82.82 0 0 0-.57.82v7.36a2.47 2.47 0 0 0 1.2-.15c.6-.3.75-.6.75-2V1.8zm7.16 3.68L28 .06a3.22 3.22 0 0 0-2.3.42 8.67 8.67 0 0 0-1 1.24l-1.34 1.93a.3.3 0 0 1-.57 0l-1.4-1.93a8.67 8.67 0 0 0-1-1.24 3.22 3.22 0 0 0-2.3-.43l3.6 5.4-3.7 5.4a3.54 3.54 0 0 0 2.32-.48 7.22 7.22 0 0 0 1-1.16l1.33-1.9a.3.3 0 0 1 .57 0l1.37 2a8.2 8.2 0 0 0 1 1.2 3.47 3.47 0 0 0 2.33.5z"></path>
  </svg>
);
