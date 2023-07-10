"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import querystring from "query-string";

import { useDebounce } from "@/hooks/useDebounce";
import Input from "@/components/Input";

// interface SearchInputProps extends React.HTMLAttributes<HTMLInputElement> {}
// const SearchInput = React.forwardRef(({}, ref) => {
//   return <div></div>;
// });
//
// SearchInput.displayName = "SearchInput";

const SearchInput = () => {
  const [value, setValue] = useState("");
  const router = useRouter();
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    const url = querystring.stringifyUrl({
      url: "/search",
      query: { term: debouncedValue },
    });

    router.push(url);
  }, [debouncedValue, router]);

  const handleOnSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setValue(event.target.value);
  };

  return (
    <Input
      placeholder="What do you want to listen to?"
      value={value}
      onChange={handleOnSearch}
    />
  );
};
export default SearchInput;
