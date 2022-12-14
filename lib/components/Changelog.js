import fs from "fs";
import lodash from "lodash";

const _path = process.cwd();
const _logPath = `${_path}/CHANGELOG.md`;

let logs = {};
let changelogs = [];
let currentVersion;

const getLine = function (line) {
  line = line.replace(/(^\s*\*|\r)/g, '');
  line = line.replace(/\s*`([^`]+`)/g, '<span class="cmd">$1');
  line = line.replace(/`\s*/g, '</span>');
  line = line.replace(/\s*\*\*([^\*]+\*\*)/g, '<span class="strong">$1')
  line = line.replace(/\*\*\s*/g, '</span>');
  line = line.replace(/ⁿᵉʷ/g, '<span class="new"></span>');
  return line;
}

try {
  if (fs.existsSync(_logPath)) {
    logs = fs.readFileSync(_logPath, "utf8") || "";
    logs = logs.split("\n");

    let temp = {}, lastLine = {};
    lodash.forEach(logs, (line) => {
      let versionRet = /^#\s*([0-9\\.~\s]+?)\s*$/.exec(line);
      if (versionRet && versionRet[1]) {
        let v = versionRet[1].trim();
        if (!currentVersion) {
          currentVersion = v;
        } else {
          changelogs.push(temp);
        }
        temp = {
          version: v,
          logs: []
        }
      } else {
        if (!line.trim()) {
          return;
        }
        if (/^\*/.test(line)) {
          lastLine = {
            title: getLine(line),
            logs: []
          }
          temp.logs.push(lastLine);
        } else if (/^\s{3,}\*/.test(line)) {
          lastLine.logs.push(getLine(line));
        }
      }
    });

    if (temp.logs.length > 0) {
      changelogs.push(temp);
    }
  }
} catch (e) {
  // do nth
}

export { currentVersion, changelogs };