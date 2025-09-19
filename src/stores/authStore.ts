import axios from "axios";
import { makeAutoObservable } from "mobx";

// Backend login response: { code, payload: { id, name, email, department, jwtToken } }
interface LoginPayload {
  id: number;
  name: string;
  email: string;
  department: number;
  jwtToken: string;
}

interface ApiResponse<T> {
  code: string;
  payload: T;
  message?: string;
}

// Departman etiketleri (UI gösterimi için)
const departmentLabels: Record<number, string> = {
  1: "İnsan Kaynakları",
  2: "Satış",
  3: "Pazarlama",
};

class AuthStore {
  email = "";
  name = "";
  department: number | null = null;
  userId: number | null = null;
  token = "";
  error = "";
  isLoading = false;
  rememberMe = false;

  private storageKey = "authStore";

  constructor() {
    makeAutoObservable(this);
    this.hydrate();
  }
  setEmail(email: string) {
    this.email = email;
  }
  clearError() {
    this.error = "";
  }
  // Computed
  get isLoggedIn() {
    return !!this.token;
  }

  get departmentName() {
    if (this.department == null) return "";
    return departmentLabels[this.department] || `Dept#${this.department}`;
  }

  // Actions
  async loginAsync(email: string) {
    this.error = "";
    this.isLoading = true;

    if (!email.includes("@")) {
      this.error = "Geçersiz email";
      this.isLoading = false;
      return;
    }

    try {
      const resp = await axios.post<ApiResponse<LoginPayload>>(
        "http://localhost:5000/api/auth/login",
        { email }
      );

      // Beklenen success code (opsiyonel kontrol)
      if (resp.data.code !== "loginSuccess") {
        this.error = resp.data.message || "Beklenmeyen cevap";
        return;
      }

      const p = resp.data.payload;
      this.email = p.email;
      this.name = p.name;
      this.department = p.department;
      this.userId = p.id;
      this.token = p.jwtToken; // jwtToken -> token
      this.persist();
    } catch (e: any) {
      this.error =
        e?.response?.data?.message ||
        e?.message ||
        "Giriş hatası";
    } finally {
      this.isLoading = false;
    }
  }

  logout() {
    this.email = "";
    this.name = "";
    this.department = null;
    this.userId = null;
    this.token = "";
    this.error = "";
    this.persist();
  }

  setRememberMe(v: boolean) {
    this.rememberMe = v;
    this.persist();
  }

  // Persistence
  private persist() {
    const data = {
      email: this.email,
      name: this.name,
      department: this.department,
      userId: this.userId,
      token: this.token,
      rememberMe: this.rememberMe,
    };
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }

  private hydrate() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return;
      const data = JSON.parse(raw);
      this.email = data.email || "";
      this.name = data.name || "";
      this.department =
        typeof data.department === "number" ? data.department : null;
      this.userId = data.userId ?? null;
      this.token = data.token || "";
      this.rememberMe = !!data.rememberMe;
      if (!this.rememberMe) {
        // Oturumu hatırlama kapalıysa token taşımıyoruz
        this.token = "";
      }
    } catch {
      /* ignore */
    }
  }
}

export const authStore = new AuthStore();