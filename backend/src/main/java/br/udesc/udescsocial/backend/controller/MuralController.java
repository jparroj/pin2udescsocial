/**
 * Classe MuralController
 * 
 * Usuario: Lucas Eduardo

 */
package br.udesc.udescsocial.backend.controller;

import br.udesc.udescsocial.backend.entity.*;
import br.udesc.udescsocial.backend.repository.*;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/mural")
@CrossOrigin(origins = "*")
public class MuralController {

    private final MuralRepository muralRepository;
    private final ProfessorRepository professorRepository;

    public MuralController(MuralRepository muralRepository, ProfessorRepository professorRepository) {
        this.muralRepository = muralRepository;
        this.professorRepository = professorRepository;
    }

    // Endpoint para cadastrar um novo mural com informações distintas.
    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrarMural(@RequestBody @Valid MuralRequest request) {
        Optional<Professor> autorOpt = professorRepository.findById(request.autorId());

        if (autorOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Autor (professor) não encontrado.");
        }

        Mural mural = new Mural();
        mural.setTitulo(request.titulo());
        mural.setCategoria(request.categoria());
        mural.setConteudo(request.conteudo());
        mural.setAutor(autorOpt.get());
        mural.setDataPublicacao(LocalDate.now());

        Mural salvo = muralRepository.save(mural);
        return ResponseEntity.ok(salvo.getId());
    }

    // Endpoint para listar todos os murais (ordenados pela data de postagem)
    @GetMapping("/murais")
    public ResponseEntity<List<Mural>> listarMurais() {
        List<Mural> murais = muralRepository.findAllByOrderByDataPublicacaoDesc();
        return ResponseEntity.ok(murais);
    }
}