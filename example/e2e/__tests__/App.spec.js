describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have "Card #1" section', async () => {
    await expect(element(by.text('1'))).toBeVisible();
  });

  it('should have "Card #2" section', async () => {
    await expect(element(by.text('2'))).toBeVisible();
  });

  it('should have "Card #3" section', async () => {
    await expect(element(by.text('3'))).toBeVisible();
  });

  it('should have "Card #4" section', async () => {
    await expect(element(by.text('4'))).toBeVisible();
  });
});
