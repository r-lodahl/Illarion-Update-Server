import { Context } from 'koa';
import glob from 'glob';
import windows1252 from 'windows-1252';
import JSZip from 'jszip';
import fs from 'fs-extra';

export async function updateMapFiles(ctx: Context, next: () => Promise<void>): Promise<void> {
    const files = glob.sync(__dirname + "git/maps/**/*.txt");

    const zip = new JSZip();
    for (const file of files) {
        const path =  file.match(/(?<=raw_maps).*/)[0];
        zip.file(path, windows1252.decode(await fs.readFile(file, 'binary')));
    }
    const file = await zip.generateAsync({type: "arraybuffer"});

    await fs.writeFile(__dirname + 'public/maps.zip', file);

    await next();
}