export const projects = [
  {
    id: '1',
    title: 'Super Tools',
    type: 'mod',
    launcher: 'forge',
    version: '1.20.1',
    description: 'Adds super powered tools to the game that can mine 3x3 areas.',
    problem: 'Mining large areas takes too long and uses too much durability.',
    solution: 'Super tools mine 3x3 areas and have 5x durability of regular tools.',
    specs: 'Requires Forge 47.1.0+',
    icon: 'build',
    dependency: 'None',
    environment: 'Client + Server'
  },
  {
    id: '2',
    title: 'Chat Colors',
    type: 'plugin',
    launcher: 'paper',
    version: '1.20.4',
    description: 'Allow players to use color codes in chat.',
    problem: 'Chat is boring and monochrome.',
    solution: 'Parses legacy and hex color codes in chat messages.',
    specs: 'Works on Paper, Spigot, Purpur.',
    icon: 'chat',
    dependency: 'MiniMessage',
    environment: 'Server Side'
  },
  {
    id: '3',
    title: 'Mob Heads',
    type: 'datapack',
    launcher: null,
    version: '1.20+',
    description: 'All mobs have a chance to drop their heads.',
    problem: 'Only a few mobs drop heads in vanilla.',
    solution: 'Adds loot tables for every mob to drop their head.',
    specs: 'Drop rate: 2.5% (affected by looting).',
    icon: 'face',
    dependency: 'Vanilla',
    environment: 'Server Side'
  },
  {
    id: '4',
    title: 'Sodium Extra',
    type: 'mod',
    launcher: 'fabric',
    version: '1.20.1',
    description: 'Extra features for Sodium like better clouds and fog control.',
    problem: 'Sodium is great but misses some vanilla video settings.',
    solution: 'Adds back tabs for video settings in a clean UI.',
    specs: 'Requires Sodium.',
    icon: 'settings_video',
    dependency: 'Sodium',
    environment: 'Client Side'
  },
  {
    id: '5',
    title: 'Tech Reborn',
    type: 'mod',
    launcher: 'neoforge',
    version: '1.21',
    description: 'A complete tech overhaul inspired by classic mods.',
    problem: 'Current tech mods are too simple.',
    solution: 'Adds complex machinery and processing chains.',
    specs: 'NeoForge 20.4+',
    icon: 'memory',
    dependency: 'RebornCore',
    environment: 'Client + Server'
  },
  {
    id: '999',
    title: 'Hidden Admin Mod',
    type: 'mod',
    launcher: 'fabric',
    version: '0.0.1',
    description: 'This is a hidden mod for admins only.',
    problem: 'Secrets need to be kept.',
    solution: 'Hides the mod from public view.',
    specs: 'Top Secret.',
    icon: 'security',
    dependency: 'None',
    environment: 'Server Side',
    hidden: true
  }
];

export function getProjects() {
  return projects;
}

export function getProjectById(id) {
  return projects.find(p => p.id === id);
}

export function getProjectsByType(type) {
  return type === 'all' ? projects : projects.filter(p => p.type === type);
}
