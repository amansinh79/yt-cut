#!/usr/bin/env node

const minimist = require('minimist')
const ytdl = require('ytdl-core')
const { spawn } = require('child_process')
const inq = require('inquirer')

const args = minimist(process.argv.slice(2))
const start = args.s && hmsToSecondsOnly(args.s.toString())
const end = args.e && hmsToSecondsOnly(args.e.toString())
const url = args._[0]
const op = args.o || 'output.mp4'
const r = args.r

console.log('Loading...')

ytdl.getInfo(url).then(async (info) => {
  const length = info.videoDetails.lengthSeconds - 1

  if (end && end > length) {
    console.log('End out of range!')
    process.exit()
  }

  const videoStreams = info.formats.filter((t) => t.hasVideo && !t.hasAudio)
  const audioStreams = info.formats.filter((t) => !t.hasVideo && t.hasAudio)

  let { video } = await inq.prompt({
    name: 'video',
    type: 'list',
    message: 'choose video quality',
    choices: videoStreams.map((t) => t.qualityLabel + ' ' + t.videoCodec + ' ' + t.container),
    loop: false,
  })

  video = videoStreams.find((t) => t.qualityLabel + ' ' + t.videoCodec + ' ' + t.container === video).url

  let { audio } = await inq.prompt({
    name: 'audio',
    type: 'list',
    message: 'choose audio quality',
    choices: audioStreams.map((t) => t.audioQuality + ' ' + t.container),
    loop: false,
  })

  audio = audioStreams.find((t) => t.audioQuality + ' ' + t.container === audio).url

  const ss = start ? ['-ss', start] : []
  const e = end ? ['-t', end - start] : []
  const re_enc = r ? [] : ['-c:v', 'copy', '-c:a', 'copy']

  const proc = spawn('ffmpeg', ['-hide_banner', '-y', ...ss, '-i', video, ...ss, '-i', audio, ...re_enc, ...e, op])
  proc.stderr.pipe(process.stderr)
  proc.stdout.pipe(process.stdout)
})

function hmsToSecondsOnly(str) {
  var p = str.split(':'),
    s = 0,
    m = 1

  while (p.length > 0) {
    s += m * parseInt(p.pop(), 10)
    m *= 60
  }

  return s
}
