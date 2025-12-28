// tests/eventswidget.spec.js
const { test, expect } = require('@playwright/test');

const WIDGET_PATH = '/eventswidget/';

test.describe('Конструктор календаря мероприятий 3S.INFO', () => {
  test('страница открывается и есть основные элементы', async ({ page }) => {
    await page.goto(WIDGET_PATH);

    // <title>
    await expect(page).toHaveTitle(/Конструктор календаря мероприятий/i);

    // главный заголовок
    await expect(
      page.getByRole('heading', {
        name: /Начните создавать свой календарь мероприятий!/i,
      }),
    ).toBeVisible();

    // шаги мастера
    await expect(page.getByText('Шаг 1')).toBeVisible();
    await expect(page.getByText('Выберите тематику')).toBeVisible();

    await expect(page.getByText('Шаг 2')).toBeVisible();
    await expect(page.getByText('Выберите страны')).toBeVisible();

    await expect(page.getByText('Шаг 3')).toBeVisible();
    await expect(page.getByText('Выберите размер вашего блока')).toBeVisible();

    await expect(page.getByText('Шаг 4')).toBeVisible();
    await expect(page.getByText('Выберите цветовую гамму')).toBeVisible();

    // кнопки
    await expect(page.getByText('Сгенерировать превью')).toBeVisible();
    await expect(page.getByText('Скопировать код')).toBeVisible();

    // есть хотя бы одно событие (ссылка на 3snet.co)
    const events = page.locator('a[href*="3snet.co"]');
    await expect(events).toHaveCountGreaterThan(0);
  });

  test('можно сгенерировать превью без ошибок', async ({ page }) => {
    await page.goto(WIDGET_PATH);

    // попробуем выбрать все тематики и страны, если такие кнопки есть
    const selectAllButtons = page.getByText('Выбрать все', { exact: true });
    const countSelectAll = await selectAllButtons.count();
    if (countSelectAll >= 1) {
      await selectAllButtons.nth(0).click(); // тематики
    }
    if (countSelectAll >= 2) {
      await selectAllButtons.nth(1).click(); // страны
    }

    // просто жмём "Сгенерировать превью" и проверяем, что страница жива
    await page.getByText('Сгенерировать превью').click();

    // заголовок на месте
    await expect(
      page.getByRole('heading', {
        name: /Начните создавать свой календарь мероприятий!/i,
      }),
    ).toBeVisible();

    // кнопка "Скопировать код" видна
    await expect(page.getByText('Скопировать код')).toBeVisible();

    // и по-прежнему есть события
    const events = page.locator('a[href*="3snet.co"]');
    await expect(events).toHaveCountGreaterThan(0);
  });
});

// небольшой хелпер для читабельности
expect.extend({
  async toHaveCountGreaterThan(locator, expected) {
    const actual = await locator.count();
    const pass = actual > expected;
    return {
      pass,
      message: () =>
        `Ожидали, что элементов будет > ${expected}, а получили ${actual}`,
    };
  },
});
