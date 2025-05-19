package br.udesc.udescsocial.backend.controller;

import br.udesc.udescsocial.backend.entity.*;
import br.udesc.udescsocial.backend.repository.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/professores")
@CrossOrigin(origins = "*")
public class ProfessorController {

    private final ProfessorRepository professorRepository;
    private final UsuarioRepository usuarioRepository;

    public ProfessorController(ProfessorRepository professorRepository, 
                             UsuarioRepository usuarioRepository) {
        this.professorRepository = professorRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping
    public ResponseEntity<?> criarProfessor(@RequestBody @Valid ProfessorRequest request) {
        try {
            Usuario usuario = usuarioRepository.findById(request.usuarioId())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Usuário não encontrado com ID: " + request.usuarioId()
                ));

            if (!"PROFESSOR".equals(usuario.getTipo())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Apenas usuários do tipo PROFESSOR podem ser cadastrados como professores");
            }

            if (professorRepository.existsByUsuarioId(request.usuarioId())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Este usuário já está cadastrado como professor");
            }

            Professor professor = new Professor();
            professor.setUsuario(usuario);
            professor.setDepartamento(request.departamento());

            Professor professorSalvo = professorRepository.save(professor);
            return ResponseEntity.status(HttpStatus.CREATED).body(professorSalvo);

        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getReason());
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                .body("Erro ao criar professor: " + ex.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Professor não encontrado com ID: " + id
                ));
            return ResponseEntity.ok(professor);
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                .body("Erro ao buscar professor: " + ex.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Professor>> listarTodosProfessores() {
        List<Professor> professores = professorRepository.findAllWithUsuario();
        return ResponseEntity.ok(professores);
    }
}