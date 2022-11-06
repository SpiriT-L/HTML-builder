const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const welcome = 'Hi!';
const text = 'Enter your text';
const exit = 'To exit, type a command "exit" or press "Ctrl + C"';

stdout.write(`${welcome}\n${text}: `);

let out;

stdin.on('data', (data) => {
  let message = data.toString();
  if (message.toUpperCase().trim() == 'EXIT') {
    process.exit();
  } else {
    if (!out) {
      out = fs.createWriteStream(path.join(__dirname, 'text.txt'));
    }
    out.write(message);
    stdout.write(`${exit}\n${text} to continue: `);
  }
});

process.on('exit', () => {
  stdout.write('Bye!');
});

process.on('SIGINT', function () {
  stdout.write('\n');
  process.exit();
});
