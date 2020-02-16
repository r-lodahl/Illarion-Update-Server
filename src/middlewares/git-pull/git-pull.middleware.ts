import { Context } from 'koa';
import git from "simple-git/promise";

export function pullFromGit(cwd: string): (ctx: Context, next: () => Promise<void>) => Promise<void> {
    return async (ctx: Context, next: () => Promise<void>): Promise<void> => {
        try {
            await git().silent(true).cwd(cwd);
            await git().silent(true).pull();
        } catch (e) {
            console.error('Git pull failed!', e.errors);
            ctx.throw(500);
        }

        await next();
    }
}