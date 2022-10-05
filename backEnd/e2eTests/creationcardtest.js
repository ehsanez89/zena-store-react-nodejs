const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const casual = require('casual');
describe('card', function () {
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
    it('card ok', async function () {
        const title = casual.title;
        const description = casual.short_description;
        const quantity = casual.integer(1, 200);
        const price = casual.integer(1, 50);
        await driver.get('http://localhost:3000/');
        await driver.findElement(By.xpath("//a[contains(text(),'SignIn')]")).click();
        await driver.findElement(By.css('.mt-3 .form-control')).sendKeys('bello@figo.gu');
        await driver.findElement(By.name('password')).sendKeys('Maga2020!');
        await driver.findElement(By.css('.btn')).click();
        await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Bello Figo')]")), 5000);
        await driver.findElement(By.xpath('//a[3]')).click();
        await driver.findElement(By.xpath('//input')).click();
        await driver.findElement(By.xpath('//input')).sendKeys(title);
        await driver.findElement(By.xpath('//span/input')).click();
        await driver.findElement(By.xpath('//span/input')).sendKeys(price);
        await driver.findElement(By.xpath('//div[3]/div[2]/span/input')).click();
        await driver.findElement(By.xpath('//div[3]/div[2]/span/input')).sendKeys(quantity);
        await driver.findElement(By.xpath('//div[2]/div/div/div')).click();
        await driver.findElement(By.xpath('//div[2]/div/div/div[3]/div')).click();
        await driver.findElement(By.xpath('//div[2]/div/div/div[3]/div[2]')).click();
        await driver.findElement(By.xpath('//div[2]/div')).click();
        await driver.findElement(By.xpath('//div[6]/div[2]/div/div/div/input')).click();
        await driver.findElement(By.xpath('//th[2]')).click();
        await driver.findElement(By.xpath('//tr[2]/td[3]')).click();
        await driver.findElement(By.xpath('//tr[2]/td[5]')).click();
        await driver.findElement(By.xpath('//div[2]/div')).click();
        await driver.findElement(By.xpath('//div[7]/div[2]/div/div/div/input')).click();
        await driver.findElement(By.xpath('//div[7]/div[2]/div/div[2]/div/table/thead/tr/th[2]')).click();
        await driver.findElement(By.xpath('//table[2]/tbody/tr[3]/td[3]')).click();
        await driver.findElement(By.xpath('//div[7]/div[2]/div/div[2]/div/table/tbody/tr[2]/td[6]')).click();
        await driver.findElement(By.xpath('//div[2]/div')).click();
        await driver.findElement(By.xpath('//textarea')).click();
        await driver.findElement(By.xpath('//textarea')).sendKeys(description);
        await driver.findElement(By.xpath('//div[10]/a')).click();
        await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(), 'New Service/Product Submitted')]")),
            5000,
        );
        await driver.manage().window().setRect(1936, 1066);
    });
    it('card fail title', async function () {
        const title = casual.title;
        const description = casual.short_description;
        const quantity = casual.integer(1, 200);
        const price = casual.integer(1, 50);
        await driver.get('http://localhost:3000/');
        await driver.findElement(By.xpath("//a[contains(text(),'SignIn')]")).click();
        await driver.findElement(By.css('.mt-3 .form-control')).sendKeys('bello@figo.gu');
        await driver.findElement(By.name('password')).sendKeys('Maga2020!');
        await driver.findElement(By.css('.btn')).click();
        await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Bello Figo')]")), 5000);
        await driver.findElement(By.xpath('//a[3]')).click();
        await driver.findElement(By.xpath('//div[10]/a')).click();
        await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(), 'You must insert a valid title!')]")),
            5000,
        );
        await driver.manage().window().setRect(1936, 1066);
    });
    it('card fail date', async function () {
        const title = casual.title;
        const description = casual.short_description;
        const quantity = casual.integer(1, 200);
        const price = casual.integer(1, 50);
        await driver.get('http://localhost:3000/');
        await driver.findElement(By.xpath("//a[contains(text(),'SignIn')]")).click();
        await driver.findElement(By.css('.mt-3 .form-control')).sendKeys('bello@figo.gu');
        await driver.findElement(By.name('password')).sendKeys('Maga2020!');
        await driver.findElement(By.css('.btn')).click();
        await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Bello Figo')]")), 5000);
        await driver.findElement(By.xpath('//a[3]')).click();
        await driver.findElement(By.xpath('//input')).click();
        await driver.findElement(By.xpath('//input')).sendKeys(title);
        await driver.findElement(By.xpath('/html/body/div/div/div[2]/div/div/form/div/div[10]/a')).click();
        await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(), 'You must insert valid dates!')]")),
            5000,
        );
        await driver.manage().window().setRect(1936, 1066);
    });
});
