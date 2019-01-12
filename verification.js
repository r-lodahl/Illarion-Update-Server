// Based on https://medium.com/chingu/how-to-verify-the-authenticity-of-a-github-apps-webhook-payload-8d63ccc81a24

const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const secret = fs.readFileSync(path.join(__dirname, '/secret.txt'));

const createComparisonSignature = (body) => {
	const hmac = crypto.createHmac('sha1', secret);
	const selfSignature = hmac.update(JSON.stringify(body)).digest('hex');
	return `sha1=${selfSignature}`;
}

const compareSignatures = (signature, comparisonSignature) => {
	const source = Buffer.from(signature);
	const comparison = Buffer.from(comparisonSignature);
	return crypto.timingSafeEqual(source, comparison);
}

module.exports.verifyGithubPayload = function(request, response, done) {
	console.log("Am I called?");
	const headers = request.headers;
	const body = request.body;

	const signature = headers['x-hub-signature'];
	const comparisonSignature = createComparisonSignature(body);

	if (!compareSignatures(signature, comparisonSignature)) {
		return reponse.status(401).send('Mismatched signatures.');
	}

	done();
}

//module.exports.verifyGithubPayload = verifyGithubPayload;
