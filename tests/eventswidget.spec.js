// tests/eventswidget.spec.js
const { test, expect } = require('@playwright/test');

const WIDGET_PATH = '/eventswidget/';

test.describe('Конструктор календаря мероприятий 3S.INFO', () => {
  test('страница открывается и отображает основные элементы', async ({ page }) => {
    await page.goto(WIDGET_PATH);

    await expect(page).toHaveTitle(/Конструктор календаря мероприятий/i);

    await expect(
      page.getByRole('heading', {
        name: 'Начните создавать свой календарь мероприятий!',
      }),
    ).toBeVisible();

    await expect(page.getByText('Шаг 1')).toBeVisible();
    await expect(page.getByText('Выберите тематику')).toBeVisible();

    await expect(page.getByText('Шаг 2')).toBeVisible();
    await expect(page.getByText('Выберите страны')).toBeVisible();

    await expect(page.getByText('Шаг 3')).toBeVisible();
    await expect(page.getByText('Выберите размер вашего блока')).toBeVisible();

    await expect(page.getByText('Шаг 4')).toBeVisible();
    await expect(page.getByText('Выберите цветовую гамму')).toBeVisible();

    const events = page.locator('a[href*="3snet.co"]');
    const count = await events.count();
    expect(count).toBeGreaterThan(0);
  });

  test('happy path — настройка виджета и генерация превью', async ({ page }) => {
    await page.goto(WIDGET_PATH);

    const selectAllButtons = page.getByText('Выбрать все', { exact: true });
    const total = await selectAllButtons.count();

    if (total >= 1) await selectAllButtons.nth(0).click();
    if (total >= 2) await selectAllButtons.nth(1).click();

    const width = page.getByLabel('Ширина, px:');
    const height = page.getByLabel('Высота, px:');

    await width.fill('800');
    await height.fill('600');

    await page.getByText('Светлая тема').click().catch(() => {});

    await page.getByText('Сгенерировать превью').click();

    await expect(page.getByText('Скопировать код')).toBeVisible();

    const events = page.locator('a[href*="3snet.co"]');
    expect(await events.count()).toBeGreaterThan(0);
  });

  test('негатив — генерация без выбора тематики не ломает страницу', async ({ page }) => {
    await page.goto(WIDGET_PATH);

    const events = page.locator('a[href*="3snet.co"]');
    const initial = await events.count();

    const selectAllButtons = page.getByText('Выбрать все', { exact: true });
    if ((await selectAllButtons.count()) >= 2) {
      await selectAllButtons.nth(1).click();
    }

    const width = page.getByLabel('Ширина, px:');
    const height = page.getByLabel('Высота, px:');

    await width.fill('800');
    await height.fill('600');

    await page.getByText('Темная тема').click().catch(() => {});
    await page.getByText('Сгенерировать превью').click();

    await expect(
      page.getByRole('heading', {
        name: 'Начните создавать свой календарь мероприятий!',
      }),
    ).toBeVisible();

    expect(await events.count()).toBeGreaterThanOrEqual(initial);
  });
});
