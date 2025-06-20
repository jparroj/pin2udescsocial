package br.udesc.udescsocial.backend.repository;

import br.udesc.udescsocial.backend.entity.Anuncio;
import org.springframework.data.domain.Pageable; // Adicionado para paginação
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.time.LocalDate; // Mantido para caso Anuncio utilize

public interface AnuncioRepository extends JpaRepository<Anuncio, Long> {

    // Método para buscar categorias ativas (mantido do seu código)
    // Garante categorias únicas
    @Query("SELECT DISTINCT a.tipo FROM Anuncio a")
    List<String> findCategoriasAtivas();

    // Método para buscar anúncios recentes
    // AGORA ACEITA Pageable para lidar com a quantidade de forma mais robusta.
    // O ORDER BY é essencial para ordenar por data de publicação.
    @Query("SELECT a FROM Anuncio a ORDER BY a.dataPublicacao DESC")
    List<Anuncio> findRecentes(Pageable pageable); // Mudou para aceitar Pageable

    // Método para filtro simples por tipo (mantido do seu código)
    @Query("SELECT a FROM Anuncio a WHERE (:tipo IS NULL OR a.tipo = :tipo) ORDER BY a.dataPublicacao DESC")
    List<Anuncio> findWithFilters(@Param("tipo") String tipo);

    // Método alternativo com mais filtros (mantido do seu código)
    @Query("SELECT a FROM Anuncio a WHERE " +
            "(:tipo IS NULL OR a.tipo = :tipo) AND " +
            "(:local IS NULL OR a.local LIKE %:local%) " +
            "ORDER BY a.dataPublicacao DESC")
    List<Anuncio> findWithFilters(
            @Param("tipo") String tipo,
            @Param("local") String local);

    // Método para buscar anúncios por ID do autor (mantido do seu código)
    List<Anuncio> findByAutorId(Long autorId);

    // Observação: JpaRepository já fornece:
    // save(Anuncio): Salva ou atualiza um anúncio
    // findById(Long): Busca um anúncio por ID
    // findAll(): Retorna todos os anúncios
    // deleteById(Long): Remove um anúncio por ID
    // count(): Retorna o total de anúncios
}
