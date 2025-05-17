package br.udesc.udescsocial.backend.repository;

import br.udesc.udescsocial.backend.entity.Anuncio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface AnuncioRepository extends JpaRepository<Anuncio, Long> {
    
    @Query("SELECT a FROM Anuncio a WHERE " +
       "(:tipo IS NULL OR a.tipo = :tipo) " +
       "ORDER BY a.dataPublicacao DESC")
List<Anuncio> findWithFilters(@Param("tipo") String tipo);
    
    List<Anuncio> findByAutorId(Long autorId);
}