package br.udesc.udescsocial.backend.controller;

import br.udesc.udescsocial.backend.entity.*;
import br.udesc.udescsocial.backend.repository.*;
import jakarta.validation.constraints.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/anuncios/{anuncioId}/fotos")//Mapeia todas as rotas para o caminho base /anuncios/{anuncioId}/fotos
@CrossOrigin(origins = "*")//Permite requisições de qualquer origem
public class AnuncioFotoController {

    private final AnuncioFotoRepository fotoRepository;//Para operações com foto
    private final AnuncioRepository anuncioRepository;//Para validar a existência dos anúncios

    public AnuncioFotoController(AnuncioFotoRepository fotoRepository, 
                               AnuncioRepository anuncioRepository) {
        this.fotoRepository = fotoRepository;
        this.anuncioRepository = anuncioRepository;
    }

    
    @PostMapping// Adicionar nova foto a um anúncio (POST /anuncios/{anuncioId}/fotos)
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

    @GetMapping// Listar todas as fotos de um anúncio(GET /anuncios/{anuncioId}/fotos)
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

    @GetMapping("/{fotoId}")// Obter uma foto específica (GET /anuncios/{anuncioId}/fotos/{fotoId})
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

    @PutMapping("/{fotoId}")// Atualizar uma foto existente (PUT /anuncios/{anuncioId}/fotos/{fotoId})
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

    @DeleteMapping("/{fotoId}")//Remover Foto (DELETE /anuncios/{anuncioId}/fotos/{fotoId})
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

    // Records para os DTOs de request
    public record NovaFotoRequest(
        @NotBlank(message = "URL da imagem é obrigatória")
        String urlImagem
    ) {}

    public record AtualizarFotoRequest(
        @NotBlank(message = "URL da imagem é obrigatória")
        String urlImagem
    ) {}
}