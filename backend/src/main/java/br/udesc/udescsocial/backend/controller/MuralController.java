package br.udesc.udescsocial.backend.controller;

import br.udesc.udescsocial.backend.entity.*;
import br.udesc.udescsocial.backend.repository.*;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional; // Adicione este import

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/mural")
//@CrossOrigin(origins = "*")
public class MuralController {

    private final MuralRepository muralRepository;
    private final ProfessorRepository professorRepository;

    public MuralController(MuralRepository muralRepository, ProfessorRepository professorRepository) {
        this.muralRepository = muralRepository;
        this.professorRepository = professorRepository;
    }

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

    // AQUI ESTÁ A MUDANÇA: Adicione @Transactional(readOnly = true)
    @GetMapping("/murais")
    @Transactional(readOnly = true) // Garante que a sessão do banco de dados esteja aberta
                                   // durante toda a execução deste método e a conversão para DTO
    public ResponseEntity<List<MuralResponseDTO>> listarMurais() {
        List<Mural> murais = muralRepository.findAllByOrderByDataPublicacaoDesc();
        
        // Converte as entidades Mural para DTOs DENTRO da transação
        // Isso garante que os campos LAZY (como 'conteudo' e 'autor.usuario.nome')
        // sejam acessados enquanto a sessão do Hibernate está ativa.
        List<MuralResponseDTO> muraisDTO = murais.stream()
            .map(MuralResponseDTO::new)
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(muraisDTO);
    }
}
