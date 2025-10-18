// mock-api/config/db.config.js

// Carga las variables del .env (archivo raíz del proyecto)
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
let mongoMemoryServer = null;

/**
 * Conexión a MongoDB con fallback a MongoDB in-memory para desarrollo.
 */
const connect = async () => {
    const envUri = process.env.MONGODB_URI;
    const defaultLocal = 'mongodb://127.0.0.1:27017/tienda_virtual';

    const tryConnect = async (uri) => {
        // add a short serverSelectionTimeoutMS to avoid long hangs trying to reach a non-responsive MongoDB
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 2000 });
    };

    try {
        const uri = envUri || defaultLocal;
        await tryConnect(uri);
        console.log('✅ Conexión a MongoDB establecida:', uri);
    } catch (error) {
    console.warn('⚠️ No se pudo conectar a MongoDB en la URI indicada:', error && error.message ? error.message : error);
        // Intentar usar MongoDB in-memory (mongodb-memory-server) para desarrollo
        try {
            // Cargar dinámicamente para no forzar dependencia si no se necesita
            const { MongoMemoryServer } = require('mongodb-memory-server');
            mongoMemoryServer = await MongoMemoryServer.create();
            const memUri = mongoMemoryServer.getUri();
            await tryConnect(memUri);
            console.log('✅ Conexión a MongoDB en memoria establecida (mongodb-memory-server)');
        } catch (memErr) {
            console.error('❌ Error al iniciar MongoDB en memoria:', memErr.message || memErr);
            // Al final, fallamos si no hay ninguna DB disponible
            throw memErr;
        }
    }
};

const close = async () => {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
        await mongoMemoryServer.stop();
    }
};

module.exports = { connect, mongoose, close };