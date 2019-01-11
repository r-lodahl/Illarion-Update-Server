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

async function validate(username, password, req, reply) {
	if (username !== "A" && password !== "B") {
		return new Error("Authentication failed. Please try again.");
	}
}

fastify.after(() => {
	fastify.addHook('preHandler', fastify.basicAuth);

	fastify.get('/', async(request, reply) => {
		return { alive: true };
	});

	fastify.get('/map/version/', async(request, reply) => {
		return { version: mapWorker.getVersion() };
	});

	fastify.get('/map/zipball/', async(request, reply) => {
		return reply.sendFile('map.zip');
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

fastify.post('/git/push/', opts, async(request,reply) => {
	mapWorker.onGitWasPushed();
	return {successful: true};
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
