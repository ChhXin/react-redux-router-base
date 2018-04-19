import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import autoprefixer from 'autoprefixer';
import flexbugs from 'postcss-flexbugs-fixes'; // 修复 flexbox 已知的 bug
import cssnano from 'cssnano'; // 优化 css，对于长格式优化成短格式等
import incstr from 'incstr';

// 根目录上下文
import {urlContext} from '../client/utils/config';

const appRoot = path.resolve(__dirname, '../');
const appPath = path.resolve(appRoot, 'public');
const isAnalyze =
  process.argv.includes('--analyze') || process.argv.includes('--analyse');


// PC 端 browsers: ['Explorer >= 9', 'Edge >= 12', 'Chrome >= 49', 'Firefox >= 55', 'Safari >= 9.1']
// 手机端 browsers: ['Android >= 4.4', 'iOS >=9']
const browsers = ['Android >= 4.4', 'iOS >=9'];

// 混淆 css 变量名
const createUniqueIdGenerator = () => {
  const index = {};

  const generateNextId = incstr.idGenerator({
    // Removed "d" letter to avoid accidental "ad" construct.
    // @see https://medium.com/@mbrevda/just-make-sure-ad-isnt-being-used-as-a-class-name-prefix-or-you-might-suffer-the-wrath-of-the-558d65502793
    alphabet: 'abcefghijklmnopqrstuvwxyz0123456789_',
  });

  return (name) => {
    if (index[name]) {
      return index[name];
    }

    let nextId;

    do {
      // Class name cannot start with a number.
      nextId = generateNextId();
    } while (/^[0-9]/.test(nextId));

    index[name] = nextId;

    return index[name];
  };
};

const uniqueIdGenerator = createUniqueIdGenerator();

const generateScopedName = (localName, resourcePath) => {
  const componentName = resourcePath.split('/').slice(-2, -1);
  return uniqueIdGenerator(`${componentName}_${localName}`);
};

// scss config
function scssConfig(modules) {
  // 在 css-loader 中加入 sourceMap: true，可能会引起编译报错，比如 content: $font; 会编译报错
  return extractScss.extract({
    fallback: 'style-loader',
    use: [{
      loader: 'css-loader',
      options: modules ? {
        sourceMap: true,
        modules: true,
        minimize: true,
        localIdentName: '[local][contenthash:base64:5]',
        getLocalIdent: (context, localIdentName, localName) => {
          // FIXME 这样每次打包编译时，混淆的 css 名导致无法缓存，待解决实现
          return generateScopedName(localName, context.resourcePath);
        },
      } : {
        sourceMap: true,
        minimize: true,
      },
    }, {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
        plugins: [
          cssnano({
            autoprefixer: false,
          }),
          flexbugs(),
          autoprefixer({
            flexbox: 'no-2009',
            browsers,
          }),
        ],
      },
    }, {
      // Webpack loader that resolves relative paths in url() statements
      // based on the original source file
      loader: 'resolve-url-loader',
    }, {
      loader: 'sass-loader-joy-vendor', options: {
        sourceMap: true, // 必须保留
        modules,
        outputStyle: 'compressed', // 压缩
        precision: 15, // 设置小数精度
      },
    }],
  });
}

// multiple extract instances
const extractScss = new ExtractTextPlugin({
  filename: 'css/[name].[chunkhash:8].css',
  allChunks: true,
  ignoreOrder: true,
});
const extractCSS = new ExtractTextPlugin({
  filename: 'css/style.[name].[chunkhash:8].css',
  allChunks: true,
});

