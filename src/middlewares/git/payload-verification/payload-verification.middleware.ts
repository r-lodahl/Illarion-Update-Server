import { Context } from 'koa';
import config from 'config';
import crypto from 'crypto';
import {headerValidationSchema} from "./validation";
import {ValidationError} from "yup";

const secret = config.get('secret');

function createComparisionSignature(body) {
    const hmac = crypto.createHmac('sha1', secret);
    const selfSignature = hmac.update(JSON.stringify(body)).digest('hex');
    return `sha1=${selfSignature}`;
}

function compareSignatures(signature: string, comparisonSignature: string): boolean {
     const source = Buffer.from(signature);
     const comparison = Buffer.from(comparisonSignature);

     if (source.length !== comparison.length) return false;

     return crypto.timingSafeEqual(source, comparison);
}

export async function verifyPayload(ctx: Context, next: () => Promise<void>): Promise<void> {
    const headers = ctx.request.headers;

    try {
        await headerValidationSchema.validate(headers, {
            abortEarly: false,
        });
    } catch (e) {
        if (ValidationError.isError(e)) {
            console.error(e.errors);
            ctx.throw(422, e.errors);
        }
        ctx.throw(500);
    }

    const signature = ctx.request.headers['x-hub-signature'];
    const comparison = createComparisionSignature(ctx.request.body);

    if (!compareSignatures(signature, comparison)) {
        ctx.throw(401, 'Mismatched signatures');
    }

    await next();
}