// forge.config.js

const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: 'src/icon.ico'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  hooks: {
    packageAfterCopy: async (config, buildPath, electronVersion, platform, arch) => {
      console.log('Building React app...');
      // Menjalankan perintah 'npm run build' di root direktori proyek
      // 'stdio: inherit' akan menampilkan output build di konsol
      execSync('npm run build', { stdio: 'inherit' });

      console.log('Copying React build to package...');
      const buildSourcePath = path.join(__dirname, 'build');
      // buildPath adalah direktori sementara tempat Forge menaruh file aplikasi
      const buildDestPath = path.join(buildPath, 'build');

      // Salin folder 'build' yang sudah jadi ke dalam direktori paket
      await fs.copy(buildSourcePath, buildDestPath);
    }
  }
};