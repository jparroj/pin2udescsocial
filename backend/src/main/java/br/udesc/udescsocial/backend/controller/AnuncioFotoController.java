package br.udesc.udescsocial.backend.controller;

import br.udesc.udescsocial.backend.entity.*;
import br.udesc.udescsocial.backend.repository.*;
import jakarta.validation.constraints.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/anuncios/{anuncioId}/fotos")
@CrossOrigin(origins = "*")
public class AnuncioFotoController {

    private final AnuncioFotoRepository fotoRepository;
    private final AnuncioRepository anuncioRepository;

    public AnuncioFotoController(AnuncioFotoRepository fotoRepository, 
                               AnuncioRepository anuncioRepository) {
        this.fotoRepository = fotoRepository;
        this.anuncioRepository = anuncioRepository;
    }

    
    @PostMapping
    public ResponseEntity<?> adicionarFoto(
            @PathVariable Long anuncioId,
            @RequestBody NovaFotoRequest request) {
        
        try {
            Optional<Anuncio> anuncioOpt = anuncioRepository.findById(anuncioId);
            if (anuncioOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Anúncio não encontrado com ID: " + anuncioId);
            }

            AnuncioFoto foto = new AnuncioFoto();
            foto.setAnuncio(anuncioOpt.get());
            foto.setUrlImagem(request.urlImagem());

            AnuncioFoto saved = fotoRepository.save(foto);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
            
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body("Erro ao adicionar foto: " + ex.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> listarFotos(@PathVariable Long anuncioId) {
        try {
            if (!anuncioRepository.existsById(anuncioId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Anúncio não encontrado com ID: " + anuncioId);
            }
            
            List<AnuncioFoto> fotos = fotoRepository.findByAnuncioId(anuncioId);
            return ResponseEntity.ok(fotos);
            
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body("Erro ao listar fotos: " + ex.getMessage());
        }
    }

    @GetMapping("/{fotoId}")
    public ResponseEntity<?> obterFoto(
            @PathVariable Long anuncioId,
            @PathVariable Long fotoId) {
        
        try {
            Optional<AnuncioFoto> fotoOpt = fotoRepository.findByIdAndAnuncioId(fotoId, anuncioId);
            if (fotoOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Foto não encontrada para o anúncio especificado");
            }
            return ResponseEntity.ok(fotoOpt.get());
            
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body("Erro ao obter foto: " + ex.getMessage());
        }
    }

    @PutMapping("/{fotoId}")
    public ResponseEntity<?> atualizarFoto(
            @PathVariable Long anuncioId,
            @PathVariable Long fotoId,
            @RequestBody AtualizarFotoRequest request) {
        
        try {
            Optional<AnuncioFoto> fotoOpt = fotoRepository.findByIdAndAnuncioId(fotoId, anuncioId);
            if (fotoOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Foto não encontrada para o anúncio especificado");
            }

            AnuncioFoto foto = fotoOpt.get();
            foto.setUrlImagem(request.urlImagem());

            AnuncioFoto updated = fotoRepository.save(foto);
            return ResponseEntity.ok(updated);
            
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body("Erro ao atualizar foto: " + ex.getMessage());
        }
    }

    @DeleteMapping("/{fotoId}")
    public ResponseEntity<?> deletarFoto(
            @PathVariable Long anuncioId,
            @PathVariable Long fotoId) {
        
        try {
            if (!fotoRepository.existsByIdAndAnuncioId(fotoId, anuncioId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Foto não encontrada para o anúncio especificado");
            }

            fotoRepository.deleteById(fotoId);
            return ResponseEntity.noContent().build();
            
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body("Erro ao deletar foto: " + ex.getMessage());
        }
    }

    public record NovaFotoRequest(
        @NotBlank(message = "URL da imagem é obrigatória")
        String urlImagem
    ) {}

    public record AtualizarFotoRequest(
        @NotBlank(message = "URL da imagem é obrigatória")
        String urlImagem
    ) {}
}