/**
 * Classe CaronaController
 * 
 * Author: Elian
 * Data: 2025-05-15
 */
package br.udesc.udescsocial.backend.controller;

import br.udesc.udescsocial.backend.entity.*;
import br.udesc.udescsocial.backend.repository.*;
import jakarta.validation.constraints.NotBlank;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/mural")
@CrossOrigin(origins = "*")
public class MuralController {
    
    private final MuralRepository muralRepository;
    
    public MuralController(MuralRepository muralRepository) {
        this.muralRepository = muralRepository;
    }
    

    @PostMapping("/cadastrar")
    public ResponseEntity<Long> cadastrarMural(@RequestBody MuralRequest request) {
        
        Mural mural = new Mural();
        mural.setTitulo(request.titulo());
        mural.setCategoria(request.categoria());
        mural.setConteudo(request.conteudo());
        mural.setDataPublicacao(LocalDate.now());
        
        Long saved = muralRepository.Add(mural);
        return ResponseEntity.ok(saved);
    }
    

    @GetMapping("/murais")
    public ResponseEntity<?> listarMurais() {
    
        List<Mural> murais = muralRepository.findAll();
        
        if (murais.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(" Nenhum Mural encontrado ");
        }
        
        return ResponseEntity.ok(murais);
    }
    
}

// Classes de request (DTOs)
record MuralRequest(
    Long AutorId,
    
    @NotBlank(message = "Titulo é obrigatório")
    String titulo,
    
    @NotBlank(message = "Conteúdo é obrigatório")
    String conteudo,
    
    @NotBlank(message = "Data deve ser atual ou futura")
    String categoria
) {}
