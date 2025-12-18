// app/lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Helper function untuk handle response
async function handleResponse(response: Response) {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || result.message || "Something went wrong");
  }

  // Backend mengembalikan { success: true, data: {...} }
  // Atau { success: true, data: [...] } untuk array
  // Atau langsung array/object
  if (result.success && result.data !== undefined) {
    return result.data;
  }

  // Jika response langsung berupa data tanpa wrapper
  return result;
}

// Admin Authentication API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Login failed");
    }

    // Return data dari backend: { success: true, data: { token, user } }
    return result.data || result;
  },

  verifyToken: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    return handleResponse(response);
  },
};

// Menu API
export const menuAPI = {
  // Get all menu items (Public)
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/menu`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      console.log("Menu API Response:", result); // Debug log

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch menu");
      }

      // Handle berbagai format response
      if (result.success && result.data) {
        return result.data;
      }

      // Jika backend langsung return array
      if (Array.isArray(result)) {
        return result;
      }

      // Jika response adalah object dengan key lain
      return result.menu || result.data || result;
    } catch (error) {
      console.error("Menu API Error:", error);
      throw error;
    }
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/menu/${id}`);
    return handleResponse(response);
  },

  create: async (menuData: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/menu`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(menuData),
    });
    return handleResponse(response);
  },

  update: async (id: string, menuData: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/menu/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(menuData),
    });
    return handleResponse(response);
  },

  delete: async (id: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/menu/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    return handleResponse(response);
  },
};

// Order API
export const orderAPI = {
  // Get all orders (Admin only)
  getAll: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();

      console.log("Orders API Response:", result); // Debug log

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch orders");
      }

      // Handle berbagai format response
      if (result.success && result.data) {
        return result.data;
      }

      if (Array.isArray(result)) {
        return result;
      }

      return result.orders || result.data || result;
    } catch (error) {
      console.error("Orders API Error:", error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      console.log("🔍 Fetching order by ID:", id);
      console.log("📡 API URL:", `${API_BASE_URL}/api/orders/${id}`);

      const response = await fetch(`${API_BASE_URL}/api/orders/${id}`);
      const result = await response.json();

      console.log("📦 Order response:", result);
      console.log("✅ Response OK?", response.ok);

      if (!response.ok) {
        console.error("❌ Order fetch failed:", result.error);
        throw new Error(result.error || "Order not found");
      }

      // Backend return { success: true, data: {...} }
      if (result.success && result.data) {
        console.log("✅ Returning result.data");
        return result.data;
      }

      console.log("✅ Returning result directly");
      return result;
    } catch (error: any) {
      console.error("❌ Order getById Error:", error.message);
      throw error;
    }
  },

  create: async (orderData: any) => {
    try {
      console.log("📤 Creating order with data:", orderData);

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await handleResponse(response);

      console.log("✅ Order created, response:", result);
      console.log(
        "🆔 Order ID from response:",
        result.order_id || result.id || result.data?.order_id
      );

      return result;
    } catch (error) {
      console.error("❌ Order create error:", error);
      throw error;
    }
  },

  updateStatus: async (id: string, status: string, token: string) => {
    try {
      // Status yang valid sesuai backend
      const validStatuses = [
        "pending",
        "confirmed",
        "processing",
        "ready",
        "completed",
        "cancelled",
      ];

      if (!validStatuses.includes(status)) {
        throw new Error("Invalid status: " + status);
      }

      const response = await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update status");
      }

      return result.data || result;
    } catch (error) {
      console.error("Update Status Error:", error);
      throw error;
    }
  },

  // Upload payment proof
  uploadPaymentProof: async (orderId: string, base64Image: string) => {
    try {
      console.log("📤 Starting upload payment proof...");
      console.log("🆔 Order ID:", orderId);
      console.log("📏 Image size:", base64Image.length, "characters");
      console.log(
        "📊 Size estimate:",
        (base64Image.length / 1024).toFixed(2),
        "KB"
      );
      console.log("🔍 First 50 chars:", base64Image.substring(0, 50));

      const url = `${API_BASE_URL}/api/orders/${orderId}/payment-proof`;
      console.log("🔗 API URL:", url);

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_proof: base64Image,
        }),
      });

      console.log("📡 Response status:", response.status);
      console.log("📡 Response ok:", response.ok);

      // Coba parse response
      let result;
      const contentType = response.headers.get("content-type");
      console.log("📄 Content-Type:", contentType);

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
        console.log("📦 Response data:", result);
      } else {
        // Jika bukan JSON, ambil sebagai text
        const text = await response.text();
        console.error("❌ Response is not JSON:", text);
        throw new Error(
          "Server returned non-JSON response: " + text.substring(0, 100)
        );
      }

      if (!response.ok) {
        console.error("❌ Upload failed with status:", response.status);
        console.error("❌ Error details:", result);

        // Pesan error yang lebih detail
        const errorMessage =
          result.error ||
          result.message ||
          result.details ||
          `Upload failed with status ${response.status}`;

        throw new Error(errorMessage);
      }

      // Verify result has expected structure
      if (!result.success) {
        console.warn("⚠️ Success flag is false:", result);
        throw new Error(
          result.error || result.message || "Upload failed but no error message"
        );
      }

      console.log("✅ Upload successful!");
      return result;
    } catch (error: any) {
      console.error("❌ Upload Payment Proof Error:", error.message);

      // Log stack trace untuk debugging
      if (error.stack) {
        console.error("Stack trace:", error.stack);
      }

      // Re-throw dengan pesan yang lebih jelas
      throw new Error(
        error.message ||
          "Failed to upload payment proof. Please check your connection and try again."
      );
    }
  },

  getByPhone: async (phone: string) => {
    try {
      console.log("📞 Fetching orders for phone:", phone);

      const response = await fetch(
        `${API_BASE_URL}/api/orders/customer/by-phone/${phone}`
      );
      const result = await response.json();

      console.log("📦 Orders response:", result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch orders");
      }

      return result.data || [];
    } catch (error: any) {
      console.error("❌ Error fetching orders:", error);
      throw error;
    }
  },
};