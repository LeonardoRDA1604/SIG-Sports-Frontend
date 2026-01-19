import { useState } from "react";

export default function AdminPanel() {
  const [resultado, setResultado] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [usuarios, setUsuarios] = useState([]);

  const verificarUsuarios = async () => {
    setCarregando(true);
    setResultado("Verificando usuários...");

    try {
      const response = await fetch("http://localhost:3000/debug/users");
      const data = await response.json();

      setUsuarios(data.users || []);
      setResultado(
        `✓ Encontrados ${data.total} usuários no banco\n\n${JSON.stringify(
          data,
          null,
          2
        )}`
      );
    } catch (error) {
      setResultado("❌ Erro ao buscar usuários: " + error.message);
    } finally {
      setCarregando(false);
    }
  };

  const criarUsuarioTeste = async () => {
    setCarregando(true);
    setResultado("Criando usuário...");

    try {
      const response = await fetch("http://localhost:3000/debug/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        setResultado(
          "✓ Usuário criado com sucesso!\n\nEmail: admin@example.com\nSenha: 123456\n\n" +
            JSON.stringify(data, null, 2)
        );
        // Atualizar lista
        setTimeout(verificarUsuarios, 500);
      } else {
        setResultado("❌ Erro ao criar:\n" + JSON.stringify(data, null, 2));
      }
    } catch (error) {
      setResultado("❌ Erro: " + error.message);
    } finally {
      setCarregando(false);
    }
  };

  const testarLogin = async () => {
    setCarregando(true);
    setResultado("Testando login com admin@example.com / 123456...");

    try {
      console.log("Enviando requisição de login...");
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@example.com",
          password: "123456",
        }),
      });

      console.log("Status:", response.status);
      const data = await response.json();
      console.log("Resposta:", data);

      if (response.ok) {
        setResultado(
          "✓ LOGIN BEM-SUCEDIDO!\n\nDados do usuário:\n" +
            JSON.stringify(data, null, 2)
        );
      } else {
        setResultado(
          "❌ Erro no login (Status: " +
            response.status +
            "):\n" +
            JSON.stringify(data, null, 2)
        );
      }
    } catch (error) {
      setResultado("❌ Erro na requisição: " + error.message);
    } finally {
      setCarregando(false);
    }
  };

  const testarBuscaUsuario = async () => {
    setCarregando(true);
    setResultado("Buscando usuário admin@example.com no banco...");

    try {
      const response = await fetch("http://localhost:3000/users");
      const data = await response.json();

      const admin = Array.isArray(data)
        ? data.find((u) => u.email === "admin@example.com")
        : null;

      if (admin) {
        setResultado(
          "✓ Usuário encontrado no banco:\n" + JSON.stringify(admin, null, 2)
        );
      } else {
        setResultado(
          "❌ Usuário admin@example.com NÃO encontrado\n\nTodos os usuários:\n" +
            JSON.stringify(data, null, 2)
        );
      }
    } catch (error) {
      setResultado("❌ Erro: " + error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#1a1a1a",
        color: "#fff",
        minHeight: "100vh",
        fontFamily: "monospace",
      }}
    >
      <h1>🔧 Admin Panel - Debug Login</h1>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={verificarUsuarios}
          disabled={carregando}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            cursor: "pointer",
            background: "#0066ff",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {carregando ? "..." : "1️⃣ Ver Usuários"}
        </button>
        <button
          onClick={criarUsuarioTeste}
          disabled={carregando}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            cursor: "pointer",
            background: "#00aa00",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {carregando ? "..." : "2️⃣ Criar Usuário"}
        </button>
        <button
          onClick={testarBuscaUsuario}
          disabled={carregando}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            cursor: "pointer",
            background: "#ff6600",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {carregando ? "..." : "3️⃣ Buscar no Banco"}
        </button>
        <button
          onClick={testarLogin}
          disabled={carregando}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            background: "#ff0000",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {carregando ? "..." : "4️⃣ Testar Login"}
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>📋 Resultado:</h3>
        <pre
          style={{
            background: "#2a2a2a",
            padding: "15px",
            borderRadius: "5px",
            maxHeight: "500px",
            overflow: "auto",
            border: "1px solid #444",
            color: "#00ff00",
            fontSize: "12px",
          }}
        >
          {resultado || "Clique em um botão para começar..."}
        </pre>
      </div>

      {usuarios.length > 0 && (
        <div>
          <h3>👥 Usuários no banco ({usuarios.length}):</h3>
          <div
            style={{
              background: "#2a2a2a",
              padding: "15px",
              borderRadius: "5px",
              maxHeight: "300px",
              overflow: "auto",
              border: "1px solid #444",
            }}
          >
            {usuarios.map((user, i) => (
              <div
                key={i}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #444",
                  fontSize: "12px",
                }}
              >
                <div>
                  <strong>Nome:</strong> {user.name}
                </div>
                <div>
                  <strong>Email:</strong> {user.email}
                </div>
                <div>
                  <strong>Senha:</strong> {user.password}
                </div>
                <div>
                  <strong>Role:</strong> {user.role}
                </div>
                <div>
                  <strong>Status:</strong> {user.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
