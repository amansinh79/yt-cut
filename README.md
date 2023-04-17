# yt-cut

### demo command
```deno run --allow-net --allow-run https://aman.deno.dev/yt-cut.ts "https://www.youtube.com/watch?v=Uo3cL4nrGOk" -s "00:01:00" -e "00:01:15" -r```


### Usage
```deno run --allow-net --allow-run https://aman.deno.dev/yt-cut.ts <yt_link> -s <start_time> -e <end_time> -r -o file_name```

  Description:

    - Download clips from youtube without downloading whole video
    - To download whole video leave start and end args           
    - Depends on ffmpeg                                          

  Options:

    -h, --help             - Show this help.                           
    -s, --start   <type>   - starting time of clip in hh:mm:ss format  
    -e, --end     <type>   - ending time of clip in hh:mm:ss format    
    -r, --re-enc  [small]  - re-encode video in ffmpeg                 
    -o, --output  <type>   - output file name
