import * as url from 'url';

export const dirname = url.fileURLToPath(new URL('.', import.meta.url));
