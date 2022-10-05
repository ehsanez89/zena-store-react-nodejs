const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const casual = require('casual');

describe('checkInsertProduct', function () {
    this.timeout(30000);
    let driver;
    let vars;
    const title = casual.title;
    const description = casual.short_description;
    const quantity = casual.integer(1, 100);
    const price = casual.double(1, 99);
    const address = casual.address;
    const absolutePath = '/Users/Vincenzo/Dropbox/UNIVERSITA/5^anno/CP/GitCp/CPProject2020/'; // change it for testing if you aren't Vincent :P
    const relativeImgPathChild = 'backEnd/public/images/products/4571/051559a62744caf2f2c269338df3048a.jpeg';
    const relativeImgPath = 'backEnd/public/images/products/default_image.png';
    const xssString = '<body onload=alert(‘something’)>';
    const xssStringToCheck = '&lt;body onload=alert(‘something’)&gt;';
    beforeEach(async function () {
        driver = await new Builder().forBrowser('chrome').build();
        vars = {};
    });
    afterEach(async function () {
        await driver.quit();
    });
    it('check insert product inside gallery', async function () {
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
        await driver.findElement(By.xpath('//div[4]/div[2]/div/div')).click();
        await driver.findElement(By.xpath('//div[2]/div/div/div[3]/div')).click();
        await driver.findElement(By.xpath('//div[2]/div/div/div[3]/div[2]')).click();
        await driver.findElement(By.xpath('//div[2]/div')).click();
        await driver.findElement(By.xpath('//div[2]/div')).click();
        await driver.findElement(By.name('address')).click();
        await driver.findElement(By.name('address')).sendKeys(address);
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
        await driver.findElement(By.css('.chooseFileButton')).click();
        await driver.findElement(By.css('input:nth-child(5)')).sendKeys(absolutePath + relativeImgPath);
        await driver.findElement(By.xpath('//div[10]/a')).click();
        await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(), 'New Service/Product Submitted')]")),
            5000,
        );
        await driver.get('http://localhost:3000/productsGallery');
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), '" + title + "')]")), 5000);
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), '" + description + "')]")), 5000);
    });
});
