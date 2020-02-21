import config from 'config';
import { app } from './app';
import {setupServer} from "./helper/first-time-setup";

async function main(): Promise<void> {
    await setupServer();

    const port = config.get('port');
    app.listen(port, () => {
        console.log(`Started listening on port ${port}`);
    });
}

main()
    .then()
    .catch(e => {
        console.error('Caught error in main(), exiting', e);
        process.exit(1);
    });

process.on('unhandledRejection', e => {
    console.error('Caught unhandled rejection, exiting', e);
    process.exit(1);
});
