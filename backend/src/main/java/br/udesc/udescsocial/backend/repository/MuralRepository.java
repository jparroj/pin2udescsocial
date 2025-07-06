// backend/src/main/java/br/udesc/udescsocial/backend/repository/MuralRepository.java
package br.udesc.udescsocial.backend.repository;

import br.udesc.udescsocial.backend.entity.Mural;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MuralRepository extends JpaRepository<Mural, Long> {

    @Query("SELECT m FROM Mural m WHERE " +
           "(:categoria IS NULL OR m.categoria = :categoria) AND " +
           "(:keyword IS NULL OR LOWER(CAST(m.titulo AS text)) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(CAST(m.conteudo AS text)) LIKE LOWER(CONCAT('%', :keyword, '%'))) " + // CORREÇÃO AQUI
           "ORDER BY m.dataPublicacao DESC")
    List<Mural> findByKeywordAndCategoria(
            @Param("keyword") String keyword,
            @Param("categoria") String categoria);

    List<Mural> findAllByOrderByDataPublicacaoDesc();
}
