package br.udesc.udescsocial.backend.controller;

import br.udesc.udescsocial.backend.entity.*;
import br.udesc.udescsocial.backend.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController//Indica que esta classe é um controller REST
@RequestMapping("/anuncios")//Define que todas as rotas começam com /anuncios
@CrossOrigin(origins = "*")//Permite requisições de qualquer origem
public class AnuncioController {
    
    private final AnuncioRepository anuncioRepository;//Para operações com anúncios
    private final UsuarioRepository usuarioRepository;// Para validar autores dos anúncios
    private final AnuncioFotoRepository anuncioFotoRepository;//Para gerenciar fotos dos anúncios
    
    public AnuncioController(AnuncioRepository anuncioRepository, 
                           UsuarioRepository usuarioRepository,
                           AnuncioFotoRepository anuncioFotoRepository) {
        this.anuncioRepository = anuncioRepository;
        this.usuarioRepository = usuarioRepository;
        this.anuncioFotoRepository = anuncioFotoRepository;
    }
    
   @GetMapping
public ResponseEntity<?> listarAnuncios(
    @RequestParam(required = false) String tipo) {
    
    try {
        // Usando o método com apenas o parâmetro tipo
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
    
    @PostMapping// Criar novo anúncio -> POST /anuncios
    @Transactional
    public ResponseEntity<?> criarAnuncio(@RequestBody CriarAnuncioRequest request) {
        try {
            Optional<Usuario> autorOpt = usuarioRepository.findById(request.autorId());
            if (autorOpt.isEmpty()) {//Valida se o autor existe
                return ResponseEntity.badRequest().body("Autor não encontrado");
            }
            
            Anuncio anuncio = new Anuncio();//Cria um novo anúncio com data atual
            anuncio.setAutor(autorOpt.get());
            anuncio.setTitulo(request.titulo());
            anuncio.setTipo(request.tipo());
            anuncio.setDescricao(request.descricao());
            anuncio.setLocal(request.local());
            anuncio.setQuantidade(request.quantidade());
            anuncio.setDataPublicacao(LocalDate.now());//dataatual
            
            Anuncio savedAnuncio = anuncioRepository.save(anuncio);
            
            if (request.fotos() != null && !request.fotos().isEmpty()) {// Salvar fotos se houver
                for (String urlFoto : request.fotos()) {
                    if (urlFoto != null && !urlFoto.isBlank()) {
                        AnuncioFoto foto = new AnuncioFoto();
                        foto.setAnuncio(savedAnuncio);
                        foto.setUrlImagem(urlFoto);
                        anuncioFotoRepository.save(foto);
                    }
                }
            }
            
            return ResponseEntity.status(HttpStatus.CREATED).body(savedAnuncio);
            
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body("Erro ao criar anúncio: " + ex.getMessage());
        }
    }

    @GetMapping("/{id}") // Busca um anúncio específico pelo ID (GET /anuncios/{id})
    public ResponseEntity<?> obterAnuncio(@PathVariable Long id) {
        Optional<Anuncio> anuncioOpt = anuncioRepository.findById(id);
        if (anuncioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(anuncioOpt.get());
    }
    
    @GetMapping("/usuario/{usuarioId}")// Listar anúncios de um usuário específico (GET /anuncios/usuario/{usuarioId})
    public ResponseEntity<?> listarAnunciosPorUsuario(@PathVariable Long usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Usuário não encontrado com ID: " + usuarioId);
        }
        
        List<Anuncio> anuncios = anuncioRepository.findByAutorId(usuarioId);
        return ResponseEntity.ok(anuncios);
    }
    
    @PutMapping("/{id}")// Atualizar anúncio (PUT /anuncios/{id})
    @Transactional
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
            if (request.titulo() != null && !request.titulo().isBlank()) {
                anuncio.setTitulo(request.titulo());
            }
            if (request.descricao() != null && !request.descricao().isBlank()) {
                anuncio.setDescricao(request.descricao());
            }
            if (request.local() != null && !request.local().isBlank()) {
                anuncio.setLocal(request.local());
            }
            if (request.quantidade() != null && request.quantidade() > 0) {
                anuncio.setQuantidade(request.quantidade());
            }
            
            // Atualizar fotos se fornecido
            if (request.fotos() != null) {
                // Primeiro remove todas as fotos existentes
                anuncioFotoRepository.deleteByAnuncioId(id);
                
                // Adiciona as novas fotos
                for (String urlFoto : request.fotos()) {
                    if (urlFoto != null && !urlFoto.isBlank()) {
                        AnuncioFoto foto = new AnuncioFoto();
                        foto.setAnuncio(anuncio);
                        foto.setUrlImagem(urlFoto);
                        anuncioFotoRepository.save(foto);
                    }
                }
            }
            
            Anuncio updated = anuncioRepository.save(anuncio);
            return ResponseEntity.ok(updated);
            
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body("Erro ao atualizar anúncio: " + ex.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")//Deletar Anúncio (DELETE /anuncios/{id})
    @Transactional
    public ResponseEntity<?> deletarAnuncio(@PathVariable Long id) {
        try {
            if (!anuncioRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            
            // Primeiro deleta todas as fotos associadas
            anuncioFotoRepository.deleteByAnuncioId(id);
            
            // Depois deleta o anúncio
            anuncioRepository.deleteById(id);
            
            return ResponseEntity.noContent().build();
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body("Erro ao deletar anúncio: " + ex.getMessage());
        }
    }
    
    @PostMapping("/{id}/compartilhar") //Compartilhar Anúncio (POST /anuncios/{id}/compartilhar)
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
