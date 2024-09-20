const fastify = require('fastify')({ logger: true });
const admin = require('firebase-admin');
const cors = require('@fastify/cors'); 


if (!admin.apps.length) {
  const serviceAccount = require('./serviceAccountKey.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://permitflow-f50ee.firebaseio.com',
  });
}

fastify.register(cors, {
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST'],        
  allowedHeaders: ['Content-Type'], 
});

fastify.post('/submit-form', async (request, reply) => {
  const formData = request.body;


  try {
    const docRef = await admin.firestore().collection('forms').add(formData);
    console.log('Document written with ID: ', docRef.id);
  } catch (error) {
    console.error('Error writing document: ', error);
    return reply.status(500).send({ success: false, message: 'Error saving data' });
  }

  // Success response
  reply.send({ success: true, message: 'Form submitted successfully' });
});


const start = async () => {
  try {
    await fastify.listen({ port: 3001 });
    console.log('Server listening on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
