import { execSync } from 'child_process'
import { mkdirSync, renameSync } from 'fs'
import { join } from 'path'

const targets = {
  linux: 'node20-linux-x64',
  macos: 'node20-macos-x64',
  win: 'node20-win-x64',
}

const outputBase = join(__dirname, '../bin')

for (const [platform, target] of Object.entries(targets)) {
  const outputName = platform === 'win' ? 'cli.exe' : 'cli'
  const tempOutput = join(outputBase, `cli-${platform}${platform === 'win' ? '.exe' : ''}`)
  const finalOutput = join(outputBase, platform, outputName)

  console.log(`Packaging for ${platform}...`)
  execSync(`pkg . --target ${target} --output ${tempOutput}`, { stdio: 'inherit' })

  mkdirSync(join(outputBase, platform), { recursive: true })
  renameSync(tempOutput, finalOutput)
}
