export const modules = {
  toolbar: {
    container: "#toolbar",
    handlers: {
      image: function () {} // we'll override in EditorComponent.js
    },
  },
  history: {
    delay: 1000,
    maxStack: 100,
    userOnly: true,
  },
};

export const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "code-block",
  "table"
];
