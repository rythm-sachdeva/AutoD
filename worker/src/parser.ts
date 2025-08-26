export function parse(text: string, values: any, startDelimeter = "{", endDelimiter = "}") {
  console.log(`Parsing text: ${text} with values: ${JSON.stringify(values)}`);

  // Step 1: First, ensure 'values' is a parsed object.
  let parsedValues = values;
  if (typeof parsedValues === "string") {
    try {
      parsedValues = JSON.parse(parsedValues);
    } catch (e) {
      console.error("Error: The provided 'values' string is not valid JSON.");
      return text;
    }
  }

  // Step 2: NOW, create the nested structure the template expects, using the parsed object.
  const dataForTemplate = {
    comment: {
      email: parsedValues.email 
    }
  };

  const regex = new RegExp(`\\${startDelimeter}(.*?)\\${endDelimiter}`, "g");

  const finalString = text.replace(regex, (match, keyPath) => {
    const keys = keyPath.split(".");
    
    // Step 3: Use the new nested 'dataForTemplate' object for the lookup.
    //@ts-ignore
    const result = keys.reduce((currentObject, currentKey) => {
      if (currentObject && typeof currentObject === 'object' && currentKey in currentObject) {
        return currentObject[currentKey];
      }
      return undefined;
    }, dataForTemplate); // <-- This now correctly uses the nested data

    return result !== undefined ? result : match;
  });

  return finalString;
}