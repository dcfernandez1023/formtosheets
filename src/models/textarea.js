export const textarea = {
  id: "",
  type: "TEXTAREA",
  name: "Textarea",
  label: "",
  required: false,
  placeholder: "",
  rows: 4,
  columns: 12
}

var rows = [];
for(var i = 1; i < 21; i++) {
  let option = {};
  option.value = i;
  option.display = i.toString();
  rows.push(option);
}

var cols = [];
for(var i = 1; i < 13; i++) {
  let option = {};
  option.value = i;
  option.display = i.toString();
  cols.push(option);
}

export const fields = [
  {value: "name", display: "Name", type: "string", element: "input"},
  {value: "label", display: "Label", type: "string", element: "input"},
  {value: "required", display: "Required", type: "boolean", element: "select",
    options: [
      {value: false, display: "False"},
      {value: true, display: "True"}
    ]
  },
  {value: "placeholder", display: "Placeholder", type: "string", element: "input"},
  {value: "rows", display: "Rows", type: "number", element: "select", options: rows},
  {value: "columns", display: "Column Span", type: "number", element: "select", options: cols}
];
