import { WorkAppPage } from './app.po';

describe('work-app App', function() {
  let page: WorkAppPage;

  beforeEach(() => {
    page = new WorkAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
