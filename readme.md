# rollup-plugin-svg-sprite-deterministic

[![Build Status](https://travis-ci.org/mhassan1/rollup-plugin-svg-sprite.svg?branch=main)](https://travis-ci.org/mhassan1/rollup-plugin-svg-sprite)
[![Codecov](https://codecov.io/gh/mhassan1/rollup-plugin-svg-sprite/branch/main/graph/badge.svg)](https://codecov.io/gh/mhassan1/rollup-plugin-svg-sprite)

Create deterministic external svg sprite file from your bundle using Rollup and optimize it using [SVGO](https://github.com/svg/svgo).

This is a fork of [rollup-plugin-svg-sprite](https://www.npmjs.com/package/rollup-plugin-svg-sprite)
that creates deterministic (repeatable) builds.
See [#8](https://github.com/vladshcherbin/rollup-plugin-svg-sprite/pull/8)
for motivation.

Version `2.x` of this plugin has some breaking changes. See [#1](https://github.com/mhassan1/rollup-plugin-svg-sprite/pull/1).

## Installation

```bash
# yarn
yarn add rollup-plugin-svg-sprite-deterministic -D

# npm
npm install rollup-plugin-svg-sprite-deterministic -D
```

## Usage

```js
// rollup.config.js
import svgSprite from 'rollup-plugin-svg-sprite-deterministic'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/app.js',
    format: 'iife'
  },
  plugins: [
    svgSprite({
      outputFolder: 'dist/public'
    })
  ]
}
```

Next, import svg files in your project:

```js
import './svg/trash.svg'
import './svg/user.svg'
```

### Configuration

There are some useful options:

#### outputFolder

Type: `string`

Folder where generated svg sprite will be saved.

```js
svgSprite({
  outputFolder: 'dist/public'
})
```

#### minify

Type: `boolean` | Default: `true`

Minify generated svg sprite.

```js
svgSprite({
  outputFolder: 'dist/public',
  minify: false
})
```

## License

MIT
