require('make-promises-safe');
const mapWorker = require('./mapWorker.js');
const verification = require('./verification.js');
const path = require('path');
const filesystem = require('fs');
const fastify = require('fastify')({
	https: {
		key: filesystem.readFileSync(path.join(__dirname, '/key.pem')),
		cert: filesystem.readFileSync(path.join(__dirname, '/cert.pem'))
	}
});

fastify.register(require('fastify-static'), {
	root: path.join(__dirname, 'public'),
	prefix: '/public/'
});

fastify.register(require('fastify-rate-limit'), {
	max: 20,
	timeWindow: '1 minute'
});

fastify.register(require('fastify-basic-auth'), {
	validate,
	authenticate: true
});

async function validate(username, password, req, reply) {
	if (username !== "A" && password !== "B") {
		return new Error("Authentication failed. Please try again.");
	}
}

fastify.after(() => {
	fastify.route({
		method: 'GET',
		url: '/api/map/version',
		//beforeHandler: fastify.basicAuth,
		handler: async (request, reply) => {
			reply
			.code(200)
			.header("Content-Type", "application/json; charset=utf-8")
			.send({"version":`${mapWorker.getVersion()}`});
		}
	});

	fastify.route({
		method: 'GET',
		url: '/api/map/zipball',
		//beforeHandler: fastify.basicAuth,
		handler: async (request, reply) => {
			return reply.sendFile('maps.zip');
		}
	});

	fastify.route({
		method: 'POST',
		url: '/api/git/mapupdate',
		schema: {
			headers: {
				type: 'object',
				properties: {
					'x-github-event': { type: 'string' },
					'x-github-delivery': { type: 'string' },
					'x-hub-signature': { type: 'string' }
				},
				required: ['x-github-event', 'x-github-delivery', 'x-hub-signature']
			}
		},
		beforeHandler: verification.verifyGithubPayload,
		handler: async (request, reply) => {
			mapWorker.onGitWasPushed();
			return {success: true};
		}
	});

});

const start = async () => {
	try {
		await fastify.listen(3000);
		console.log(`server listening on ${fastify.server.address().port}`);
		fastify.log.info(`server listening on ${fastify.server.address().port}`);
	} catch (error) {
		console.log(error);
		fastify.log.error(error);
		process.exit(1);
	}
}

start();
