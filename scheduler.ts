import cron from 'node-cron';
import { exec } from 'child_process';

// Run your automation script at 11:20, 11:24, and 11:28 AM
cron.schedule('20,24,28 11 * * *', () => {
    console.log('⏰ Triggering automation at', new Date().toLocaleTimeString());

    exec('node --no-warnings -r dotenv/config src/scripts/dailyLogin.ts', (error, stdout, stderr) => {
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
