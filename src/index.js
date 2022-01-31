import path from 'path'
import fs from 'fs-extra'
import cheerio from 'cheerio'
import { optimize } from 'svgo'

function createSymbol(code, id) {
  const markup = cheerio.load(code, { xmlMode: true })
  const svgMarkup = markup('svg')
  const symbolId = svgMarkup.find('title').text() || id

  markup('svg').replaceWith('<symbol/>')
  markup('symbol')
    .attr('id', symbolId)
    .attr('viewBox', svgMarkup.attr('viewBox'))
    .append(svgMarkup.children())

  return markup.xml('symbol')
}

function createSprite(symbols) {
  return `<svg xmlns="http://www.w3.org/2000/svg">${symbols.join('')}</svg>`
}

export default function svgSprite(options = {}) {
  const { minify = true, outputFolder } = options

  if (!outputFolder) {
    throw new Error('"outputFolder" must be set')
  }

  const svgoConfig = {
    js2svg: {
      pretty: !minify,
      indent: 2
    },
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            cleanupIDs: false,
            removeViewBox: false
          }
        }
      },
      {
        name: 'removeDimensions'
      }
    ]
  }

  const loadedSvgs = new Set()
  const convertedSvgs = new Map()

  return {
    name: 'svg-sprite',
    load(id) {
      if (id.endsWith('.svg')) {
        loadedSvgs.add(id)
      }

      return null
    },
    transform(code, id) {
      if (!id.endsWith('.svg')) {
        return null
      }

      const filename = path.basename(id, '.svg')

      convertedSvgs.set(id, createSymbol(code, filename))

      return {
        code: ''
      }
    },
    async writeBundle() {
      if (loadedSvgs.size) {
        const symbols = [...loadedSvgs.values()].map((id) => convertedSvgs.get(id)).sort()
        const { data } = await optimize(createSprite(symbols), svgoConfig)

        await fs.outputFile(`${outputFolder}/sprites.svg`, data)

        loadedSvgs.clear()
      }
    }
  }
}
