import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome'; // Correct import without .js
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config();

console.log("🚀 Starting dailyLoginAutomation...");
console.log("Username from .env:", process.env.REACT_APP_GREYTHR_USERNAME);

async function dailyLoginAutomation(): Promise<void> {
    // Create Chrome options
    const chromeOptions = new chrome.Options().addArguments('--start-maximized');

    console.log("🛠️ Building WebDriver...");

    const driver: WebDriver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeOptions)  // Pass chromeOptions here
        .build();

    console.log("✅ WebDriver created.");

    try {
        // Validate environment variables
        const username = process.env.REACT_APP_GREYTHR_USERNAME;
        const password = process.env.REACT_APP_GREYTHR_PASSWORD;

        if (!username || !password) {
            throw new Error('Missing credentials in .env file');
        }

        // Navigate to login page
        await driver.get('https://kuwy.greythr.com');

        // Wait for username input to be located and visible
        const usernameInput = await driver.wait(
            until.elementLocated(By.id('username')), 10000
        );
        await driver.wait(until.elementIsVisible(usernameInput), 10000);
        await usernameInput.sendKeys(username);

        // Wait for password input to be located and visible
        const passwordInput = await driver.wait(
            until.elementLocated(By.id('password')), 10000
        );
        await driver.wait(until.elementIsVisible(passwordInput), 10000);
        await passwordInput.sendKeys(password);

        // Click "Log in" button
        const loginButton = await driver.wait(
            until.elementLocated(By.xpath("//button[@type='submit' and contains(text(), 'Log in')]")),
            10000
        );
        await driver.wait(until.elementIsVisible(loginButton), 10000);
        await loginButton.click();

        // Wait for .btn-container after login
        await driver.wait(until.elementLocated(By.css('.btn-container')), 10000);
        await driver.wait(until.elementIsVisible(await driver.findElement(By.css('.btn-container'))), 10000);

        // Find container and buttons
        const btnContainer = await driver.findElement(By.css('.btn-container'));
        const gtButtons = await btnContainer.findElements(By.css('gt-button'));

        if (gtButtons.length === 0) {
            console.error("⚠️ Login Error: No gt-button found");
            return;
        }

        // Find button with shade="primary"
        let dailyButton ;
        for (const btn of gtButtons) {
            const shade = await btn.getAttribute("shade");
            if (shade && shade.toLowerCase() === "primary") {
                dailyButton = btn;
                break;
            }
        }

        // Fallback: use first button if primary not found
        if (!dailyButton) {
            dailyButton = gtButtons[0];
        }

        // Scroll into view and click using JS
        await driver.executeScript("arguments[0].scrollIntoView(true);", dailyButton);
        await driver.executeScript("arguments[0].click();", dailyButton);

        console.log("✅ Sign In clicked successfully");

        // Wait after clicking Sign In (adjust as needed)
        await driver.sleep(5000);

        console.log('✅ Successfully logged in and clicked Sign In at', new Date().toISOString());

    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`❌ Automation failed: ${message}`);

        // Save screenshot on error
        try {
            const screenshot = await driver.takeScreenshot();
            fs.writeFileSync('error_screenshot.png', screenshot, 'base64');
        } catch (screenshotError) {
            console.error('Could not take screenshot:', screenshotError);
        }

        throw error;
    } finally {
        await driver.quit();
    }
}

// Execute the automation and handle errors gracefully
(async () => {
    try {
        await dailyLoginAutomation();
    } catch (e) {
        console.error('Fatal error during automation:', e);
        process.exit(1);
    }
})();
