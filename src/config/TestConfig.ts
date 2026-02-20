import fs from 'node:fs';
import path from 'node:path';

export interface TestConfig {
  baseUrl: string;
  apiBaseUrl: string;
  headless: boolean;
}

interface ProjectConfigFile {
  BASE_URL?: string;
  API_BASE_URL?: string;
  HEADLESS?: string;
}

const DEFAULT_BASE_URL = 'https://practicesoftwaretesting.com';
const DEFAULT_API_BASE_URL = 'https://api.practicesoftwaretesting.com';
const PROJECT_CONFIG_PATH = path.resolve(process.cwd(), 'config', 'test-config.json');

let cachedConfig: TestConfig | null = null;

const parseBoolean = (value: string | undefined, defaultValue: boolean): boolean => {
  if (value === undefined) {
    return defaultValue;
  }

  const normalized = value.trim().toLowerCase();

  if (['false', '0', 'no', 'off'].includes(normalized)) {
    return false;
  }

  if (['true', '1', 'yes', 'on'].includes(normalized)) {
    return true;
  }

  return defaultValue;
};

const loadConfigFromFile = (): ProjectConfigFile => {
  if (!fs.existsSync(PROJECT_CONFIG_PATH)) {
    return {};
  }

  try {
    const raw = fs.readFileSync(PROJECT_CONFIG_PATH, 'utf-8');
    return JSON.parse(raw) as ProjectConfigFile;
  } catch {
    return {};
  }
};

export const getTestConfig = (): TestConfig => {
  if (cachedConfig) {
    return cachedConfig;
  }

  const fileConfig = loadConfigFromFile();

  cachedConfig = {
    baseUrl: fileConfig.BASE_URL ?? DEFAULT_BASE_URL,
    apiBaseUrl: fileConfig.API_BASE_URL ?? DEFAULT_API_BASE_URL,
    headless: parseBoolean(fileConfig.HEADLESS, true),
  };

  return cachedConfig;
};
