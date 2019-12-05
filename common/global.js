var env = process.env.NODE_ENV || 'development';

module.exports = {
    env: env,
    base_url: env === 'development' ? 'http://127.0.0.1:3000/api/'
        : 'http://106.54.193.117/api/',
    admin: {
        username: 'Condor',
        password: 'condordz'
    }
};