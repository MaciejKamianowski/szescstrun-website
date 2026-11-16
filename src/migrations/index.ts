import * as migration_20261115_123647_initial from './20261115_123647_initial';
import * as migration_20261115_125220_add_site_logos from './20261115_125220_add_site_logos';
import * as migration_20261115_144144_add_media_r2_storage_fields from './20261115_144144_add_media_r2_storage_fields';
import * as migration_20261116_230635_editable_site_content from './20261116_230635_editable_site_content';

export const migrations = [
  {
    up: migration_20261115_123647_initial.up,
    down: migration_20261115_123647_initial.down,
    name: '20261115_123647_initial',
  },
  {
    up: migration_20261115_125220_add_site_logos.up,
    down: migration_20261115_125220_add_site_logos.down,
    name: '20261115_125220_add_site_logos',
  },
  {
    up: migration_20261115_144144_add_media_r2_storage_fields.up,
    down: migration_20261115_144144_add_media_r2_storage_fields.down,
    name: '20261115_144144_add_media_r2_storage_fields',
  },
  {
    up: migration_20261116_230635_editable_site_content.up,
    down: migration_20261116_230635_editable_site_content.down,
    name: '20261116_230635_editable_site_content'
  },
];
