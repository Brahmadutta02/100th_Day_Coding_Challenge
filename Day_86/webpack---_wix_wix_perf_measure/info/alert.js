const PARAM = 'showperfinfo';

/**
 * If "showPerfInfo" URL param is specified then display metrics as alert
 * @param {Window} window
 * @param {Array<Promise<{[key: string]: string | number}>> measurements
 * @returns {boolean}
 */
export default function alert(window, measurements) {
    const {
        URLSearchParams
    } = /** @type {Object} */ (window);
    if (URLSearchParams) {
        /** @type {URLSearchParams} */
        const searchParams = new URLSearchParams(window.location.search);
        for (const key of searchParams.keys()) {
            if (key.toLowerCase() === PARAM) {
                Promise.all(measurements.slice(0, 3)).then(
                    ([{
                        viewerName,
                        ttfb
                    }, {
                        fcp
                    }, {
                        lcp,
                        cls,
                        tti,
                        tbt
                    }]) => {
                        window.alert(
                            `Viewer=${viewerName}\nTTFB=${ttfb}\nFCP=${fcp}\nLCP=${lcp}\nCLS=${cls}\nTTI=${tti}\nTBT=${tbt}`,
                        );
                    },
                );
                return true;
            }
        }
    }
    return false;
}