export async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json();
}

export async function loadAllData() {
  const [profile, roles, groups, items, details, uiConfig] = await Promise.all([
    loadJson('data/profile.json'),
    loadJson('data/roles.json'),
    loadJson('data/groups.json'),
    loadJson('data/items.json'),
    loadJson('data/details.json'),
    loadJson('data/ui-config.json'),
  ]);

  return { profile, roles, groups, items, details, uiConfig };
}
