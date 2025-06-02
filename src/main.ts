// Just in case
/// <reference path="../typings/index.d.ts" />
import { readFileSync } from 'fs'
const pluginData = JSON.parse(readFileSync('plugin.json', 'utf8'))

class AcodePlugin {
  public baseUrl: string | undefined
  public id: string

  constructor(data: any) {
    this.id = data.id
  }

  async init($page: WCPage, cacheFile: any, cacheFileUrl: string): Promise<void> {
    // Add your initialization code here
  }

  async destroy() {
    // Add your cleanup code here
  }
}

if (window.acode) {
  const plugin = new AcodePlugin(pluginData)
  acode.setPluginInit(plugin.id, async (baseUrl: string, $page: WCPage, { cacheFileUrl, cacheFile }: any) => {
    if (!baseUrl.endsWith('/')) {
      baseUrl += '/'
    }
    plugin.baseUrl = baseUrl
    await plugin.init($page, cacheFile, cacheFileUrl)
  })
  acode.setPluginUnmount(plugin.id, () => {
    plugin.destroy()
  })
}
