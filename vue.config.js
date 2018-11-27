module.exports = {
  // see: https://www.npmjs.com/package/@vue/cli-plugin-pwa
  // warning: at time of writing this does not actually spit out manifest.json. In fact,
  // it has nothing to do with manifest.json besides injecting a link to the manifest file.
  // This only injects meta and link items into the <head> tag. So stripped any such settings
  // out of here and hand-rolled my own public/manifest.json.
  pwa: {     
    //GenerateSW : only caches files according to the given options. rigid, can't modify.
    //InjectManifest: configurable! use this.
    workboxPluginMode: 'InjectManifest',

    workboxOptions: {
      //ONLY in InjectManifest mode, the swDest filename will default to swSrc !! So use the same filename during registration !
      swSrc: 'src/serviceworker.js',

      //updated SWs are both eager and bossing, taking over from old ones soon as poss:
      // skipWaiting: true,
      // clientsClaim: true,
    }
  }
}

// better way:
// module.exports = {
//   configureWebpack: config => {
//     if (process.env.NODE_ENV === 'production') {
//       // mutate config for production...
//     } else {
//       // mutate for development...
//     }
//   }
// }