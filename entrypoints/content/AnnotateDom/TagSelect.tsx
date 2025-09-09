import * as React from "react";

import { useState } from "react";

const SelectScrollable = () => {
  const countryOptions = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
    { value: "de", label: "Germany" },
    { value: "fr", label: "France" },
    { value: "jp", label: "Japan" },
    { value: "au", label: "Australia" },
    { value: "br", label: "Brazil" },
    { value: "in", label: "India" },
    { value: "cn", label: "China" },
    { value: "ru", label: "Russia" },
    { value: "za", label: "South Africa" },
  ];
  const [singleValue, setSingleValue] = useState<string | null>(null);
  return <div></div>;
};
export default SelectScrollable;
