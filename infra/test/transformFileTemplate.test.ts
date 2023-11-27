import path = require("path")
import { rmSync, writeFileSync } from "fs"
import transformFileTemplate from "../lib/transformFileTemplate"

const testFilePath = path.join(__dirname, "transformFileTemplateTests.txt")

const createFile = (content: string): void => writeFileSync(testFilePath, content)

describe("transformFileTemplate()", () => {
  afterEach(() => {
    rmSync(testFilePath)
  })

  // test.only("test", () => {
  //   const content = "hello ${world} hello ${world}";
  //   const templateObject = {
  //     world: "yay"
  //   };

  //   const key = "world";
  //   const value = templateObject[key];
  //   // const escapedValue = RegExp.escape(value); // Escape special characters in the value

  //   const pattern = `\\$\\{${key}\\}`;
  //   const regex = new RegExp(pattern, "g");
  //   const replacedContent = content.replace(regex, value);
  //   console.log(replacedContent); // Check the replaced content

  //   expect(replacedContent).toEqual("hello yay hello yay")
  // })

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

  test("should replace both tokens when there are two the same", () => {
    createFile("here is a ${Token} and the ${Token} again")

    const actualResult = transformFileTemplate(testFilePath, {
      "Token": "random value"
    })

    expect(actualResult).toEqual("here is a random value and the random value again")
  })
})
