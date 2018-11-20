module.exports = {
  pwa: { name: 'Vuedo',
    themeColor: '#209cee',
    msTileColor: '#FFFFFF',

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