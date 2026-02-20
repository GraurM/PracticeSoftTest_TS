import { APIResponse } from '@playwright/test';

export async function parseJson<T>(response: APIResponse): Promise<T> {
  // Check if response is successful (status 200-299)
  if (!response.ok()) {
    const errorBody = await response.text();
    throw new Error(
      `API request failed with status ${response.status()}: ${errorBody}`
    );
  }
  return await response.json() as T;
}