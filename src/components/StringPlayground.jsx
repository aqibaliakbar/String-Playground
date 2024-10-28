import React, { useState } from 'react';
import { Copy, Check, Code, X, ChevronDown, ChevronRight } from 'lucide-react';

const StringPlayground = () => {
  // State management
  const [inputString, setInputString] = useState(
    "Hello, World! 123 test@email.com"
  );
  const [secondaryInput, setSecondaryInput] = useState("world");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showCode, setShowCode] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [expandedSections, setExpandedSections] = useState(
    new Set(["Basic Operations"])
  );

  // Helper Functions
  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const toggleSection = (section) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // NLP Helper Functions
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

  // Compression Helper Functions
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

  // Metrics Helper Functions
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

  // UI Components
  const CodeViewer = ({ code, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Implementation Code</h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleCopyCode(code)}
              className="text-gray-500 hover:text-gray-700"
            >
              {copiedCode ? (
                <Check size={20} className="text-green-500" />
              ) : (
                <Copy size={20} />
              )}
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="p-4">
          <pre className="bg-gray-50 p-4 rounded overflow-x-auto">
            <code className="text-sm font-mono">{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );

  // Operations Arrays
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

  // Formatting Operations
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

  // String Metrics Operations
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

  // Encoding Operations
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

  // Pattern Matching Operations
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

  // Internationalization Operations
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

  // Natural Language Operations
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

  // Compression Operations
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

  const renderOperationSection = (title, operations) => (
    <div className="mb-8">
      <button
        onClick={() => toggleSection(title)}
        className="w-full flex items-center justify-between text-xl font-semibold mb-4 hover:bg-gray-50 p-2 rounded"
      >
        <span>{title}</span>
        {expandedSections.has(title) ? (
          <ChevronDown size={20} />
        ) : (
          <ChevronRight size={20} />
        )}
      </button>

      {expandedSections.has(title) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {operations.map((op, index) => (
            <div
              key={op.name}
              className="border rounded p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{op.name}</h3>
                <div className="flex gap-2">
                  {implementationCode[op.name] && (
                    <button
                      onClick={() => setShowCode(op.name)}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
                      title="View Implementation"
                    >
                      <Code size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleCopy(op.result, `${title}-${index}`)}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
                    title="Copy Result"
                  >
                    {copiedIndex === `${title}-${index}` ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{op.description}</p>
              <div className="bg-gray-50 p-2 rounded">
                <code className="text-sm font-mono whitespace-pre-wrap break-words">
                  {op.result}
                </code>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">
          Advanced String Operations Playground
        </h1>
        <p className="text-gray-600 mb-4">
          Explore and experiment with various string operations. Click the code
          icon to view implementation details.
        </p>
      </div>

      <div className="mb-8 space-y-4 bg-white rounded-lg p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-2">
            Primary Test String:
          </label>
          <input
            type="text"
            value={inputString}
            onChange={(e) => setInputString(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter a secondary string for comparison"
          />
        </div>
      </div>

      {showCode && (
        <CodeViewer
          code={implementationCode[showCode]}
          onClose={() => setShowCode(null)}
        />
      )}

      <div className="space-y-4">
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
        {renderOperationSection(
          "Pattern Matching Operations",
          patternOperations
        )}
        {renderOperationSection(
          "Internationalization Operations",
          i18nOperations
        )}
        {renderOperationSection("Natural Language Operations", nlpOperations)}
        {renderOperationSection(
          "Compression Operations",
          compressionOperations
        )}
      </div>
    </div>
  );
};

// Implementation code for each operation
const implementationCode = {
  // Basic String Operations
  Length: `// Returns the length of the string
const length = inputString.length;

// Example:
"Hello".length;  // 5`,

  Uppercase: `// Converts string to uppercase
const uppercase = inputString.toUpperCase();

// Example:
"hello".toUpperCase();  // "HELLO"`,

  Lowercase: `// Converts string to lowercase
const lowercase = inputString.toLowerCase();

// Example:
"HELLO".toLowerCase();  // "hello"`,

  Trim: `// Removes whitespace from both ends
const trimmed = inputString.trim();

// Example:
"  hello  ".trim();  // "hello"`,

  "Trim Start": `// Removes whitespace from start
const trimStart = inputString.trimStart();

// Example:
"  hello  ".trimStart();  // "hello  "`,

  "Trim End": `// Removes whitespace from end
const trimEnd = inputString.trimEnd();

// Example:
"  hello  ".trimEnd();  // "  hello"`,

  // Search Operations
  "IndexOf 'o'": `// Finds first index of 'o'
const firstIndex = inputString.indexOf('o');

// Example:
"hello".indexOf('o');  // 4`,

  "LastIndexOf 'o'": `// Finds last index of 'o'
const lastIndex = inputString.lastIndexOf('o');

// Example:
"hello world".lastIndexOf('o');  // 7`,

  "Includes 'World'": `// Checks if string contains 'World'
const includesWorld = inputString.includes('World');

// Example:
"Hello World".includes('World');  // true`,

  "StartsWith 'Hello'": `// Checks if string starts with 'Hello'
const startsWithHello = inputString.startsWith('Hello');

// Example:
"Hello World".startsWith('Hello');  // true`,

  "EndsWith '123'": `// Checks if string ends with '123'
const endsWith123 = inputString.endsWith('123');

// Example:
"Test 123".endsWith('123');  // true`,

  "Search numbers": `// Searches for numbers using regex
const numberIndex = inputString.search(/\\d+/);

// Example:
"abc123def".search(/\\d+/);  // 3`,

  // Extraction Operations
  "Substring(0, 5)": `// Extracts characters from index 0 to 5
const substring = inputString.substring(0, 5);

// Example:
"Hello World".substring(0, 5);  // "Hello"`,

  "Slice(-5)": `// Gets last 5 characters
const lastFive = inputString.slice(-5);

// Example:
"Hello World".slice(-5);  // "World"`,

  "First word": `// Gets first word before comma
const firstWord = inputString.split(',')[0];

// Example:
"Hello, World".split(',')[0];  // "Hello"`,

  "Match numbers": `// Extracts numbers using regex
const numbers = inputString.match(/\\d+/g);

// Example:
"abc123def456".match(/\\d+/g);  // ["123", "456"]`,

  "Split words": `// Splits into words
const words = inputString.split(/[\\s,!]+/);

// Example:
"Hello, World!".split(/[\\s,!]+/);  // ["Hello", "World"]`,

  "Characters array": `// Spreads string into array of characters
const chars = [...inputString];

// Example:
[..."Hello"];  // ["H", "e", "l", "l", "o"]`,

  // Modification Operations
  "Replace first 'o'": `// Replaces first 'o' with '0'
const replaceFirst = inputString.replace('o', '0');

// Example:
"Hello World".replace('o', '0');  // "Hell0 World"`,

  "Replace all 'o'": `// Replaces all 'o' with '0'
const replaceAll = inputString.replaceAll('o', '0');

// Example:
"Hello World".replaceAll('o', '0');  // "Hell0 W0rld"`,

  "Pad Start": `// Pads start to length 20 with *
const padStart = inputString.padStart(20, '*');

// Example:
"Hello".padStart(10, '*');  // "*****Hello"`,

  "Pad End": `// Pads end to length 20 with *
const padEnd = inputString.padEnd(20, '*');

// Example:
"Hello".padEnd(10, '*');  // "Hello*****"`,

  "Repeat 2 times": `// Repeats string 2 times
const repeated = inputString.repeat(2);

// Example:
"Hello ".repeat(2);  // "Hello Hello "`,

  Reverse: `// Reverses the string
const reversed = [...inputString].reverse().join('');

// Example:
[..."Hello"].reverse().join('');  // "olleH"`,

  // Advanced Operations
  "Capitalize Words": `// Capitalizes each word
function capitalizeWords(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Example:
capitalizeWords("hello world");  // "Hello World"`,

  "Count Vowels": `// Counts vowels using regex
function countVowels(str) {
  return (str.match(/[aeiou]/gi) || []).length;
}

// Example:
countVowels("Hello World");  // 3`,

  "Slug Format": `// Converts to URL-friendly slug
function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/[^\\w\\s-]/g, '')
    .replace(/[\\s]+/g, '-');
}

// Example:
toSlug("Hello World!");  // "hello-world"`,

  "Camel Case": `// Converts to camelCase
function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (match, char) => char.toUpperCase());
}

// Example:
toCamelCase("hello world");  // "helloWorld"`,

  "Extract Emails": `// Extracts email addresses
function extractEmails(str) {
  return str.match(/[\\w.-]+@[\\w.-]+\\.\\w+/g) || [];
}

// Example:
extractEmails("Contact: test@email.com");  // ["test@email.com"]`,

  "Character Count": `// Counts occurrence of each character
function getCharacterCount(str) {
  return [...str].reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});
}

// Example:
getCharacterCount("hello");  // { h: 1, e: 1, l: 2, o: 1 }`,



  // Pattern Matching Operations
  "Extract Dates": `// Extracts dates in MM/DD/YYYY format
function extractDates(str) {
  return str.match(/\\d{1,2}\\/\\d{1,2}\\/\\d{2,4}/g) || [];
}

// Example:
extractDates("Date: 12/25/2023");  // ["12/25/2023"]`,

  "Extract Phone Numbers": `// Extracts phone numbers
function extractPhoneNumbers(str) {
  return str.match(/\\+?\\d{1,4}?[-.]\\s?\\(?\\d{1,3}?\\)?[-.]\\s?\\d{1,4}[-.]\\s?\\d{1,4}[-.]\\s?\\d{1,9}/g) || [];
}

// Example:
extractPhoneNumbers("Call: 123-456-7890");  // ["123-456-7890"]`,

  // Validation Operations
  "Is Valid Email": `// Checks if string is valid email
function isValidEmail(str) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(str);
}

// Examples:
isValidEmail("test@email.com")     // true
isValidEmail("invalid.email")      // false
isValidEmail("test@domain")        // false`,

  "Is Valid URL": `// Checks if string is valid URL
function isValidUrl(str) {
  return /^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*\\/?$/.test(str);
}

// Examples:
isValidUrl("https://example.com")           // true
isValidUrl("http://sub.domain.co.uk/path")  // true
isValidUrl("invalid url")                   // false`,

  "Contains Numbers": `// Checks if string contains numbers
function hasNumbers(str) {
  return /\\d/.test(str);
}

// Examples:
hasNumbers("abc123")    // true
hasNumbers("abcdef")    // false`,

  "Is Alphanumeric": `// Checks if string is alphanumeric only
function isAlphanumeric(str) {
  return /^[a-zA-Z0-9]+$/.test(str);
}

// Examples:
isAlphanumeric("abc123")    // true
isAlphanumeric("abc!123")   // false`,

  "Has Special Chars": `// Checks for special characters
function hasSpecialChars(str) {
  return /[^a-zA-Z0-9\\s]/.test(str);
}

// Examples:
hasSpecialChars("Hello!")   // true
hasSpecialChars("Hello123") // false`,

  "Valid Password": `// Checks if valid password (8+ chars, letters & numbers)
function isValidPassword(str) {
  return /^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$/.test(str);
}

// Examples:
isValidPassword("Password123")  // true
isValidPassword("pass123")      // false (too short)
isValidPassword("password")     // false (no numbers)`,

  // Formatting Operations
  "Title Case": `// Converts to title case
function toTitleCase(str) {
  return str.replace(
    /\\w\\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

// Examples:
toTitleCase("hello world")     // "Hello World"
toTitleCase("HELLO WORLD")     // "Hello World"`,

  "Snake Case": `// Converts to snake_case
function toSnakeCase(str) {
  return str
    .toLowerCase()
    .replace(/[^\\w\\s-]/g, '')
    .replace(/\\s+/g, '_');
}

// Examples:
toSnakeCase("Hello World")     // "hello_world"
toSnakeCase("Hello-World!")    // "hello_world"`,

  "Kebab Case": `// Converts to kebab-case
function toKebabCase(str) {
  return str
    .toLowerCase()
    .replace(/[^\\w\\s-]/g, '')
    .replace(/\\s+/g, '-');
}

// Examples:
toKebabCase("Hello World")     // "hello-world"
toKebabCase("Hello_World!")    // "hello-world"`,

  "Sentence case": `// Converts to Sentence case
function toSentenceCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Examples:
toSentenceCase("hELLO wORLD")  // "Hello world"
toSentenceCase("HELLO")        // "Hello"`,

  "Pascal Case": `// Converts to PascalCase
function toPascalCase(str) {
  return str
    .replace(
      /\\w\\S*/g,
      txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
    .replace(/\\s+/g, '');
}

// Examples:
toPascalCase("hello world")    // "HelloWorld"
toPascalCase("hello-world")    // "HelloWorld"`,

  "Constant Case": `// Converts to CONSTANT_CASE
function toConstantCase(str) {
  return str
    .toUpperCase()
    .replace(/[^\\w\\s-]/g, '')
    .replace(/\\s+/g, '_');
}

// Examples:
toConstantCase("hello world")   // "HELLO_WORLD"
toConstantCase("helloWorld")    // "HELLO_WORLD"`,

  // String Metrics Operations
  "Word Count": `// Counts number of words
function countWords(str) {
  return str.trim().split(/\\s+/).length;
}

// Examples:
countWords("Hello world")       // 2
countWords("   Hello   ")       // 1`,

  "Sentence Count": `// Counts number of sentences
function countSentences(str) {
  return str.split(/[.!?]+/).filter(Boolean).length;
}

// Examples:
countSentences("Hello. How are you? Good!")  // 3
countSentences("Hello")                      // 1`,

  "Is Palindrome": `// Checks if string is palindrome
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[\\W_]/g, '');
  return cleaned === [...cleaned].reverse().join('');
}

// Examples:
isPalindrome("A man, a plan, a canal: Panama")  // true
isPalindrome("race a car")                      // false`,

  "Unique Characters": `// Counts unique characters
function countUniqueChars(str) {
  return new Set(str.replace(/\\s/g, '')).size;
}

// Examples:
countUniqueChars("hello")      // 4
countUniqueChars("aabbcc")     // 3`,

  "Similarity Score": `// Calculates string similarity (0 to 1)
function calculateSimilarity(str1, str2) {
  if (str1.length === 0) return str2.length;
  if (str2.length === 0) return str1.length;

  const matrix = Array(str2.length + 1).fill()
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

  return (1 - matrix[str2.length][str1.length] / 
    Math.max(str1.length, str2.length)).toFixed(2);
}

// Examples:
calculateSimilarity("hello", "hallo")     // "0.80"
calculateSimilarity("hello", "hi")        // "0.40"`,

  "Character Distribution": `// Shows character frequency distribution
function getCharacterDistribution(str) {
  return [...str].reduce((acc, char) => {
    if (char.trim()) {
      acc[char] = (acc[char] || 0) + 1;
    }
    return acc;
  }, {});
}

// Examples:
getCharacterDistribution("hello")   // { h: 1, e: 1, l: 2, o: 1 }
getCharacterDistribution("aaa")     // { a: 3 }`,
	
	// Encoding Operations
  "Base64 Encode": `// Encodes string to Base64
function base64Encode(str) {
  try {
    return btoa(str);
  } catch (error) {
    return "Invalid string for Base64 encoding";
  }
}

// Examples:
base64Encode("Hello World")     // "SGVsbG8gV29ybGQ="
base64Encode("Test@123")        // "VGVzdEAxMjM="`,

  "Base64 Decode": `// Decodes Base64 string
function base64Decode(str) {
  try {
    return atob(str);
  } catch {
    return "Invalid Base64 string";
  }
}

// Examples:
base64Decode("SGVsbG8gV29ybGQ=")   // "Hello World"
base64Decode("VGVzdEAxMjM=")        // "Test@123"`,

  "URL Encode": `// URL encodes string
function urlEncode(str) {
  try {
    return encodeURIComponent(str);
  } catch (error) {
    return "Invalid string for URL encoding";
  }
}

// Examples:
urlEncode("Hello World")        // "Hello%20World"
urlEncode("Test@123")           // "Test%40123"`,

  "URL Decode": `// URL decodes string
function urlDecode(str) {
  try {
    return decodeURIComponent(str);
  } catch (error) {
    return "Invalid URL encoded string";
  }
}

// Examples:
urlDecode("Hello%20World")      // "Hello World"
urlDecode("Test%40123")         // "Test@123"`,

  "HTML Encode": `// Encodes HTML special characters
function htmlEncode(str) {
  const htmlEntities = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#39;'
  };
  
  return str.replace(/[<>&"']/g, char => htmlEntities[char]);
}

// Examples:
htmlEncode('<div>"Test"</div>')     // "&lt;div&gt;&quot;Test&quot;&lt;/div&gt;"
htmlEncode("Test & Test")           // "Test &amp; Test"`,
"Escape Regex": `// Escapes regex special characters
function escapeRegex(str) {
  return str.replace(/[.*+?^$()|[\\]\\\\]/g, "\\\\$&");
}

// Examples:
escapeRegex('hello.*world')     // "hello\\.\\*world"
escapeRegex('(test)')           // "\\(test\\)"
escapeRegex('[abc]')            // "\\[abc\\]"`,

  // Pattern Matching Operations
  "Extract Dates": `// Extracts dates in various formats
function extractDates(str) {
  const dateFormats = [
    // MM/DD/YYYY or DD/MM/YYYY
    /\\b\\d{1,2}\\/\\d{1,2}\\/\\d{2,4}\\b/g,
    // YYYY-MM-DD
    /\\b\\d{4}-\\d{2}-\\d{2}\\b/g,
    // Month DD, YYYY
    /\\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \\d{1,2},? \\d{4}\\b/g
  ];

  return dateFormats
    .flatMap(regex => str.match(regex) || [])
    .filter(Boolean);
}

// Examples:
extractDates("Date: 12/25/2023")                    // ["12/25/2023"]
extractDates("Date: 2023-12-25")                    // ["2023-12-25"]
extractDates("Date: December 25, 2023")             // ["December 25, 2023"]`,

  "Extract Phone Numbers": `// Extracts phone numbers in various formats
function extractPhoneNumbers(str) {
  const phoneRegex = /\\+?\\d{1,4}?[-.]?\\s?\\(?\\d{1,3}?\\)?[-.]?\\s?\\d{1,4}[-.]?\\s?\\d{1,4}[-.]?\\s?\\d{1,9}\\b/g;
  return str.match(phoneRegex) || [];
}

// Examples:
extractPhoneNumbers("Call: 123-456-7890")           // ["123-456-7890"]
extractPhoneNumbers("Tel: +1 (234) 567-8901")       // ["+1 (234) 567-8901"]`,

  "Extract Hashtags": `// Extracts hashtags from text
function extractHashtags(str) {
  return str.match(/#[a-zA-Z0-9_]+/g) || [];
}

// Examples:
extractHashtags("Hello #world #test123")            // ["#world", "#test123"]
extractHashtags("No hashtags here")                 // []`,

  "Extract URLs": `// Extracts URLs from text
function extractUrls(str) {
  const urlRegex = /https?:\\/\\/[^\\s]+/g;
  return str.match(urlRegex) || [];
}

// Examples:
extractUrls("Visit https://example.com")            // ["https://example.com"]
extractUrls("Multiple http://site1.com https://site2.com")  
// ["http://site1.com", "https://site2.com"]`,

  "Extract IP Addresses": `// Extracts IPv4 addresses
function extractIpAddresses(str) {
  const ipRegex = /\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b/g;
  return str.match(ipRegex) || [];
}

// Examples:
extractIpAddresses("IP: 192.168.1.1")               // ["192.168.1.1"]
extractIpAddresses("Multiple: 10.0.0.1 172.16.0.1") // ["10.0.0.1", "172.16.0.1"]`,

  "Extract Quoted Text": `// Extracts text within quotes
function extractQuotedText(str) {
  return str.match(/"[^"]*"/g) || [];
}

// Examples:
extractQuotedText('He said "hello" and "goodbye"')  // ['"hello"', '"goodbye"']
extractQuotedText('No quotes here')                 // []`,

  // Internationalization Operations
  "Unicode Normalization (NFC)": `// Normalizes string using NFC form
function normalizeNFC(str) {
  return str.normalize('NFC');
}

// Examples:
normalizeNFC('café')    // Combines 'e' and acute accent
normalizeNFC('café')    // Same visual result, different internal representation`,

  "Unicode Normalization (NFD)": `// Normalizes string using NFD form
function normalizeNFD(str) {
  return str.normalize('NFD');
}

// Examples:
normalizeNFD('café')    // Separates 'e' and acute accent
normalizeNFD('café')    // Same visual result, different internal representation`,

  "Remove Diacritics": `// Removes diacritical marks
function removeDiacritics(str) {
  return str.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
}

// Examples:
removeDiacritics('café')               // "cafe"
removeDiacritics('crème brûlée')       // "creme brulee"`,

  "Extract Non-ASCII": `// Extracts non-ASCII characters
function extractNonAscii(str) {
  return str.match(/[^\\x00-\\x7F]+/g)?.join(' ') || '';
}

// Examples:
extractNonAscii('Hello café 你好')      // "é 你好"
extractNonAscii('Hello World')          // ""`,

  "ASCII Only": `// Keeps only ASCII characters
function keepAsciiOnly(str) {
  return str.replace(/[^\\x00-\\x7F]/g, '');
}

// Examples:
keepAsciiOnly('Hello café 你好')        // "Hello caf "
keepAsciiOnly('Hello World!')           // "Hello World!"`,

  "Character Code Points": `// Shows Unicode code points for each character
function getCodePoints(str) {
  return [...str].map(char => ({
    char,
    code: char.charCodeAt(0).toString(16)
  }));
}

// Examples:
getCodePoints('ABC')      // [{char: 'A', code: '41'}, {char: 'B', code: '42'}, {char: 'C', code: '43'}]
getCodePoints('🎉')       // [{char: '🎉', code: '1f389'}]`,

  "Detect RTL Text": `// Detects if string contains RTL script
function hasRTL(str) {
  return /[\\u0591-\\u07FF\\uFB1D-\\uFDFD\\uFE70-\\uFEFC]/.test(str);
}

// Examples:
hasRTL('Hello مرحبا')     // true
hasRTL('Hello World')     // false`,

  "Bidirectional Text Mark": `// Adds bidirectional formatting marks
function addBidiMarks(str) {
  return '\\u202A' + str + '\\u202C';
}

// Examples:
addBidiMarks('Hello مرحبا')    // Adds LTR mark at start and end
addBidiMarks('Hello World')    // Adds LTR mark at start and end`,

  // Natural Language Operations
  "Word Tokenization": `// Splits text into words
function tokenizeWords(str) {
  return str.match(/\\b\\w+\\b/g) || [];
}

// Examples:
tokenizeWords('Hello, world!')         // ["Hello", "world"]
tokenizeWords('This is a test.')       // ["This", "is", "a", "test"]`,

  "Remove Stop Words": `// Removes common stop words
function removeStopWords(str) {
  const stopWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but',
    'in', 'by', 'for', 'to', 'with', 'of'
  ]);
  
  return str
    .toLowerCase()
    .split(/\\s+/)
    .filter(word => !stopWords.has(word))
    .join(' ');
}

// Examples:
removeStopWords('The quick brown fox')     // "quick brown fox"
removeStopWords('This is a test')          // "test"`,

  "Word Stemming": `// Basic word stemming
function simpleStemmer(str) {
  return str
    .toLowerCase()
    .split(/\\s+/)
    .map(word => {
      if (word.endsWith('ing')) return word.slice(0, -3);
      if (word.endsWith('ed')) return word.slice(0, -2);
      if (word.endsWith('s')) return word.slice(0, -1);
      return word;
    })
    .join(' ');
}

// Examples:
simpleStemmer('running jumping')           // "run jump"
simpleStemmer('played games')              // "play game"`,

  "Character Bigrams": `// Generates character bigrams
function generateCharBigrams(str) {
  const bigrams = [];
  for (let i = 0; i < str.length - 1; i++) {
    bigrams.push(str.slice(i, i + 2));
  }
  return bigrams;
}

// Examples:
generateCharBigrams('hello')              // ["he", "el", "ll", "lo"]
generateCharBigrams('hi')                 // ["hi"]`,

  "Word Bigrams": `// Generates word bigrams
function generateWordBigrams(str) {
  const words = str.split(/\\s+/);
  const bigrams = [];
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(words[i] + ' ' + words[i + 1]);
  }
  return bigrams;
}

// Examples:
generateWordBigrams('the quick brown fox')  
// ["the quick", "quick brown", "brown fox"]`,

  "Basic Sentiment": `// Simple sentiment analysis
function analyzeSentiment(str) {
  const positiveWords = new Set([
    'good', 'great', 'awesome', 'excellent', 'happy', 'love'
  ]);
  const negativeWords = new Set([
    'bad', 'terrible', 'awful', 'horrible', 'sad', 'hate'
  ]);

  const words = str.toLowerCase().match(/\\b\\w+\\b/g) || [];
  const positive = words.filter(word => positiveWords.has(word)).length;
  const negative = words.filter(word => negativeWords.has(word)).length;

  if (positive > negative) return 'Positive';
  if (negative > positive) return 'Negative';
  return 'Neutral';
}

// Examples:
analyzeSentiment('This is good and great')     // "Positive"
analyzeSentiment('This is bad and terrible')    // "Negative"
analyzeSentiment('This is normal')              // "Neutral"`,

  // Compression Operations
  "Run Length Encoding": `// Basic run-length encoding
function runLengthEncode(str) {
  return str.replace(/(.)\\1+/g, (match, char) => match.length + char);
}

// Examples:
runLengthEncode('AABBBCCCC')         // "2A3B4C"
runLengthEncode('WWWWWWWWWWWWWWW')   // "15W"`,

  "Run Length Decoding": `// Run-length decoding
function runLengthDecode(str) {
  return str.replace(/(\\d+)(.)/g, (match, count, char) => 
    char.repeat(Number(count))
  );
}

// Examples:
runLengthDecode('2A3B4C')            // "AABBBCCCC"
runLengthDecode('15W')               // "WWWWWWWWWWWWWWW"`,

  "Dictionary Compression": `// Simple dictionary-based compression
function dictionaryCompress(str) {
  const dictionary = new Map();
  const words = str.split(/([\\s,.])/);
  let nextId = 1;
  const compressed = words.map(word => {
    if (!dictionary.has(word)) {
      dictionary.set(word, nextId++);
    }
    return dictionary.get(word);
  });
  
  return {
    dictionary: Object.fromEntries(dictionary),
    compressed
  };
}

// Example:
dictionaryCompress('hello world hello')  
// { dictionary: { hello: 1, " ": 2, world: 3 }, compressed: [1, 2, 3, 2, 1] }`,

 "Dictionary Decompression": `// Dictionary-based decompression
function dictionaryDecompress(data) {
  const reverseDictionary = Object.entries(data.dictionary)
    .reduce((acc, [word, id]) => ({ ...acc, [id]: word }), {});
  
  return data.compressed.map(id => reverseDictionary[id]).join('');
}

// Examples:
const compressed = dictionaryCompress('hello world hello');
dictionaryDecompress(compressed);  // "hello world hello"

const data = {
  dictionary: { hello: 1, " ": 2, world: 3 },
  compressed: [1, 2, 3, 2, 1]
};
dictionaryDecompress(data);        // "hello world hello"`,

  "Burrows-Wheeler Transform": `// Burrows-Wheeler transform
function bwtEncode(str) {
  if (!str) return '';
  str += '$'; // Add end marker
  
  // Generate all rotations
  const rotations = [];
  for (let i = 0; i < str.length; i++) {
    rotations.push(str.slice(i) + str.slice(0, i));
  }
  
  // Sort rotations and take last characters
  rotations.sort();
  return rotations.map(rot => rot[rot.length - 1]).join('');
}

// Burrows-Wheeler transform decode
function bwtDecode(str) {
  if (!str) return '';
  
  const n = str.length;
  const table = [];
  
  // Create initial table
  for (let i = 0; i < n; i++) {
    table.push('');
  }
  
  // Fill table by sorting each column
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      table[j] = str[j] + table[j];
    }
    table.sort();
  }
  
  // Find row that ends with end marker
  return table.find(row => row.endsWith('$')).slice(0, -1);
}

// Examples:
const text = "banana";
const encoded = bwtEncode(text);         // "annb$aa"
const decoded = bwtDecode(encoded);      // "banana"`,

  "Compression Ratio": `// Calculates compression ratio
function calculateCompressionRatio(original, compressed) {
  if (!original || !compressed) return "0%";
  
  const ratio = (compressed.length / original.length) * 100;
  return ratio.toFixed(2) + "%";
}

// Examples:
calculateCompressionRatio("AAAAABBBCC", "5A3B2C");     // "50.00%"
calculateCompressionRatio("ABCDEF", "ABCDEF");         // "100.00%"

// Advanced compression ratio calculator
function advancedCompressionRatio(original, compressed) {
  if (!original || !compressed) {
    return {
      ratio: "0%",
      savings: "0%",
      details: {
        originalSize: 0,
        compressedSize: 0,
        bytesSaved: 0
      }
    };
  }

  const originalSize = original.length;
  const compressedSize = compressed.length;
  const ratio = (compressedSize / originalSize) * 100;
  const savings = 100 - ratio;

  return {
    ratio: ratio.toFixed(2) + "%",
    savings: savings.toFixed(2) + "%",
    details: {
      originalSize,
      compressedSize,
      bytesSaved: originalSize - compressedSize
    }
  };
}

// Examples:
advancedCompressionRatio(
  "AAAAABBBCC",
  "5A3B2C"
);
/* Result:
{
  ratio: "50.00%",
  savings: "50.00%",
  details: {
    originalSize: 10,
    compressedSize: 5,
    bytesSaved: 5
  }`
}


export default StringPlayground;