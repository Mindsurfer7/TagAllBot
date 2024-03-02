import axios from "axios";
import Ffmpeg from "fluent-ffmpeg";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import installer from "@ffmpeg-installer/ffmpeg";

const __dirname = dirname(fileURLToPath(import.meta.url));

export class oggConverter {
  constructor() {
    Ffmpeg.setFfmpegPath(installer.path);
  }

  toMp3(input, output) {
    try {
      const outputPath = resolve(__dirname, "./voices", `${output}.mp3`);

      return new Promise((resolve, rej) => {
        Ffmpeg(input)
          .inputOption("-t 30")
          .output(outputPath)
          .on("end", () => {
            resolve(outputPath);
          })
          .on("error", (err) => {
            rej(err.message);
          })
          .run();
      });
    } catch (e) {
      console.log("sound convertion error:", e);
    }
  }

  async create(url, filename) {
    try {
      const oggPath = resolve(__dirname, "./voices", `${filename}.ogg`);

      const response = await axios({
        method: "get",
        url,
        responseType: "stream",
      });

      new Promise((resolve) => {
        const stream = fs.createWriteStream(oggPath);
        response.data.pipe(stream);

        stream.on("finish", () => {
          resolve(oggPath);
        });
      });
    } catch (e) {
      console.log("sound convertion error:", e);
    }
  }
}
