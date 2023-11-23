import { rmSync, writeFileSync } from "fs"
import path = require("path")
import transformFileTemplate from "../lib/transformFileTemplate"

const testFilePath = path.join(__dirname, "transformFileTemplateTests.txt")

const createFile = (content: string): void => writeFileSync(testFilePath, content)

describe("transformFileTemplate()", () => {
  afterEach(() => {
    rmSync(testFilePath)
  })

  test("should not change when there are no tokens", () => {
    const expectedResult = "there are no tokens here"
    createFile(expectedResult)

    const actualResult = transformFileTemplate(testFilePath, {
      "SomeValue": "test"
    })

    expect(actualResult).toEqual(expectedResult)
  })

  test("should replace when there is one token", () => {
    createFile("there is a ${Token} here")

    const actualResult = transformFileTemplate(testFilePath, {
      "Token": "random value"
    })

    expect(actualResult).toEqual("there is a random value here")
  })

  test("should replace one when there are two tokens but a value is only given for one", () => {
    createFile("there is a ${Token} here and ${AnotherToken} there")

    const actualResult = transformFileTemplate(testFilePath, {
      "Token": "random value"
    })

    expect(actualResult).toEqual("there is a random value here and ${AnotherToken} there")
  })
})
