module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  hooks: {
    packageAfterExtract: async (config, buildPath, electronVersion, platform, arch) => {
      const path = require('path');
      const fs = require('fs-extra');
      const src = 'D:/A/OpenCV/opencv/build/x64/vc15/bin/opencv_world454.dll';
      const dest = path.join(buildPath, 'opencv_world454.dll');
      await fs.copy(src, dest);
    }
  },
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
  ],
};
