// Based on https://medium.com/chingu/how-to-verify-the-authenticity-of-a-github-apps-webhook-payload-8d63ccc81a24

const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const secret = fs.readFileSync(path.join(__dirname, 'secret.key'));

const createComparisonSignature = (body) => {
	const hmac = crypto.createHmac('sha1', secret);
	const selfSignature = hmac.update(JSON.stringify(body)).digest('hex');
	return `sha1=${selfSignature}`;
}

const compareSignatures = (signature, comparisonSignature) => {
	const source = Buffer.from(signature);
	const comparison = Buffer.from(comparisonSignature);

	if (source.length !== comparison.length) return false;

	return crypto.timingSafeEqual(source, comparison);
}

module.exports.verifyGithubPayload = function(request, response, done) {
	const headers = request.headers;
	const body = request.body;

	const signature = headers['x-hub-signature'];
	console.log(signature);
	const comparisonSignature = createComparisonSignature(body);
	console.log(comparisonSignature);

	if (!compareSignatures(signature, comparisonSignature)) {
		return response.status(401).send('Mismatched signatures.');
	}

	done();
}
