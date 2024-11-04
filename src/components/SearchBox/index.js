import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { IoIosSearch } from "react-icons/io";
const SearchBox = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSearch = () => {
    if (query.trim()) {
      setIsLoading(true); // Set loading to true when search is initiated
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsLoading(false); // Reset loading after navigation (in real cases, you might want to set this after a response is received)
      setQuery("");
    }
  };
  return (
    <div className="searchBox position-relative d-flex margin-left-4 align-items-center">
      <input
        type="text"
        placeholder="Search for Products..."
        className="searchInput"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Trigger search on Enter key
      />
      <Button onClick={handleSearch}>
        {isLoading ? (
          <CircularProgress size={24} />
        ) : (
          <IoIosSearch className="searchIcon" />
        )}
      </Button>
    </div>
  );
};

export default SearchBox;
