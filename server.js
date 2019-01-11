require('make-promises-safe');
const mapWorker = require('./mapWorker.js');
const path = require('path');
const filesystem = require('fs');
const fastify = require('fastify')({
	https: {
		key: filesystem.readFileSync(path.join(__dirname, '/key.pem')),
		cert: filesystem.readFileSync(path.join(__dirname, '/cert.pem'))
	}
})

process.on('uncaughtException', function(e) {
	console.log(e);
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

fastify.register(require('fastify-jwt'), {
	secret: filesystem.readFileSync(path.join(__dirname, 'secret.txt'))
});

async function validate(username, password, req, reply) {
	if (username !== "A" && password !== "B") {
		return new Error("Authentication failed. Please try again.");
	}
}

fastify.after(() => {
	fastify.route({
		method: 'GET',
		url: '/',
		handler: async (request, reply) => {
			return {alive: true};
		}
	});

	fastify.route({
		method: 'GET',
		url: '/map/version/',
		preHandler: fastify.basicAuth,
		handler: async (request, reply) => {
			return {version:mapWorker.getVersion()};
		}
	});

	fastify.route({
		method: 'GET',
		url: '/map/zipball/',
		preHandler: fastify.basicAuth,
		handler: async (request, reply) => {
			return reply.sendFile('map.zip');
		}
	});

	fastify.route({
		method: 'POST',
		url: '/git/push/',
		schema: {},
		preHandler: verification.verifyGithubPayload;
		handler: async (request, reply) => {
			console.log("GIT PUSH");
			console.log(request);
			//mapWorker.onGitWasPushed();
			return {success: true};
		}
	});
});

const opts = {
	schema: {
		header: {
			"X-GitHub-Event": {"type": "string"},
			"X-GitHub-Delivery": {"type": "string"},
			"X-Hub-Signature": {"type": "string"}
		}
	}
}

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
