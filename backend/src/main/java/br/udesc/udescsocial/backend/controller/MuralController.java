// backend/src/main/java/br/udesc/udescsocial/backend/controller/MuralController.java
package br.udesc.udescsocial.backend.controller;

import br.udesc.udescsocial.backend.entity.Mural;
import br.udesc.udescsocial.backend.entity.Usuario;
import br.udesc.udescsocial.backend.entity.Professor;
import br.udesc.udescsocial.backend.repository.MuralRepository;
import br.udesc.udescsocial.backend.repository.UsuarioRepository;
import br.udesc.udescsocial.backend.repository.ProfessorRepository;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/mural")
public class MuralController {

    private final MuralRepository muralRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProfessorRepository professorRepository;

    public MuralController(MuralRepository muralRepository,
                           UsuarioRepository usuarioRepository,
                           ProfessorRepository professorRepository) {
        this.muralRepository = muralRepository;
        this.usuarioRepository = usuarioRepository;
        this.professorRepository = professorRepository;
    }

    @GetMapping("/murais")
    @Transactional(readOnly = true)
    public ResponseEntity<?> listarMurais(
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String keyword) {
        try {
            List<Mural> murais;
            if (keyword != null && !keyword.isBlank()) {
                murais = muralRepository.findByKeywordAndCategoria(keyword, categoria);
            } else if (categoria != null && !categoria.isBlank()) {
                murais = muralRepository.findByKeywordAndCategoria(null, categoria);
            } else {
                murais = muralRepository.findAllByOrderByDataPublicacaoDesc();
            }

            return ResponseEntity.ok(murais.stream().map(mural -> new MuralDTO(mural)).collect(Collectors.toList()));

        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body("Erro ao buscar publicações do mural: " + ex.getMessage());
        }
    }

    @GetMapping("/professores/by-usuario/{userId}")
    public ResponseEntity<?> getProfessorIdByUserId(@PathVariable Long userId) {
        try {
            Optional<Professor> professorOpt = professorRepository.findByUsuarioId(userId);
            if (professorOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Professor não encontrado para o usuário com ID: " + userId);
            }
            return ResponseEntity.ok(professorOpt.get().getId());
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body("Erro ao buscar ID do professor: " + ex.getMessage());
        }
    }


    @PostMapping("/cadastrar")
    @Transactional
    public ResponseEntity<?> criarMural(@RequestBody CriarMuralRequest request) {
        try {
            Optional<Professor> autorOpt = professorRepository.findById(request.autorId());
            if (autorOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Autor (Professor) não encontrado");
            }

            Mural mural = new Mural();
            mural.setAutor(autorOpt.get());
            mural.setTitulo(request.titulo());
            mural.setCategoria(request.categoria());
            mural.setConteudo(request.conteudo());
            mural.setDataPublicacao(LocalDate.now());

            Mural savedMural = muralRepository.save(mural);
            return ResponseEntity.status(HttpStatus.CREATED).body(new MuralDTO(savedMural));

        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body("Erro ao criar publicação no mural: " + ex.getMessage());
        }
    }

    @PutMapping("/atualizar/{id}")
    @Transactional
    public ResponseEntity<?> atualizarMural(@PathVariable Long id, @RequestBody AtualizarMuralRequest request) {
        try {
            Optional<Mural> muralOpt = muralRepository.findById(id);
            if (muralOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Mural mural = muralOpt.get();

            if (!mural.getAutor().getId().equals(request.autorId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Você não tem permissão para atualizar esta publicação.");
            }

            if (request.titulo() != null && !request.titulo().isBlank()) {
                mural.setTitulo(request.titulo());
            }
            if (request.categoria() != null && !request.categoria().isBlank()) {
                mural.setCategoria(request.categoria());
            }
            if (request.conteudo() != null && !request.conteudo().isBlank()) {
                mural.setConteudo(request.conteudo());
            }

            Mural updatedMural = muralRepository.save(mural);
            return ResponseEntity.ok(new MuralDTO(updatedMural));

        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body("Erro ao atualizar publicação no mural: " + ex.getMessage());
        }
    }

    @DeleteMapping("/excluir/{id}")
    @Transactional
    public ResponseEntity<?> deletarMural(@PathVariable Long id, @RequestParam Long autorId) {
        try {
            Optional<Mural> muralOpt = muralRepository.findById(id);
            if (muralOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Mural mural = muralOpt.get();
            if (!mural.getAutor().getId().equals(autorId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Você não tem permissão para excluir esta publicação.");
            }

            muralRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body("Erro ao excluir publicação do mural: " + ex.getMessage());
        }
    }
}

record CriarMuralRequest(
    @NotNull(message = "ID do autor é obrigatório")
    Long autorId,
    @NotBlank(message = "Título é obrigatório")
    String titulo,
    @NotBlank(message = "Categoria é obrigatória")
    String categoria,
    @NotBlank(message = "Conteúdo é obrigatório")
    String conteudo
) {}

record AtualizarMuralRequest(
    @NotNull(message = "ID do autor é obrigatório")
    Long autorId,
    String titulo,
    String categoria,
    String conteudo
) {}

record MuralDTO(
    Long id,
    String titulo,
    String categoria,
    String conteudo,
    LocalDate dataPublicacao,
    String autorNome,
    Long autorId
) {
    public MuralDTO(Mural mural) {
        this(
            mural.getId(),
            mural.getTitulo(),
            mural.getCategoria(),
            mural.getConteudo(),
            mural.getDataPublicacao(),
            mural.getAutor() != null && mural.getAutor().getUsuario() != null ? mural.getAutor().getUsuario().getNome() : "Desconhecido",
            mural.getAutor() != null ? mural.getAutor().getId() : null
        );
    }
}
