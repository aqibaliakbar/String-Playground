import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

const StringPlayground = () => {
  const [inputString, setInputString] = useState("Hello, World! 123");
  const [secondaryInput, setSecondaryInput] = useState("world");
  const [copiedIndex, setCopiedIndex] = useState(null);

  // 1. Basic String Operations
  const basicOperations = [
    {
      name: "Length",
      result: inputString.length,
      description: "Returns the length of string",
    },
    {
      name: "Uppercase",
      result: inputString.toUpperCase(),
      description: "Converts string to uppercase",
    },
    {
      name: "Lowercase",
      result: inputString.toLowerCase(),
      description: "Converts string to lowercase",
    },
    {
      name: "Trim",
      result: inputString.trim(),
      description: "Removes whitespace from both ends",
    },
    {
      name: "Trim Start",
      result: inputString.trimStart(),
      description: "Removes whitespace from start",
    },
    {
      name: "Trim End",
      result: inputString.trimEnd(),
      description: "Removes whitespace from end",
    },
  ];

  // 2. Search and Extract Operations
  const searchOperations = [
    {
      name: "IndexOf 'o'",
      result: inputString.indexOf("o"),
      description: "Finds first index of 'o'",
    },
    {
      name: "LastIndexOf 'o'",
      result: inputString.lastIndexOf("o"),
      description: "Finds last index of 'o'",
    },
    {
      name: "Includes 'World'",
      result: String(inputString.includes("World")),
      description: "Checks if string contains 'World'",
    },
    {
      name: "StartsWith 'Hello'",
      result: String(inputString.startsWith("Hello")),
      description: "Checks if string starts with 'Hello'",
    },
    {
      name: "EndsWith '123'",
      result: String(inputString.endsWith("123")),
      description: "Checks if string ends with '123'",
    },
    {
      name: "Search numbers",
      result: String(inputString.search(/\d+/)),
      description: "Searches for numbers using regex",
    },
  ];

  // 3. Extraction Operations
  const extractOperations = [
    {
      name: "Substring(0, 5)",
      result: inputString.substring(0, 5),
      description: "Extracts characters from index 0 to 5",
    },
    {
      name: "Slice(-5)",
      result: inputString.slice(-5),
      description: "Gets last 5 characters",
    },
    {
      name: "First word",
      result: inputString.split(",")[0],
      description: "Gets first word before comma",
    },
    {
      name: "Match numbers",
      result: String(inputString.match(/\d+/)),
      description: "Extracts numbers using regex",
    },
    {
      name: "Split words",
      result: JSON.stringify(inputString.split(/[\s,!]+/)),
      description: "Splits into words",
    },
    {
      name: "Characters array",
      result: JSON.stringify([...inputString]),
      description: "Spreads string into array of characters",
    },
  ];

  // 4. Modification Operations
  const modificationOperations = [
    {
      name: "Replace first 'o'",
      result: inputString.replace("o", "0"),
      description: "Replaces first 'o' with '0'",
    },
    {
      name: "Replace all 'o'",
      result: inputString.replaceAll("o", "0"),
      description: "Replaces all 'o' with '0'",
    },
    {
      name: "Pad Start",
      result: inputString.padStart(20, "*"),
      description: "Pads start to length 20 with *",
    },
    {
      name: "Pad End",
      result: inputString.padEnd(20, "*"),
      description: "Pads end to length 20 with *",
    },
    {
      name: "Repeat 2 times",
      result: inputString.repeat(2),
      description: "Repeats string 2 times",
    },
    {
      name: "Reverse",
      result: [...inputString].reverse().join(""),
      description: "Reverses the string",
    },
  ];

  // 5. Advanced Operations
  const advancedOperations = [
    {
      name: "Capitalize Words",
      result: inputString
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      description: "Capitalizes each word",
    },
    {
      name: "Count Vowels",
      result: String((inputString.match(/[aeiou]/gi) || []).length),
      description: "Counts vowels using regex",
    },
    {
      name: "Slug Format",
      result: inputString
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-"),
      description: "Converts to URL-friendly slug",
    },
    {
      name: "Camel Case",
      result: inputString
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase()),
      description: "Converts to camelCase",
    },
    {
      name: "Extract Emails",
      result: String(inputString.match(/[\w.-]+@[\w.-]+\.\w+/g) || []),
      description: "Extracts email addresses",
    },
    {
      name: "Character Count",
      result: JSON.stringify(
        [...inputString].reduce((acc, char) => {
          acc[char] = (acc[char] || 0) + 1;
          return acc;
        }, {})
      ),
      description: "Counts occurrence of each character",
    },
  ];

  // 6. Validation Operations
  const validationOperations = [
    {
      name: "Is Valid Email",
      result: String(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputString)),
      description: "Checks if string is valid email",
    },
    {
      name: "Is Valid URL",
      result: String(
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
          inputString
        )
      ),
      description: "Checks if string is valid URL",
    },
    {
      name: "Contains Numbers",
      result: String(/\d/.test(inputString)),
      description: "Checks if string contains numbers",
    },
    {
      name: "Is Alphanumeric",
      result: String(/^[a-zA-Z0-9]+$/.test(inputString)),
      description: "Checks if string is alphanumeric only",
    },
    {
      name: "Has Special Chars",
      result: String(/[^a-zA-Z0-9\s]/.test(inputString)),
      description: "Checks for special characters",
    },
    {
      name: "Valid Password",
      result: String(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(inputString)
      ),
      description: "Checks if valid password (8+ chars, letters & numbers)",
    },
  ];

  // 7. Formatting Operations
  const formattingOperations = [
    {
      name: "Title Case",
      result: inputString.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      ),
      description: "Converts to title case",
    },
    {
      name: "Snake Case",
      result: inputString
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "_"),
      description: "Converts to snake_case",
    },
    {
      name: "Kebab Case",
      result: inputString
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-"),
      description: "Converts to kebab-case",
    },
    {
      name: "Sentence case",
      result:
        inputString.charAt(0).toUpperCase() +
        inputString.slice(1).toLowerCase(),
      description: "Converts to Sentence case",
    },
    {
      name: "Pascal Case",
      result: inputString
        .replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        )
        .replace(/\s+/g, ""),
      description: "Converts to PascalCase",
    },
    {
      name: "Constant Case",
      result: inputString
        .toUpperCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "_"),
      description: "Converts to CONSTANT_CASE",
    },
  ];

  // 8. String Metrics Operations
  const metricsOperations = [
    {
      name: "Word Count",
      result: String(inputString.trim().split(/\s+/).length),
      description: "Counts number of words",
    },
    {
      name: "Sentence Count",
      result: String(inputString.split(/[.!?]+/).filter(Boolean).length),
      description: "Counts number of sentences",
    },
    {
      name: "Is Palindrome",
      result: String(
        inputString.toLowerCase().replace(/[\W_]/g, "") ===
          [...inputString.toLowerCase().replace(/[\W_]/g, "")]
            .reverse()
            .join("")
      ),
      description: "Checks if string is palindrome",
    },
    {
      name: "Unique Characters",
      result: String(new Set(inputString.replace(/\s/g, "")).size),
      description: "Counts unique characters",
    },
    {
      name: "Similarity Score",
      result: String(
        calculateSimilarity(
          inputString.toLowerCase(),
          secondaryInput.toLowerCase()
        )
      ),
      description: "Calculates similarity with secondary input",
    },
    {
      name: "Character Distribution",
      result: JSON.stringify(getCharacterDistribution(inputString)),
      description: "Shows character frequency distribution",
    },
  ];

  // 9. Encoding Operations
  const encodingOperations = [
    {
      name: "Base64 Encode",
      result: btoa(inputString),
      description: "Encodes string to Base64",
    },
    {
      name: "Base64 Decode",
      result: (() => {
        try {
          return atob(inputString);
        } catch {
          return "Invalid Base64 string";
        }
      })(),
      description: "Decodes Base64 string",
    },
    {
      name: "URL Encode",
      result: encodeURIComponent(inputString),
      description: "URL encodes string",
    },
    {
      name: "URL Decode",
      result: decodeURIComponent(inputString),
      description: "URL decodes string",
    },
    {
      name: "HTML Encode",
      result: inputString.replace(
        /[<>&"']/g,
        (char) =>
          ({
            "<": "&lt;",
            ">": "&gt;",
            "&": "&amp;",
            '"': "&quot;",
            "'": "&#39;",
          }[char])
      ),
      description: "Encodes HTML special characters",
    },
    {
      name: "Escape Regex",
      result: inputString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      description: "Escapes regex special characters",
    },
  ];

  // 10. Pattern Matching Operations
  const patternOperations = [
    {
      name: "Extract Dates",
      result: String(inputString.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/g) || []),
      description: "Extracts dates (MM/DD/YYYY format)",
    },
    {
      name: "Extract Phone Numbers",
      result: String(
        inputString.match(
          /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g
        ) || []
      ),
      description: "Extracts phone numbers",
    },
    {
      name: "Extract Hashtags",
      result: String(inputString.match(/#[a-zA-Z0-9_]+/g) || []),
      description: "Extracts hashtags",
    },
    {
      name: "Extract URLs",
      result: String(inputString.match(/https?:\/\/[^\s]+/g) || []),
      description: "Extracts URLs",
    },
    {
      name: "Extract IP Addresses",
      result: String(
        inputString.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g) || []
      ),
      description: "Extracts IP addresses",
    },
    {
      name: "Extract Quoted Text",
      result: String(inputString.match(/"[^"]*"/g) || []),
      description: "Extracts text within quotes",
    },
  ];

  // 11. Internationalization Operations
  const i18nOperations = [
    {
      name: "Unicode Normalization (NFC)",
      result: inputString.normalize("NFC"),
      description: "Normalizes string using NFC form",
    },
    {
      name: "Unicode Normalization (NFD)",
      result: inputString.normalize("NFD"),
      description: "Normalizes string using NFD form",
    },
    {
      name: "Remove Diacritics",
      result: inputString.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
      description: "Removes diacritical marks",
    },
    {
      name: "Extract Non-ASCII",
      result: inputString.match(/[^\x00-\x7F]+/g)?.join(" ") || "",
      description: "Extracts non-ASCII characters",
    },
    {
      name: "ASCII Only",
      result: inputString.replace(/[^\x00-\x7F]/g, ""),
      description: "Keeps only ASCII characters",
    },
    {
      name: "Character Code Points",
      result: JSON.stringify(
        [...inputString].map((char) => ({
          char,
          code: char.charCodeAt(0).toString(16),
        }))
      ),
      description: "Shows Unicode code points",
    },
    {
      name: "Detect RTL Text",
      result: String(
        /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(inputString)
      ),
      description: "Detects if string contains RTL script",
    },
    {
      name: "Bidirectional Text Mark",
      result: "\u202A" + inputString + "\u202C",
      description: "Adds bidirectional formatting marks",
    },
  ];

  // 12. Natural Language Operations
  const nlpOperations = [
    {
      name: "Word Tokenization",
      result: JSON.stringify(inputString.match(/\b\w+\b/g)),
      description: "Splits text into words",
    },
    {
      name: "Remove Stop Words",
      result: removeStopWords(inputString),
      description: "Removes common stop words",
    },
    {
      name: "Word Stemming",
      result: simpleStemmer(inputString),
      description: "Basic word stemming",
    },
    {
      name: "Character Bigrams",
      result: JSON.stringify(generateNgrams(inputString, 2, "char")),
      description: "Generates character bigrams",
    },
    {
      name: "Word Bigrams",
      result: JSON.stringify(generateNgrams(inputString, 2, "word")),
      description: "Generates word bigrams",
    },
    {
      name: "Basic Sentiment",
      result: analyzeSentiment(inputString),
      description: "Simple sentiment analysis",
    },
    {
      name: "Word Frequency",
      result: JSON.stringify(getWordFrequency(inputString)),
      description: "Calculates word frequency",
    },
    {
      name: "Sentence Segmentation",
      result: JSON.stringify(inputString.match(/[^.!?]+[.!?]+/g)),
      description: "Splits text into sentences",
    },
  ];

  // 13. Compression Operations
  const compressionOperations = [
    {
      name: "Run Length Encoding",
      result: runLengthEncode(inputString),
      description: "Basic run-length encoding",
    },
    {
      name: "Run Length Decoding",
      result: runLengthDecode(runLengthEncode(inputString)),
      description: "Run-length decoding",
    },
    {
      name: "Dictionary Compression",
      result: JSON.stringify(dictionaryCompress(inputString)),
      description: "Simple dictionary-based compression",
    },
    {
      name: "Dictionary Decompression",
      result: dictionaryDecompress(dictionaryCompress(inputString)),
      description: "Dictionary-based decompression",
    },
    {
      name: "Burrows-Wheeler Transform",
      result: bwtEncode(inputString),
      description: "Burrows-Wheeler transform",
    },
    {
      name: "Compression Ratio",
      result: calculateCompressionRatio(
        inputString,
        runLengthEncode(inputString)
      ),
      description: "Calculates compression ratio",
    },
  ];

  // Helper functions for Natural Language Operations
  function removeStopWords(str) {
    const stopWords = new Set([
      "the",
      "is",
      "at",
      "which",
      "on",
      "a",
      "an",
      "and",
      "or",
      "but",
    ]);
    return str
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => !stopWords.has(word))
      .join(" ");
  }

  function simpleStemmer(str) {
    return str
      .toLowerCase()
      .split(/\s+/)
      .map((word) => {
        if (word.endsWith("ing")) return word.slice(0, -3);
        if (word.endsWith("ed")) return word.slice(0, -2);
        if (word.endsWith("s")) return word.slice(0, -1);
        return word;
      })
      .join(" ");
  }
  // Helper functions for Natural Language Operations
  function generateNgrams(str, n, type = "char") {
    try {
      if (!str || typeof str !== "string") return [];

      let tokens;
      if (type === "char") {
        tokens = str.split("");
      } else {
        tokens = str.split(/\s+/).filter(Boolean);
      }

      const ngrams = [];
      for (let i = 0; i <= tokens.length - n; i++) {
        const segment = tokens.slice(i, i + n);
        ngrams.push(segment.join(type === "char" ? "" : " "));
      }
      return ngrams;
    } catch (error) {
      console.error("Error generating n-grams:", error);
      return [];
    }
  }
  function analyzeSentiment(str) {
    const positiveWords = new Set([
      "good",
      "great",
      "awesome",
      "excellent",
      "happy",
      "love",
    ]);
    const negativeWords = new Set([
      "bad",
      "terrible",
      "awful",
      "horrible",
      "sad",
      "hate",
    ]);

    const words = str.toLowerCase().match(/\b\w+\b/g) || [];
    const positive = words.filter((word) => positiveWords.has(word)).length;
    const negative = words.filter((word) => negativeWords.has(word)).length;

    if (positive > negative) return "Positive";
    if (negative > positive) return "Negative";
    return "Neutral";
  }

  function getWordFrequency(str) {
    const words = str.toLowerCase().match(/\b\w+\b/g) || [];
    return words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});
  }

  // Helper functions for Compression Operations
  function runLengthEncode(str) {
    return str.replace(/(.)\1+/g, (match, char) => `${match.length}${char}`);
  }

  function runLengthDecode(str) {
    return str.replace(/(\d+)(.)/g, (_, count, char) =>
      char.repeat(Number(count))
    );
  }

  function dictionaryCompress(str) {
    const dictionary = new Map();
    const words = str.split(/(\s+)/);
    let nextId = 1;
    const compressed = words.map((word) => {
      if (!dictionary.has(word)) {
        dictionary.set(word, nextId++);
      }
      return dictionary.get(word);
    });
    return { dictionary: Object.fromEntries(dictionary), compressed };
  }

  function dictionaryDecompress(data) {
    const reverseDictionary = Object.entries(data.dictionary).reduce(
      (acc, [word, id]) => ({ ...acc, [id]: word }),
      {}
    );
    return data.compressed.map((id) => reverseDictionary[id]).join("");
  }

  function bwtEncode(str) {
    const rotations = [];
    for (let i = 0; i < str.length; i++) {
      rotations.push(str.slice(i) + str.slice(0, i));
    }
    rotations.sort();
    return rotations.map((rot) => rot[rot.length - 1]).join("");
  }

  function calculateCompressionRatio(original, compressed) {
    return `${((compressed.length / original.length) * 100).toFixed(2)}%`;
  }

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Helper functions
  function calculateSimilarity(str1, str2) {
    if (str1.length === 0) return str2.length;
    if (str2.length === 0) return str1.length;

    const matrix = Array(str2.length + 1)
      .fill()
      .map(() => Array(str1.length + 1).fill(0));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1,
          matrix[j][i - 1] + 1,
          matrix[j - 1][i - 1] + cost
        );
      }
    }

    return (
      1 -
      matrix[str2.length][str1.length] / Math.max(str1.length, str2.length)
    ).toFixed(2);
  }

  function getCharacterDistribution(str) {
    const dist = {};
    str.split("").forEach((char) => {
      if (char.trim()) {
        dist[char] = (dist[char] || 0) + 1;
      }
    });
    return dist;
  }

  const renderOperationSection = (title, operations) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {operations.map((op, index) => (
          <div key={op.name} className="border rounded p-4 bg-white">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{op.name}</h3>
              <button
                onClick={() => handleCopy(op.result, `${title}-${index}`)}
                className="text-gray-500 hover:text-gray-700"
              >
                {copiedIndex === `${title}-${index}` ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">{op.description}</p>
            <div className="bg-gray-50 p-2 rounded">
              <code className="text-sm">{op.result}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Advanced String Operations Playground
      </h1>

      <div className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Primary Test String:
          </label>
          <input
            type="text"
            value={inputString}
            onChange={(e) => setInputString(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter a string to test operations"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Secondary Test String (for comparison operations):
          </label>
          <input
            type="text"
            value={secondaryInput}
            onChange={(e) => setSecondaryInput(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter a secondary string for comparison"
          />
        </div>
      </div>
      {renderOperationSection("Basic Operations", basicOperations)}
      {renderOperationSection("Search Operations", searchOperations)}
      {renderOperationSection("Extraction Operations", extractOperations)}
      {renderOperationSection(
        "Modification Operations",
        modificationOperations
      )}
      {renderOperationSection("Advanced Operations", advancedOperations)}
      {renderOperationSection("Validation Operations", validationOperations)}
      {renderOperationSection("Formatting Operations", formattingOperations)}
      {renderOperationSection("String Metrics Operations", metricsOperations)}
      {renderOperationSection("Encoding Operations", encodingOperations)}
      {renderOperationSection("Pattern Matching Operations", patternOperations)}
      {/* Render new operation sections */}
      {renderOperationSection(
        "Internationalization Operations",
        i18nOperations
      )}
      {renderOperationSection("Natural Language Operations", nlpOperations)}
      {renderOperationSection("Compression Operations", compressionOperations)}
    </div>
  );
};

export default StringPlayground;
