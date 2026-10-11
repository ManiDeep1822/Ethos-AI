const User = require('../models/User');

const seedDemoUser = async () => {
  try {
    const existing = await User.findOne({ email: 'admin@ethos.ai' });
    if (!existing) {
      await User.create({
        name: 'Executive Leader',
        email: 'admin@ethos.ai',
        password: 'password123',
      });
      console.log('Enterprise account initialized: admin@ethos.ai');
    }
  } catch (error) {
    console.error('Seed account check notice:', error.message);
  }
};

module.exports = seedDemoUser;
