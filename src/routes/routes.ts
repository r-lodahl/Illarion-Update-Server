import KoaRouter from 'koa-router';
import {verifyPayload} from "../middlewares/git/payload-verification/payload-verification.middleware";
import {pullFromGit} from "../middlewares/git/git-pull/git-pull.middleware";
import {updateMapFiles} from "../middlewares/map/map-update/map-update.middleware";
import {updateVersion} from "../middlewares/git/version-update/version-update.middleware";

export const router = new KoaRouter();

router.get('/api/health', async (ctx, next) => {
    ctx.status = 200;
    await next();
});

// Update routes
router.get('/api/versions');
router.get('/api/map', );

// Git hook routes
router.post(
    '/api/map',
    //verifyPayload,
    pullFromGit(__dirname + 'git/maps'),
    //updateMapFiles,
    //updateVersion(__dirname + 'git/maps')
);