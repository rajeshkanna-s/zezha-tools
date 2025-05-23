import { Builder, By, until, Key, WebDriver } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome.js'; // Updated import
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config();

console.log("🚀 Starting dailyLoginAutomation...");
console.log("Username from .env:", process.env.REACT_APP_GREYTHR_USERNAME);



// Custom type for enhanced Chrome options
type EnhancedChromeOptions = chrome.Options & {
    addArguments(...args: string[]): EnhancedChromeOptions;
};


async function dailyLoginAutomation(): Promise<void> {
    const chromeOptions: EnhancedChromeOptions = new chrome.Options()
    .addArguments('--start-maximized')

        console.log("🛠️ Building WebDriver...");


       
      

    const driver: WebDriver = await new Builder()
        .forBrowser('chrome')
       // .setChromeOptions(chromeOptions)
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
       // Optional: Wait for a short period to allow the page to load
await driver.sleep(2000);
  

// Wait for the username input to be located and visible
const usernameInput = await driver.wait(
  until.elementLocated(By.id('username')), 10000
);
await driver.wait(until.elementIsVisible(usernameInput), 10000);
await usernameInput.sendKeys(username);

    

// Wait for the password input to be located and visible
const passwordInput = await driver.wait(
    until.elementLocated(By.id('password')), 10000
);
await driver.wait(until.elementIsVisible(passwordInput), 10000);
await passwordInput.sendKeys(password);

// Step 4: Click "Log in" button
const loginButton = await driver.wait(
  until.elementLocated(By.xpath("//button[@type='submit' and contains(text(), 'Log in')]")),
  10000
);
await driver.wait(until.elementIsVisible(loginButton), 10000);
await loginButton.click();

 // Step 5: Wait for page to load (after login)
await driver.sleep(3000); // wait for transition to complete

// Step 6: Click "Sign In" (targeting the inner native button)
// Wait until the .btn-container is visible
await driver.wait(until.elementLocated(By.css('.btn-container')), 10000);
await driver.wait(until.elementIsVisible(await driver.findElement(By.css('.btn-container'))), 10000);

// Find the container
const btnContainer = await driver.findElement(By.css('.btn-container'));

// Get all <gt-button> elements inside it
const gtButtons = await btnContainer.findElements(By.css('gt-button'));

if (gtButtons.length === 0) {
    console.error("⚠️ Login Error: No gt-button found");
    return;
}

// Look for the one with shade="primary"
let dailyButton = null;
for (const btn of gtButtons) {
    const shade = await btn.getAttribute("shade");
    if (shade && shade.toLowerCase() === "primary") {
        dailyButton = btn;
        break;
    }
}

// Fallback: just take the first button if primary not found
if (!dailyButton) {
    dailyButton = gtButtons[0];
}

// Scroll into view
await driver.executeScript("arguments[0].scrollIntoView(true);", dailyButton);

// Click using JS (reliable with custom elements)
await driver.executeScript("arguments[0].click();", dailyButton);

console.log("✅ Sign In clicked successfully");
await driver.sleep(5000);



console.log('✅ Successfully logged in and clicked Sign In at', new Date().toISOString());

} catch (error) {
const message = error instanceof Error ? error.message : String(error);
console.error(`❌ Automation failed: ${message}`);

// Optional: Save screenshot
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



// Execution with error propagation
dailyLoginAutomation()
    .catch(e => process.exit(1));