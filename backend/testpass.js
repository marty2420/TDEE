const bcrypt = require('bcryptjs');

const password = 'password123';  // The raw password you're testing
const storedHash = '$2a$10$AksqDK1wo9Zf5s4Cv2hv8e4XQIuTejtOYdcgpfjHvSx1YftKmaxaG';  // Hash from your DB

bcrypt.compare(password, storedHash, (err, isMatch) => {
  if (err) throw err;
  if (isMatch) {
    console.log('✅ Password matches!');
  } else {
    console.log('❌ Password does not match.');
  }
});
