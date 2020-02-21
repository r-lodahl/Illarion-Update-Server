import fs from 'fs-extra';
import gitInstance from 'simple-git/promise';
import config from 'config';
import { rootPath } from '../app';

async function setupGitRepository(localPath: string, remote: string): Promise<void> {
    const git = gitInstance();
    await git.silent(true).cwd(localPath);
    await git.silent(true).clone(remote)
}

export async function setupServer() {
    const gitPath = rootPath + '/git';

    if (fs.existsSync(rootPath)) {
        return ;
    }

    await fs.mkdirp(gitPath);

    const authUserRemote = `https://${config.get('user')}:${config.get('pass')}@gitlab.com/illarion-ev/`;

    await setupGitRepository(gitPath, authUserRemote + 'map');
    await setupGitRepository(gitPath, authUserRemote + 'books');
    await setupGitRepository(gitPath, authUserRemote + 'tiles');
    await setupGitRepository(gitPath, authUserRemote + 'characters');
    await setupGitRepository(gitPath, authUserRemote + 'effects');
    await setupGitRepository(gitPath, authUserRemote + 'music');
    await setupGitRepository(gitPath, authUserRemote + 'sounds');
    await setupGitRepository(gitPath, authUserRemote + 'tables');
    await setupGitRepository(gitPath, authUserRemote + 'items');
}
