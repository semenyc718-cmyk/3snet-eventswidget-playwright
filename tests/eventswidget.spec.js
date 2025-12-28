// tests/eventswidget.spec.js
const { test, expect } = require('@playwright/test');

const URL = 'https://dev.3snet.info/eventswidget/';

test('страница /eventswidget/ открывается', async ({ page }) => {
  // Ждём полной загрузки страницы
  await page.goto(URL, { waitUntil: 'load' });

  // URL содержит /eventswidget/
  await expect(page).toHaveURL(/eventswidget/);

  // Тег <body> виден — значит страница отрендерилась
  await expect(page.locator('body')).toBeVisible();
});
