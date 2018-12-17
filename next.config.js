const withSass = require('@zeit/next-sass')
const withCSS = require('@zeit/next-css')
module.exports = withCSS(withSass({
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|md)$/,
      use: {
        loader: 'raw-loader',
        options: {
          limit: 100000
        },
      }
    })

    return config
  },
}))

// module.exports = {
//   async exportPathMap () {
//     return {
//       '/': { page: '/' },
//       '/novel-:e-:id': ({ id, e }) => ({ page: '/episode', query: { id,e } }),
//       '/edit-:e-:id': ({ id, e }) => ({ page: '/editor-episode', query: { id,e } }),
//       '/novel-:id': ({ id}) => ({ page: '/novel', query: { id } }),
//       '/new/:id': ({ id }) => ({ page: '/new-episode', query: { id } }),
//       '/editor/:id': ({ id }) => ({ page: '/editor', query: { id } }),
//       '/setting/tap?:id': ({ id }) => ({ page: '/setting', query: { id } }),
//       '/bookmark': { page: '/bookmark'},
//       '/history': { page: '/history'},
//       '/search': { page: '/search'},
//       '/sign-in': { page: '/sign-in'},
//       '/sign-up': { page: '/sign-up'},
//     }
//   }
// }