// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const casual = require('casual');
describe('history', function () {
    this.timeout(30000);
    let driver;
    let vars;
    beforeEach(async function () {
        driver = await new Builder().forBrowser('chrome').build();
        vars = {};
    });
    afterEach(async function () {
        await driver.quit();
    });
    it('transaction', async function() {
      await driver.get("http://localhost:3000/")
      await driver.manage().window().setRect(1936, 1066)
      await driver.findElement(By.css(".navbar-nav:nth-child(3) > .mx-3:nth-child(1)")).click()
      {
        const element = await driver.findElement(By.css(".navbar-nav:nth-child(3) > .mx-3:nth-child(1)"))
        await driver.actions({ bridge: true }).moveToElement(element).perform()
      }
      {
        const element = await driver.findElement(By.CSS_SELECTOR, "body")
        await driver.actions({ bridge: true }).moveToElement(element, 0, 0).perform()
      }
      await driver.findElement(By.css(".mt-3 .form-control")).click()
      await driver.findElement(By.css(".mt-3 .form-control")).sendKeys("bello@figo.gu")
      await driver.findElement(By.name("password")).click()
      await driver.findElement(By.name("password")).sendKeys("Maga2020!")
      await driver.findElement(By.css(".btn")).click()
      await driver.findElement(By.css("svg")).click()
      await driver.findElement(By.css(".mx-3:nth-child(2)")).click()
      await driver.findElement(By.css(".col-lg-6:nth-child(3) .add")).click()
      await driver.findElement(By.css(".main-button")).click()
      await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(), 'Product bought successfully')]")),
        5000,
    );
    })
    })
    
    