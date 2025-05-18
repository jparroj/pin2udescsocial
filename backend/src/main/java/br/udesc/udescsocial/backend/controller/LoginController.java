// src/main/java/br/udesc/udescsocial/backend/controller/LoginController.java
package br.udesc.udescsocial.backend.controller;

import br.udesc.udescsocial.backend.entity.Usuario;
import br.udesc.udescsocial.backend.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
@CrossOrigin(origins = "*")
public class LoginController {

    private final UsuarioRepository repository;

    public LoginController(UsuarioRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        String senha = loginRequest.getSenha(); // Ajuste se o campo for "password"

        // Busca usuário pelo email
        Usuario usuario = repository.findByEmail(email);
        if (usuario != null && usuario.getSenha().equals(senha)) {
            return ResponseEntity.ok(new LoginResponse("Login bem-sucedido!"));
        } else {
            return ResponseEntity.badRequest().body(new LoginResponse("Credenciais inválidas!"));
        }
    }
    @GetMapping
        public ResponseEntity<?> listarTodosUsuarios() {
        return ResponseEntity.ok(repository.findAll());
    }

}

class LoginRequest {
    private String email;
    private String senha; // Ajuste se for "password"

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

    public LoginResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}