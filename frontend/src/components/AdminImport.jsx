import React, { useState, useEffect } from "react";
import importApi from "../services/index/importApi";

const AdminImport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrefecture, setSelectedPrefecture] = useState("Tokyo");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSource, setSelectedSource] = useState("google");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [importing, setImporting] = useState(false);
  const [stats, setStats] = useState(null);

  const prefectures = [
    "Tokyo",
    "Osaka",
    "Kyoto",
    "Kanagawa",
    "Chiba",
    "Saitama",
    "Hokkaido",
    "Fukuoka",
    "Hiroshima",
    "Aichi",
    "Miyagi",
  ];

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await importApi.getImportStats();
      setStats(response.stats);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await importApi.searchExternal(
        searchQuery,
        selectedSource,
        selectedPrefecture,
        selectedCategory
      );

      setSearchResults(response.results || []);
      setSelectedItems([]);
      alert(`Found ${response.results?.length || 0} experiences`);
    } catch (error) {
      alert("Error searching: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickImport = async () => {
    if (!searchQuery) {
      alert("Please enter a search query");
      return;
    }

    setImporting(true);
    try {
      const response = await importApi.quickImport(
        searchQuery,
        selectedCategory === "all"
          ? "Atractivos"
          : mapCategoryName(selectedCategory),
        selectedPrefecture,
        10
      );

      alert(`Successfully imported ${response.imported} experiences!`);
      loadStats();
    } catch (error) {
      alert("Import failed: " + error.message);
    } finally {
      setImporting(false);
    }
  };

  const handleBulkImport = async () => {
    if (selectedItems.length === 0) {
      alert("Please select experiences to import");
      return;
    }

    setImporting(true);
    try {
      const itemsToImport = selectedItems.map((index) => searchResults[index]);
      const response = await importApi.importExperiences(
        selectedSource,
        itemsToImport,
        selectedCategory === "all"
          ? "Atractivos"
          : mapCategoryName(selectedCategory)
      );

      alert(
        `Import completed!\nImported: ${response.imported}\nDuplicates: ${response.duplicates}\nErrors: ${response.errors}`
      );
      setSelectedItems([]);
      loadStats();
    } catch (error) {
      alert("Import failed: " + error.message);
    } finally {
      setImporting(false);
    }
  };

  const mapCategoryName = (category) => {
    const mapping = {
      hotels: "Hoteles",
      restaurants: "Restaurantes",
      attractions: "Atractivos",
    };
    return mapping[category] || "Atractivos";
  };

  const toggleSelection = (index) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter((i) => i !== index));
    } else {
      setSelectedItems([...selectedItems, index]);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Import Experiences</h1>

      {/* Stats Section */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-gray-600">Total Experiences</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-green-600">
              {stats.imported}
            </div>
            <div className="text-gray-600">From APIs</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-orange-600">
              {stats.manual}
            </div>
            <div className="text-gray-600">Manual</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-red-600">
              {stats.pending}
            </div>
            <div className="text-gray-600">Pending Review</div>
          </div>
        </div>
      )}

      {/* Search Controls */}
      <div className="bg-white p-6 rounded-lg shadow border mb-6">
        <h2 className="text-xl font-semibold mb-4">Search & Import</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Source</label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="google">Google Places</option>
              <option value="osm">OpenStreetMap</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Prefecture</label>
            <select
              value={selectedPrefecture}
              onChange={(e) => setSelectedPrefecture(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              {prefectures.map((prefecture) => (
                <option key={prefecture} value={prefecture}>
                  {prefecture}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="all">All Categories</option>
              <option value="hotels">Hotels</option>
              <option value="restaurants">Restaurants</option>
              <option value="attractions">Attractions</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Search Query
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., temples, hotels, sushi"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex flex-col justify-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 mb-2"
            >
              {loading ? "Searching..." : "Search"}
            </button>
            <button
              onClick={handleQuickImport}
              disabled={importing || !searchQuery}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {importing ? "Importing..." : "Quick Import (10)"}
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Search Results ({searchResults.length})
            </h2>
            <button
              onClick={handleBulkImport}
              disabled={selectedItems.length === 0 || importing}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              Import Selected ({selectedItems.length})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((experience, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 cursor-pointer ${
                  selectedItems.includes(index)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
                onClick={() => toggleSelection(index)}
              >
                {experience.photo && (
                  <img
                    src={experience.photo}
                    alt={experience.title}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                )}

                <h3 className="font-semibold text-lg mb-2">
                  {experience.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {experience.caption}
                </p>

                <div className="flex flex-wrap gap-1 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {experience.categories}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                    {experience.prefecture}
                  </span>
                  {experience.ratings > 0 && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                      ★ {experience.ratings}
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-500">
                  Price: ¥{experience.price?.toLocaleString() || 0}
                </div>

                {experience.address && (
                  <div className="text-xs text-gray-400 mt-1 truncate">
                    📍 {experience.address}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminImport;
