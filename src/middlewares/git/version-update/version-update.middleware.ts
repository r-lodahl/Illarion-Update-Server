import { Context } from 'koa';
import gitInstance from "simple-git/promise";
import fs from 'fs-extra';

export function updateVersion(gitPath: string): (ctx: Context, next: () => Promise<void>) => Promise<void> {
    return async (ctx: Context, next: () => Promise<void>): Promise<void> => {
        const git = gitInstance();

        let gitVersion;
        try {
            await git.silent(true).cwd(gitPath);
            gitVersion = await git.silent(true).revparse(['--verify','-q','HEAD']);
        } catch (e) {
            console.error('Git rev parse failed!', e.errors);
            ctx.throw(500);
        }

        await fs.writeFile(__dirname + '/maps/map.version', gitVersion.split('\n')[1].trim());

        await next();
    }
}