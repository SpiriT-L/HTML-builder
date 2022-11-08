const fs = require('fs');
const path = require('path');
const stream = fs.ReadStream(path.resolve(__dirname, 'text.txt'));

stream.on('readable', () => {
  const text = stream.read();
  if (text) {
    console.log(text.toString('utf-8'));
  }
});
