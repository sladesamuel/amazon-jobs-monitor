import { readFileSync } from "fs"

export default (filePath: string, templateObject: { [key: string]: string }) => {
  let content = readFileSync(filePath, "utf-8").toString()

  for (const key in templateObject) {
    const value = templateObject[key]

    const pattern = new RegExp(`\\$\\{${key}\\}`, 'g');
    content = content.replace(pattern, value);
  }

  return content
}
