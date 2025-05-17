package br.udesc.udescsocial.backend.controller;

import br.udesc.udescsocial.backend.entity.*;
import br.udesc.udescsocial.backend.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/anuncios")
@CrossOrigin(origins = "*")
public class AnuncioController {
    
    private final AnuncioRepository anuncioRepository;
    private final UsuarioRepository usuarioRepository;
    private final AnuncioFotoRepository anuncioFotoRepository;
    
    public AnuncioController(AnuncioRepository anuncioRepository, 
                           UsuarioRepository usuarioRepository,
                           AnuncioFotoRepository anuncioFotoRepository) {
        this.anuncioRepository = anuncioRepository;
        this.usuarioRepository = usuarioRepository;
        this.anuncioFotoRepository = anuncioFotoRepository;
    }
    
    // Listar todos os anúncios com filtros
    @GetMapping
    public ResponseEntity<?> listarAnuncios(
        @RequestParam(required = false) String tipo) {
        
        try {
            List<Anuncio> anuncios = anuncioRepository.findWithFilters(tipo);
            
            if (anuncios.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Nenhum anúncio encontrado com os critérios especificados");
            }
            
            return ResponseEntity.ok(anuncios);
            
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body("Erro ao buscar anúncios: " + ex.getMessage());
        }
    }
    
    // Criar novo anúncio
    @PostMapping
    public ResponseEntity<?> criarAnuncio(@RequestBody CriarAnuncioRequest request) {
        try {
            Optional<Usuario> autorOpt = usuarioRepository.findById(request.autorId());
            if (autorOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Autor não encontrado");
            }
            
            Anuncio anuncio = new Anuncio();
            anuncio.setAutor(autorOpt.get());
            anuncio.setTitulo(request.titulo()); // Campo título adicionado
            anuncio.setTipo(request.tipo());
            anuncio.setDescricao(request.descricao());
            anuncio.setLocal(request.local());
            anuncio.setQuantidade(request.quantidade());
            anuncio.setDataPublicacao(LocalDate.now());
            
            Anuncio savedAnuncio = anuncioRepository.save(anuncio);
            
            // Salvar fotos se houver
            if (request.fotos() != null && !request.fotos().isEmpty()) {
                for (String urlFoto : request.fotos()) {
                    AnuncioFoto foto = new AnuncioFoto();
                    foto.setAnuncio(savedAnuncio);
                    foto.setUrlImagem(urlFoto);
                    anuncioFotoRepository.save(foto);
                }
            }
            
            return ResponseEntity.status(HttpStatus.CREATED).body(savedAnuncio);
            
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body("Erro ao criar anúncio: " + ex.getMessage());
        }
    }
    
    // Obter anúncio por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obterAnuncio(@PathVariable Long id) {
        Optional<Anuncio> anuncioOpt = anuncioRepository.findById(id);
        if (anuncioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(anuncioOpt.get());
    }
    
    // Listar anúncios de um usuário específico
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> listarAnunciosPorUsuario(@PathVariable Long usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Usuário não encontrado com ID: " + usuarioId);
        }
        
        List<Anuncio> anuncios = anuncioRepository.findByAutorId(usuarioId);
        return ResponseEntity.ok(anuncios);
    }
    
    // Atualizar anúncio
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarAnuncio(
            @PathVariable Long id,
            @RequestBody AtualizarAnuncioRequest request) {
        
        try {
            Optional<Anuncio> anuncioOpt = anuncioRepository.findById(id);
            if (anuncioOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Anuncio anuncio = anuncioOpt.get();
            
            // Atualizar campos permitidos
            if (request.titulo() != null) {
                anuncio.setTitulo(request.titulo());
            }
            if (request.descricao() != null) {
                anuncio.setDescricao(request.descricao());
            }
            if (request.local() != null) {
                anuncio.setLocal(request.local());
            }
            if (request.quantidade() != null) {
                anuncio.setQuantidade(request.quantidade());
            }
            
            // Atualizar fotos se fornecido
            
            
            Anuncio updated = anuncioRepository.save(anuncio);
            return ResponseEntity.ok(updated);
            
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body("Erro ao atualizar anúncio: " + ex.getMessage());
        }
    }
    
    // Deletar anúncio
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarAnuncio(@PathVariable Long id) {
        if (!anuncioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        anuncioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    // Compartilhar anúncio
    @PostMapping("/{id}/compartilhar")
    public ResponseEntity<String> compartilharAnuncio(@PathVariable Long id) {
        if (!anuncioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok("Anúncio compartilhado com sucesso (ID: " + id + ")");
    }
}

// DTOs atualizados
record CriarAnuncioRequest(
    @NotNull(message = "ID do autor é obrigatório")
    Long autorId,
    
    @NotBlank(message = "Título é obrigatório")
    String titulo,
    
    @NotBlank(message = "Tipo é obrigatório")
    @Pattern(regexp = "MATERIAL|AULA|ALUGUEL|EVENTO", 
             message = "Tipo deve ser MATERIAL, AULA, ALUGUEL ou EVENTO")
    String tipo,
    
    @NotBlank(message = "Descrição é obrigatória")
    String descricao,
    
    @NotBlank(message = "Local é obrigatório")
    String local,
    
    @Min(value = 1, message = "Quantidade deve ser pelo menos 1")
    Integer quantidade,
    
    List<String> fotos
) {}

record AtualizarAnuncioRequest(
    String titulo,
    String descricao,
    String local,
    Integer quantidade,
    List<String> fotos
) {}