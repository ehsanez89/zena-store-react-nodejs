require('dotenv').config({ path: `./backEnd/.test.env` });
require('./tests/testSanitization.js');
require('./tests/testRegistration.js');
require('./tests/testLogin.js');
require('./tests/testProducts.js');
require('./tests/testProfile.js');
