export const API_BASE = "http://localhost:3000";

async function request(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    const data = await res.json();

    if (!res.ok) {
      // Backend costuma retornar { message: "Erro ao criar usuário", error: "detalhe" }
      // Damos prioridade ao detalhe para facilitar o entendimento do erro.
      const message = data.error || data.message || `API error ${res.status}`;
      throw new Error(message);
    }

    return data;
  } catch (error) {
    console.error(
      `Erro na requisição ${options.method || "GET"} ${path}:`,
      error,
    );
    throw error;
  }
}

export async function list(resource) {
  return request(`/${resource}`);
}

export async function create(resource, data) {
  return request(`/${resource}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function remove(resource, id) {
  return request(`/${resource}/${id}`, { method: "DELETE" });
}

export async function update(resource, id, data) {
  return request(`/${resource}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function login(email, password) {
  return request("/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
