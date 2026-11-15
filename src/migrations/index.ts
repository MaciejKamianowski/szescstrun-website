import * as migration_20261115_123647_initial from './20261115_123647_initial';
import * as migration_20261115_125220_add_site_logos from './20261115_125220_add_site_logos';

export const migrations = [
  {
    up: migration_20261115_123647_initial.up,
    down: migration_20261115_123647_initial.down,
    name: '20261115_123647_initial',
  },
  {
    up: migration_20261115_125220_add_site_logos.up,
    down: migration_20261115_125220_add_site_logos.down,
    name: '20261115_125220_add_site_logos'
  },
];
