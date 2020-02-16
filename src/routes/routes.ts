import KoaRouter from 'koa-router';
import {verifyPayload} from "../middlewares/payload-verification/payload-verification.middleware";
import {pullFromGit} from "../middlewares/git-pull/git-pull.middleware";
import {updateMapFiles} from "../middlewares/map-update/map-update.middleware";

export const router = new KoaRouter();

router.get('/api/health', async (ctx, next) => {
    ctx.status = 200;
    await next();
});

// Update routes
router.get('/api/versions');
router.get('/api/map', );

// Git hook routes
router.post('/api/map', verifyPayload, pullFromGit(__dirname + "git/maps"), updateMapFiles);