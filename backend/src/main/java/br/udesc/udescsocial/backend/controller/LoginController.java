package br.udesc.udescsocial.backend.controller;

import br.udesc.udescsocial.backend.entity.Usuario;
import br.udesc.udescsocial.backend.repository.UsuarioRepository;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
            if (loginRequest.getEmail() == null || loginRequest.getEmail().isBlank()) {
                return ResponseEntity.badRequest()
                    .body(new LoginResponse("O email é obrigatório", false, null, null, null));
            }

            if (loginRequest.getSenha() == null || loginRequest.getSenha().isBlank()) {
                return ResponseEntity.badRequest()
                    .body(new LoginResponse("A senha é obrigatória", false, null, null, null));
            }

            Usuario usuario = repository.findByEmail(loginRequest.getEmail());
            
            if (usuario == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse("Credenciais inválidas", false, null, null, null));
            }

            if (!usuario.getSenha().equals(loginRequest.getSenha())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse("Credenciais inválidas", false, null, null, null));
            }

            session.setAttribute("usuario", usuario);
            return ResponseEntity.ok(new LoginResponse(
                "Login bem-sucedido",
                true,
                usuario.getNome(),
                usuario.getTipo(),
                usuario.getId()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new LoginResponse("Erro no servidor: " + e.getMessage(), false, null, null, null));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(HttpSession session) { 
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Optional<Usuario> fullUsuarioOpt = repository.findById(usuario.getId());
        if (fullUsuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        Usuario fullUsuario = fullUsuarioOpt.get();

        fullUsuario.setSenha(null); 

        return ResponseEntity.ok(new UserDTO(fullUsuario)); 
    }


    @GetMapping
    public ResponseEntity<?> listarTodosUsuarios() {
        return ResponseEntity.ok(repository.findAll());
    }
}

class LoginRequest {
    private String email;
    private String senha;

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

class LoginResponse {
    private String message;
    private boolean success;
    private String nome;
    private String tipo;
    private Long userId;

    public LoginResponse(String message, boolean success, String nome, String tipo, Long userId) {
        this.message = message;
        this.success = success;
        this.nome = nome;
        this.tipo = tipo;
        this.userId = userId;
    }

    public LoginResponse(String message, boolean success) {
        this(message, success, null, null, null);
    }

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

    public Long getUserId() {
        return userId;
    }
}
