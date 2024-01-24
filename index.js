const express = require("express");
const fs = require("fs");
const app = express();


app.use(express.static(__dirname + "/src"));

let currentVideoIndex = 0;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})



let adPlayList = [
    "src/Napoleon.(NKIRI.COM).2023.AMZN.WEBRip.DOWNLOADED.FROM.NKIRI.COM.mkv",
    "src/Castlevania.Nocturne.S01E08.(NKIRI.COM).mkv",
    "src/vaultboy - everything hits me at once (Official Lyric Video).mp4"
]
// const getVideoPath = () => {
   
//      currentVideoIndex = (currentVideoIndex + 1) % adPlayList.length;
//     const videoPath = adPlayList[currentVideoIndex];
//     return videoPath;
// };




 app.get("/video", (req,res) => {
    const range = req.headers.range;
    if (!range)
    {
        res.status(400).send("Requires range fromn header");
    }
   
    const videoPath =  "src/vaultboy - everything hits me at once (Official Lyric Video).mp4";
    const fd = fs.openSync(videoPath);
    const videoSize = fs.fstatSync(fd).size;
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLen = end - start + 1;
    const headers = {
        "Content-Range":    `bytes ${start} - ${end}/${videoSize}`,
        "Accept-Ranges":    "bytes",
        "Content-Lenght":   contentLen,
        "Content-Type":     "video/mp4"
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end })
    videoStream.pipe(res)
 })

console.log(__dirname)
 app.listen(9000, () => {
    console.log("app running on port 9000!")
 })