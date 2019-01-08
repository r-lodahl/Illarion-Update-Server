'use strict'

require('make-promises-safe')
const gitWorker = require('gitWorker');
const fastify = require('fastify')();

fastify.get('/', async(request, reply) => {
	return { some: "code" };
});

fastify.post('/git/push/', params, async(request,reply) => {
	gitWorker.onGitWasPushed();
	return {successfull: true};
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