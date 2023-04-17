import { getFormats } from "https://deno.land/x/yt_download@1.5/mod.ts";
import { Format } from "https://deno.land/x/yt_download@1.5/src/types.ts";
import { Select } from "https://deno.land/x/cliffy@v0.25.7/prompt/select.ts";
import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";

const { args, options } = await new Command()
  .name("yt-cut")
  .description(
    "- Download clips from youtube without downloading whole video\n- To download whole video leave start and end args\n- Depends on ffmpeg",
  )
  .option("-s, --start <type>", "starting time of clip in hh:mm:ss format")
  .option("-e, --end <type>", "ending time of clip in hh:mm:ss format")
  .option("-r, --re-enc [small:boolean]", "re-encode video in ffmpeg")
  .option("-o, --output <type>", "output file name")
  .arguments("<input:file>")
  .usage(`<yt_link> -s <start_time> -e <end_time> -r -o file_name`)
  .parse(Deno.args);

const link = args[0];

const formats: Format[] = await getFormats(link);

const videos: Format[] = formats.filter((t) => t.mimeType.includes("video"));
const audios: Format[] = formats.filter((t) => t.mimeType.includes("audio"));

const videoRes: string = await Select.prompt({
  message: "Choose Video Quality",
  options: videos.map((t) => ({
    name: (t.qualityLabel || "") + " " + t.mimeType + " fps " + t.fps,
    value: t.url,
  })),
});

const audioRes: string = await Select.prompt({
  message: "Choose Audio Quality",
  options: audios.map((t) => ({
    name: (t.qualityLabel || "") + " " + t.mimeType,
    value: t.url,
  })),
});

const { start, end, reEnc, output } = options;

const ss = start ? ["-ss", hmsToSecondsOnly(start).toString()] : [];
const e = end && start
  ? ["-t", (hmsToSecondsOnly(end) - hmsToSecondsOnly(start)).toString()]
  : [];
const re_enc = reEnc ? [] : ["-c:v", "copy", "-c:a", "copy"];

const cmd = [
  "ffmpeg",
  "-hide_banner",
  "-y",
  ...ss,
  "-i",
  videoRes,
  ...ss,
  "-i",
  audioRes,
  ...re_enc,
  ...e,
  (output || "output") + ".mp4",
];

const p = Deno.run({ cmd });

await p.status();

function hmsToSecondsOnly(str: string) {
  const p = str.split(":");
  let s = 0;
  let m = 1;

  while (p.length > 0) {
    s += m * parseInt(p.pop() || "", 10);
    m *= 60;
  }

  return s;
}
