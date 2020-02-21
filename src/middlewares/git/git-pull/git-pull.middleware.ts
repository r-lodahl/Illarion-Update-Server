import { Context } from 'koa';
import gitInstance from 'simple-git/promise';

export function pullFromGit(gitDirectory: string): (ctx: Context, next: () => Promise<void>) => Promise<void> {
    return async (ctx: Context, next: () => Promise<void>): Promise<void> => {
        const git = gitInstance();

        try {
            await git.silent(true).cwd(gitDirectory);
            await git.silent(true).pull();
        } catch (e) {
            console.error('Git pull failed!', e.errors);
            ctx.throw(500);
        }

        await next();
    }
}