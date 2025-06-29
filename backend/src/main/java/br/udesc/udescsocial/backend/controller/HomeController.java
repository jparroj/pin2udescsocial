package br.udesc.udescsocial.backend.controller;

import br.udesc.udescsocial.backend.entity.Anuncio;
import br.udesc.udescsocial.backend.repository.AnuncioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.cache.annotation.Cacheable;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

// Adicionar os imports para PageRequest e Sort
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;


@RestController
@RequestMapping("/api/home")
//@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class HomeController {

    private final AnuncioRepository anuncioRepository;

    public HomeController(AnuncioRepository anuncioRepository) {
        this.anuncioRepository = anuncioRepository;
    }

    @GetMapping
    public ResponseEntity<HomeDTO> getHomeData(
            @RequestParam(defaultValue = "8") int quantidadeAnuncios) {
        try {
            HomeDTO homeData = new HomeDTO(
                getAnunciosRecentes(quantidadeAnuncios),
                getCategoriasAtivas()
            );
            return ResponseEntity.ok(homeData);
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<AnuncioResumoDTO>> getRecommendations(
            @RequestParam(defaultValue = "4") int quantidadeRecomendacoes) {
        try {
            // Agora, chame getAnunciosRecentes com a quantidade desejada, usando PageRequest
            List<AnuncioResumoDTO> recommendations = getAnunciosRecentes(quantidadeRecomendacoes);
            return ResponseEntity.ok(recommendations);
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @Cacheable("anunciosRecentes")
    private List<AnuncioResumoDTO> getAnunciosRecentes(int quantidade) {
        // MUITO IMPORTANTE: Mude a chamada para findRecentes aqui!
        // PageRequest.of(0, quantidade): Começa da página 0, com 'quantidade' itens por página.
        // Sort.by("dataPublicacao").descending(): Ordena pela data de publicação, decrescente.
        return anuncioRepository.findRecentes(PageRequest.of(0, quantidade, Sort.by("dataPublicacao").descending())).stream()
            .map(AnuncioResumoDTO::new)
            .collect(Collectors.toList());
    }

    @Cacheable("categoriasAtivas")
    private List<String> getCategoriasAtivas() {
        return anuncioRepository.findCategoriasAtivas();
    }

    // ========== DTOs (Record Classes) ==========
    
    public record HomeDTO(
        List<AnuncioResumoDTO> anunciosRecentes,
        List<String> categoriasAtivas
    ) {}

    public record AnuncioResumoDTO(
        Long id,
        String titulo,
        String tipo,
        String local,
        String autorNome,
        LocalDate dataPublicacao,
        String fotoPrincipal
    ) {
        public AnuncioResumoDTO(Anuncio anuncio) {
            this(
                anuncio.getId(),
                anuncio.getTitulo(),
                anuncio.getTipo(),
                anuncio.getLocal(),
                anuncio.getAutor().getNome(),
                anuncio.getDataPublicacao(),
                anuncio.getFotos() != null && !anuncio.getFotos().isEmpty() ? 
                    anuncio.getFotos().get(0).getUrlImagem() : null
            );
        }
    }
}
