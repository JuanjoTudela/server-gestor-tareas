// config.js

const config = {
  port: process.env.PORT || 3000,  // Si no existe PORT en el entorno, usar 3000 por defecto
  // Aquí podrías añadir más configuraciones en el futuro, como URLs de bases de datos, claves API, etc.
};

module.exports = config;
