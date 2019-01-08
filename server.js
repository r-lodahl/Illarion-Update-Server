'use strict'

require('make-promises-safe')
const gitWorker = require('gitWorker');
const fastify = require('fastify')();
const path = require('path');

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
	fastify.addHook('preHandler' fastify.basicAuth);

	fastify.get('/', async(request, reply) => {
		return { alive: true };
	});

	fastify.get('/map/version/', async(request, reply) => {
		return { version: gitWorker.getVersion() };
	});

	fastify.get('/map/zipball/' async(request, reply) => {
		return reply.sendFile('map.zip');
	});
});

fastify.post('/git/push/', params, async(request,reply) => {
	gitWorker.onGitWasPushed();
	return {successful: true};
});

const start = async () => {
	try {
		await fastify.listen(3000);
		fastify.log.info(`server listening on $(fastify.server.address().port}`);
	} catch (error) {
		fastify.log.error(error);
		process.exit(1);
	}
}

start();