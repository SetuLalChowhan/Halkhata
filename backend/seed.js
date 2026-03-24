const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Member = require('./models/Member');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {}).then(async () => {
    console.log('Connected');
    
    // Admin user
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin123', salt);
    await User.updateOne({ username: 'admin' }, { $set: { password: hash, role: 'Admin' } }, { upsert: true });

    const hashUser = await bcrypt.hash('user123', salt);
    await User.updateOne({ username: 'user' }, { $set: { password: hashUser, role: 'User' } }, { upsert: true });

    const members = ['Setu (Co-Leader)', 'Sefat', 'Asikur', 'Robiul'];
    for (const name of members) {
        await Member.updateOne({ name }, { $set: { name } }, { upsert: true });
    }

    console.log('Seed Complete');
    process.exit(0);
}).catch(console.log);
