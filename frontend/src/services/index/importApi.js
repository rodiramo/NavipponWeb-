// services/importApi.js
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001";

class ImportApiService {
  constructor() {
    this.baseUrl = API_BASE;
  }

  getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async searchExternal(query, source, prefecture, category) {
    try {
      const params = new URLSearchParams({
        query: query || category,
        source,
        prefecture,
        category,
      });

      const response = await fetch(
        `${this.baseUrl}/api/import/search-external?${params}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Search error:", error);
      throw error;
    }
  }

  async importExperiences(source, data, category) {
    try {
      const response = await fetch(`${this.baseUrl}/api/import/import`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          source,
          data,
          category,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Import error:", error);
      throw error;
    }
  }

  async quickImport(query, category, prefecture, limit = 10) {
    try {
      const response = await fetch(`${this.baseUrl}/api/import/quick-import`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          query,
          category,
          prefecture,
          limit,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Quick import error:", error);
      throw error;
    }
  }

  async getImportStats() {
    try {
      const response = await fetch(`${this.baseUrl}/api/import/stats`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Stats error:", error);
      throw error;
    }
  }
}

const importApiService = new ImportApiService();
export default importApiService;
