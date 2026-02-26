export async function getApiKey(): Promise<string | null> {
  const { apiKey } = await chrome.storage.local.get("apiKey");
  return apiKey ?? null;
}

export async function saveApiKey(key: string): Promise<void> {
  await chrome.storage.local.set({ apiKey: key });
}

export async function removeApiKey(): Promise<void> {
  await chrome.storage.local.remove("apiKey");
}
