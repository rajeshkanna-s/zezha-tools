import cron from 'node-cron';
import { exec } from 'child_process';

// Run your automation script at 11:20, 11:24, and 11:28 AM
cron.schedule('6,8,10 12 * * *', () => {
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
