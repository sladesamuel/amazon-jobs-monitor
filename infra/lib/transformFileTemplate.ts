import { readFileSync } from "fs"

export default (filePath: string, templateObject: { [key: string]: string }) => {
  let content = readFileSync(filePath).toString()

  for (const key in templateObject) {
    const value = templateObject[key]

    content = content.replace(`\${${key}}`, value)
  }

  return content
}
