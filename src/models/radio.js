export const radio = {
  id: "",
  type: "RADIO",
  name: "Radio",
  mainLabel: "",
  label1: "",
  label2: "",
  value1: "",
  value2: "",
  required: false,
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
  {value: "mainLabel", display: "Main Label", type: "string", element: "input"},
  {value: "label1", display: "Label 1", type: "string", element: "input"},
  {value: "value1", display: "Value 1", type: "string", element: "input"},
  {value: "label2", display: "Label 2", type: "string", element: "input"},
  {value: "value2", display: "Value 2", type: "string", element: "input"},
  {value: "required", display: "Required", type: "boolean", element: "select",
    options: [
      {value: false, display: "False"},
      {value: true, display: "True"}
    ]
  },
  {value: "columns", display: "Column Span",type: "number", element: "select", options: cols}
];
