import {
    isCI
} from '../utils';
export function artifactId(override) {
    return {
        'X-Wix-Client-Artifact-Id': override !== null && override !== void 0 ? override : (!isCI() ? process.env.ARTIFACT_ID : ''),
    };
}
//# sourceMappingURL=artifact-id.js.map