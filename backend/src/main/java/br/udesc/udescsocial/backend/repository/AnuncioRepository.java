// backend/src/main/java/br/udesc/udescsocial/backend/repository/AnuncioRepository.java
package br.udesc.udescsocial.backend.repository;

import br.udesc.udescsocial.backend.entity.Anuncio;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface AnuncioRepository extends JpaRepository<Anuncio, Long> {

    @Query("SELECT DISTINCT a.tipo FROM Anuncio a")
    List<String> findCategoriasAtivas();

    @Query("SELECT a FROM Anuncio a ORDER BY a.dataPublicacao DESC")
    List<Anuncio> findRecentes(Pageable pageable);

    @Query("SELECT a FROM Anuncio a WHERE " +
            "(:tipo IS NULL OR a.tipo = :tipo) AND " +
            "(:local IS NULL OR a.local LIKE %:local%) " +
            "ORDER BY a.dataPublicacao DESC")
    List<Anuncio> findWithFilters(
            @Param("tipo") String tipo,
            @Param("local") String local);

    List<Anuncio> findByAutorId(Long autorId);

    @Query("SELECT a FROM Anuncio a WHERE " +
           "(:tipo IS NULL OR a.tipo = :tipo) AND " +
           "(:keyword IS NULL OR LOWER(CAST(a.titulo AS text)) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(CAST(a.descricao AS text)) LIKE LOWER(CONCAT('%', :keyword, '%'))) " + // CORREÇÃO AQUI
           "ORDER BY a.dataPublicacao DESC")
    List<Anuncio> findByKeywordAndType(
            @Param("keyword") String keyword,
            @Param("tipo") String tipo);
}
