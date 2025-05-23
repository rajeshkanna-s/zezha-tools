import cron from 'node-cron';
import { exec } from 'child_process';

// ESM-compatible approach: use exec directly with the correct command
cron.schedule('26,28,30 12 * * *', () => {
    console.log('⏰ Triggering automation at', new Date().toLocaleTimeString());

    exec('npm run daily-login', (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`⚠️ stderr: ${stderr}`);
        }
        console.log(`✅ Output:\n${stdout}`);
    });
});
