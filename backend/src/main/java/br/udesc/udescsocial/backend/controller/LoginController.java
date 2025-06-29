package br.udesc.udescsocial.backend.controller;

import br.udesc.udescsocial.backend.entity.Usuario;
import br.udesc.udescsocial.backend.repository.UsuarioRepository;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List; // Necessário para listarTodosUsuarios

@RestController
@RequestMapping("/api/login")
//@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class LoginController {

    private final UsuarioRepository repository;

    public LoginController(UsuarioRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        try {
            // Validação básica dos campos
            if (loginRequest.getEmail() == null || loginRequest.getEmail().isBlank()) {
                return ResponseEntity.badRequest()
                    .body(new LoginResponse("O email é obrigatório", false, null, null, null)); // Adaptação para construtor
            }

            if (loginRequest.getSenha() == null || loginRequest.getSenha().isBlank()) {
                return ResponseEntity.badRequest()
                    .body(new LoginResponse("A senha é obrigatória", false, null, null, null)); // Adaptação para construtor
            }

            // Busca usuário pelo email
            Usuario usuario = repository.findByEmail(loginRequest.getEmail());
            
            if (usuario == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse("Credenciais inválidas", false, null, null, null)); // Adaptação para construtor
            }

            // Verifica a senha (em produção, use BCryptPasswordEncoder)
            if (!usuario.getSenha().equals(loginRequest.getSenha())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse("Credenciais inválidas", false, null, null, null)); // Adaptação para construtor
            }

            // Login bem-sucedido
            session.setAttribute("usuario", usuario);
            return ResponseEntity.ok(new LoginResponse(
                "Login bem-sucedido",
                true,
                usuario.getNome(),
                usuario.getTipo(),
                usuario.getId() // <--- Passando o ID do usuário
            ));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new LoginResponse("Erro no servidor: " + e.getMessage(), false, null, null, null)); // Adaptação para construtor
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<Usuario> getCurrentUser(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        // É uma boa prática não retornar a senha
        usuario.setSenha(null); 
        return ResponseEntity.ok(usuario); // Retorna o objeto Usuario, que já contém o ID
    }


    @GetMapping
    public ResponseEntity<?> listarTodosUsuarios() {
        return ResponseEntity.ok(repository.findAll());
    }
}

class LoginRequest {
    private String email;
    private String senha;

    // Getters e Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}

// CLASSE LoginResponse ATUALIZADA - Mova esta classe para fora da classe LoginController
// ou mantenha-a como uma classe interna estática se preferir, mas é bom que ela seja independente
// ou mova para um pacote DTO separado.
// Para fins de correção do erro, vou mantê-la como classe interna, mas com o construtor correto.
// Idealmente, você a declararia como 'public record LoginResponse(...)' em um arquivo LoginResponse.java separado
// no pacote 'br.udesc.udescsocial.backend.dto'.
class LoginResponse { // <--- ESTA É A CLASSE QUE PRECISA SER ATUALIZADA NO SEU ARQUIVO!
    private String message;
    private boolean success;
    private String nome;
    private String tipo;
    private Long userId; // NOVO CAMPO

    // Construtor para respostas de erro (com userId opcional, pode ser null)
    public LoginResponse(String message, boolean success, String nome, String tipo, Long userId) {
        this.message = message;
        this.success = success;
        this.nome = nome;
        this.tipo = tipo;
        this.userId = userId;
    }

    // Construtor auxiliar para casos de erro onde nome/tipo/userId não são aplicáveis
    public LoginResponse(String message, boolean success) {
        this(message, success, null, null, null);
    }

    // Getters
    public String getMessage() {
        return message;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getNome() {
        return nome;
    }

    public String getTipo() {
        return tipo;
    }

    public Long getUserId() { // NOVO GETTER
        return userId;
    }
}