// 基于 webpack 的持久化缓存方案 可以参考 https://github.com/pigcan/blog/issues/9
const webpackConfig = {
  cache: false, // 开启缓存,增量编译
  bail: true, // 如果发生错误，则不继续尝试
  devtool: 'source-map', // 生成 source-map文件 原始源码
  // Specify what bundle information gets displayed
  // https://webpack.js.org/configuration/stats/
  stats: {
    cached: false,
    cachedAssets: false,
    chunks: false,
    chunkModules: false,
    colors: true,
    hash: false,
    modules: false,
    reasons: false,
    timings: true,
    version: false,
  },
  target: 'web', // webpack 能够为多种环境构建编译, 默认是 'web'，可省略 https://doc.webpack-china.org/configuration/target/
  resolve: {
    // 自动扩展文件后缀名
    extensions: ['.js', '.scss', '.css', '.png', '.jpg', '.gif'],
    // 模块别名定义，方便直接引用别名
    alias: {},
    // 参与编译的文件
    modules: [
      'client',
      'node_modules',
    ],
  },

  // 入口文件 让webpack用哪个文件作为项目的入口
  entry: {
    home: ['./client/pages/home/index.js'],
    about: ['./client/pages/about/index.js'],
    page1: ['./client/pages/page-1/index.js'],
    page2: ['./client/pages/page-2/index.js'],
    'h5-example': ['./client/pages/h5-example/index.js'],
    vendor: [
      'react',
      'react-dom',
    ],
  },

  // 出口 让webpack把处理完成的文件放在哪里
  output: {
    path: path.join(appPath, 'dist'),
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
    publicPath: `${urlContext}/dist/`,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    sourceMapFilename: 'map/[file].map',
  },

  module: {
    // Make missing exports an error instead of warning
    // 缺少 exports 时报错，而不是警告
    strictExportPresence: true,
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: false,
            babelrc: false,
            // babel-preset-env 的配置可参考 https://zhuanlan.zhihu.com/p/29506685
            // 他会自动使用插件和 polyfill
            presets: [
              'react', ['env', {
                // 设为 true 会根据需要自动导入用到的 es6 新方法，而不是一次性的引入 babel-polyfill
                targets: {
                  browsers,
                },
                modules: false, // 设为 false，交由 Webpack 来处理模块化
                // 设为 true 会根据需要自动导入用到的 es6 新方法，而不是一次性的引入 babel-polyfill
                // 比如使用 Promise 会导入 import "babel-polyfill/core-js/modules/es6.promise";
                useBuiltIns: true,
              }],
            ],
            plugins: [
              'syntax-dynamic-import', // 支持'import()'
              'transform-decorators-legacy', // 编译装饰器语法
              'transform-class-properties', // 解析类属性，静态和实例的属性
              'transform-object-rest-spread', // 支持对象 rest
              // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-constant-elements
              'transform-react-constant-elements',
              // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-inline-elements
              'transform-react-inline-elements',
              [
                'transform-react-remove-prop-types',
                {
                  mode: 'remove', // 默认值为 remove ，即删除 PropTypes
                  removeImport: true, // the import statements are removed as well. import PropTypes from 'prop-types'
                  ignoreFilenames: ['node_modules'],
                },
              ],
            ],
          },
        },
      },
      // css 一般都是从第三方库中引入，故不需要 CSS 模块化处理
      {
        test: /\.css/,
        use: extractCSS.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: true,
              // CSS Nano options http://cssnano.co/
              minimize: {
                discardComments: { removeAll: true },
              },
              // CSS Modules https://github.com/css-modules/css-modules
              modules: true,
              localIdentName: '[hash:base64:5]',
            },
          }, {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: [
                cssnano({
                  autoprefixer: false,
                }),
                flexbugs(),
                autoprefixer({
                  flexbox: 'no-2009',
                  browsers,
                }),
              ],
            },
          }, {
            // Webpack loader that resolves relative paths in url() statements
            // based on the original source file
            loader: 'resolve-url-loader',
          }],
          // publicPath: '/public/dist/' 这里如设置会覆盖 output 中的 publicPath
        }),
      },
      // 为了减少编译生产的 css 文件大小，公共的 scss 不使用 css 模块化
      {
        test: /\.scss/,
        include: path.resolve(appRoot, './client/scss/perfect.scss'),
        use: scssConfig(false),
      },
      {
        test: /\.scss/,
        exclude: path.resolve(appRoot, './client/scss/perfect.scss'),
        use: scssConfig(true),
      },
      // Rules for images
      {
        test: /\.(bmp|gif|jpg|jpeg|png|svg)$/,
        oneOf: [
          // Inline lightweight images into CSS
          {
            issuer: /\.(css|less|scss)$/, // issuer 表示在这些文件中处理
            oneOf: [
              // Inline lightweight SVGs as UTF-8 encoded DataUrl string
              {
                test: /\.svg$/,
                loader: 'svg-url-loader',
                exclude: path.resolve(appRoot, './client/scss/common/_iconfont.scss'), // 除去字体文件
                options: {
                  name: '[hash:8].[ext]',
                  limit: 4096, // 4kb
                },
              },

              // Inline lightweight images as Base64 encoded DataUrl string
              // https://github.com/webpack/url-loader
              {
                loader: 'url-loader',
                options: {
                  name: '[hash:8].[ext]',
                  limit: 4096, // 4kb
                },
              },
            ],
          },

          // Or return public URL to image resource
          {
            loader: 'file-loader',
            options: {
              name: '[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(mp4|ogg|eot|woff|ttf)$/,
        loader: 'file-loader',
        options: {
          name: '[hash:8].[ext]',
        },
      },
    ],
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    // 用来优化生成的代码 chunk，合并相同的代码
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin({// Scope Hoisting-作用域提升
      // 检查所有的模块
      maxModules: Infinity,
      // 将显示绑定失败的原因
      optimizationBailout: true,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    extractScss,
    extractCSS,
    // 以下两个插件可以解决持久化缓存，但由于用到了模块化，混淆的 css 名导致无法缓存
    // 故先注释掉，待后续解决了，再打开，或者不使用 css Module 时
    new webpack.HashedModuleIdsPlugin(),
    new webpack.NamedChunksPlugin(),
    // https://doc.webpack-china.org/guides/code-splitting-libraries/#manifest-
    new webpack.optimize.CommonsChunkPlugin('vendor'),
    new ManifestPlugin({
      basePath: `${urlContext}/dist/`,
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compressor: {
        warnings: false,
        /* eslint-disable camelcase */
        drop_console: process.env.NODE_ENV === 'production', // 只有正式环境去掉 console
      },
      mangle: {
        except: [], // 设置不混淆变量名
      },
    }),
    new webpack.BannerPlugin({
      banner: [
        '/*!',
        ' react-redux-router-base',
        ` Copyright © 2016-${new Date().getFullYear()} JD Finance.`,
        '*/',
      ].join('\n'),
      raw: true,
      entryOnly: true,
    }),
    new webpack.LoaderOptionsPlugin({
      /* UglifyJsPlugin 不再压缩 loaders。在未来很长一段时间里，需要通过设置 minimize:true 来压缩 loaders。
       loaders 的压缩模式将在 webpack 3 或后续版本中取消。
       为了兼容旧的 loaders，loaders 可以通过插件来切换到压缩模式： */
      minimize: true,
    }),
    ...(isAnalyze
      ? [
        // Webpack Bundle Analyzer
        // https://github.com/th0r/webpack-bundle-analyzer
        new BundleAnalyzerPlugin(),
      ]
      : []),
  ],
};

export default webpackConfig;
