import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/** Service addresses */
export interface AppConfig {
  [key: string]: string;
}

@Injectable()
export class AppConfigService {
  /** Service addresses */
  private appConfig!: AppConfig;

  constructor(
    private http: HttpClient
  ) {}

  /** Load app config from assets */
  loadAppConfig() {
     
    return this.http.get<AppConfig>('/assets/config/development.json');
  }

  /**
   * Set app config
   * @param config
   */
  async setAppConfig(config: AppConfig) {
    this.appConfig = config;
  }

  getAddress(item: string) {
    return this.appConfig[item];
  }
}
