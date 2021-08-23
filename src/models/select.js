export const select = {
  id: "",
  type: "SELECT",
  name: "Select",
  label: "",
  required: false,
  options: [],
  columns: 12
};

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
  {value: "columns", display: "Column Span",type: "number", element: "select", options: cols},
  {value: "options", display: "Options", type: "string", element: "inputs"}
];
