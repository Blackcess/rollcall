 [
  ". What are regular expressions? List any five metacharacters used in Python’s re module with examples.",
  "Regular Expressions in Python (re module)",
  [
    { 
      "title": "1. Definition and Purpose", 
      "content": "Regular Expressions (regex or regexp) are sequences of characters that define search patterns. They are mainly used for pattern matching and text manipulation—such as searching, replacing, extracting, and validating specific text patterns within strings. Python provides the built-in 're' module to work with regular expressions."
    },
    { 
      "title": "2. Importance of Regular Expressions", 
      "content": "They allow developers to efficiently parse large text data, validate inputs (like email or phone numbers), and extract relevant information using concise and powerful patterns, making them an essential tool in text processing, data cleaning, and web scraping."
    },
    { 
      "title": "3. Common Functions in re Module", 
      "content": "Python’s 're' module provides key functions such as:\n- re.match(): checks for a match only at the beginning of a string.\n- re.search(): searches for the first occurrence of the pattern anywhere in the string.\n- re.findall(): returns all non-overlapping matches in a list.\n- re.sub(): replaces matched substrings with new text.\n- re.split(): splits a string by the occurrences of a pattern."
    },
    { 
      "title": "4. Five Common Metacharacters with Examples", 
      "content": "Metacharacters are special symbols in regex that represent patterns or rules instead of literal characters."
    },
    { 
      "title": "a) Dot (.)", 
      "content": "Matches any single character except a newline.\nExample: re.findall(r'a.b', 'acb a-b a b') → ['acb', 'a-b']"
    },
    { 
      "title": "b) Caret (^)", 
      "content": "Matches the beginning of a string.\nExample: re.findall(r'^Hello', 'Hello World') → ['Hello']"
    },
    { 
      "title": "c) Dollar ($)", 
      "content": "Matches the end of a string.\nExample: re.findall(r'world$', 'Python world') → ['world']"
    },
    { 
      "title": "d) Asterisk (*)", 
      "content": "Matches zero or more occurrences of the preceding character or group.\nExample: re.findall(r'ab*', 'a ab abb abbb') → ['a', 'ab', 'abb', 'abbb']"
    },
    { 
      "title": "e) Plus (+)", 
      "content": "Matches one or more occurrences of the preceding character or group.\nExample: re.findall(r'ab+', 'a ab abb abbb') → ['ab', 'abb', 'abbb']"
    },
    { 
      "title": "f) (Optional Extra) Square Brackets [ ]", 
      "content": "Used to specify a character set. Matches any one character from within the brackets.\nExample: re.findall(r'[aeiou]', 'education') → ['e', 'u', 'a', 'i', 'o']"
    }
  ],
  "Regular expressions provide a compact, powerful, and efficient way to identify complex string patterns in text. In Python, the 're' module bridges the gap between theory and real-world text processing, enabling robust validation and data extraction.",
  [
    "For instance, validating an email pattern using re.match(r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$', email) ensures structured input.",
    "In text mining, re.findall(r'\\d+', text) can quickly extract all numeric data from large datasets."
  ],
  [
    "Python Documentation: https://docs.python.org/3/library/re.html",
    "Goyvaerts, J., & Levithan, S. (2012). Regular Expressions Cookbook. O'Reilly Media.",
    "Lutz, M. (2013). Learning Python, 5th Edition. O'Reilly Media."
  ]
]
