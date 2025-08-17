import { type Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { WEBSITE_CONFIGS } from '../config/environment';

export class HomePage extends BasePage {
  private selectors = {
    loginButton: 'a:has-text("Login")',
    homeLink: 'a:has-text("Home")',
    featuresLink: 'a:has-text("Features")',
    developersLink: 'a:has-text("Developers")',
    heroSection: 'h1',
    featuresSection: 'h2:has-text("Our features")',
    footerSection: 'text="© 2024 Mezon. All rights reserved."',
    
    navigationMenu: '.header',
    mobileMenuToggle: '.menu-toggle, .hamburger, [data-testid="mobile-menu"]',
    
    mainContent: 'body, main, div:has(h1)',
    pageTitle: 'h1',
  };

  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    const baseUrl = WEBSITE_CONFIGS.MEZON.baseURL;
    await this.page.goto(baseUrl);
    await this.page.waitForLoadState('networkidle');
  }

  async verifyOnHomepage(): Promise<void> {
    const currentUrl = this.page.url();
    const baseUrl = WEBSITE_CONFIGS.MEZON.baseURL;
    expect(currentUrl).toContain(baseUrl);
    
    await expect(this.page.locator(this.selectors.mainContent)).toBeVisible();
  }

  async verifyNavigationMenu(): Promise<void> {
    await expect(this.page.locator(this.selectors.navigationMenu)).toBeVisible();
  }

  async clickLogin(): Promise<void> {
    const loginBtn = this.page.locator(this.selectors.loginButton);
    await loginBtn.waitFor({ state: 'visible', timeout: 10000 });
    await loginBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyLinkExists(linkText: string): Promise<void> {
    const link = this.page.locator(`a:has-text("${linkText}")`);
    await expect(link).toBeVisible();
  }

  async verifyHeroSection(): Promise<void> {
    await expect(this.page.locator(this.selectors.heroSection)).toBeVisible();
  }

  async verifyFeaturesSection(): Promise<void> {
    await expect(this.page.locator(this.selectors.featuresSection)).toBeVisible();
  }

  async verifyFooterSection(): Promise<void> {
    await expect(this.page.locator(this.selectors.footerSection)).toBeVisible();
  }

  async verifyMobileNavigation(): Promise<void> {
    const mobileToggle = this.page.locator(this.selectors.mobileMenuToggle);
    const navigation = this.page.locator(this.selectors.navigationMenu);
    
    const isMobileToggleVisible = await mobileToggle.isVisible();
    const isNavigationVisible = await navigation.isVisible();
    
    expect(isMobileToggleVisible || isNavigationVisible).toBeTruthy();
  }

  async verifyResponsiveLayout(): Promise<void> {
    await expect(this.page.locator(this.selectors.mainContent)).toBeVisible();
    
    const viewport = await this.page.viewportSize();
    expect(viewport?.width).toBeLessThanOrEqual(375);
  }

  async verifyCriticalElements(): Promise<void> {
    await expect(this.page.locator(this.selectors.mainContent)).toBeVisible();
    await expect(this.page.locator(this.selectors.navigationMenu)).toBeVisible();
    await expect(this.page.locator(this.selectors.loginButton)).toBeVisible();
  }

  async verifyNoBrokenLinks(): Promise<void> {
    const links = await this.page.locator('a[href]').all();
    let brokenLinksCount = 0;
    
    for (const link of links.slice(0, 5)) {
      try {
        const href = await link.getAttribute('href');
        if (href && href.startsWith('http')) {
          const response = await this.page.request.get(href);
          if (response.status() >= 400) {
            brokenLinksCount++;
          }
        }
      } catch (error) {
        console.log(`Could not check link: ${error}`);
      }
    }
    
    expect(brokenLinksCount).toBe(0);
  }

  async isUserLoggedIn(): Promise<boolean> {
    try {
      const loginBtn = this.page.locator(this.selectors.loginButton);
      return !(await loginBtn.isVisible());
    } catch {
      return false;
    }
  }

  async verifyLoginButton(): Promise<void> {
    await expect(this.page.locator(this.selectors.loginButton)).toBeVisible();
  }
}