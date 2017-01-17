const exec = require('child_process').exec;
const env = require('../../.env');

const cmd = [
   'mysql -u root <<<',
   `"CREATE DATABASE IF NOT EXISTS ${env.DATABASE}`,
   'DEFAULT CHARACTER SET utf8',
   'DEFAULT COLLATE utf8_general_ci";'
].join(' ');

const child = exec(cmd, (err, stdout, stderr) => {
    if (err) {
        console.log(`error: ${stderr}`);
        process.exit(1);
    }
    console.log(stdout);
    console.log('command ran successfully...');
    console.log(`database ${env.DATABASE} ready to use.`)
});
