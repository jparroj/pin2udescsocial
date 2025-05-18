package br.udesc.udescsocial.backend.repository;

import br.udesc.udescsocial.backend.entity.AnuncioFoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

public interface AnuncioFotoRepository extends JpaRepository<AnuncioFoto, Long> {
    
    // Busca fotos por ID do anúncio
    List<AnuncioFoto> findByAnuncioId(Long anuncioId);
    
    // Busca específica por ID da foto e ID do anúncio
    @Query("SELECT f FROM AnuncioFoto f WHERE f.id = :fotoId AND f.anuncio.id = :anuncioId")
    Optional<AnuncioFoto> findByIdAndAnuncioId(
        @Param("fotoId") Long fotoId, 
        @Param("anuncioId") Long anuncioId);
    
    // Verifica existência por ID da foto e ID do anúncio
    @Query("SELECT COUNT(f) > 0 FROM AnuncioFoto f WHERE f.id = :fotoId AND f.anuncio.id = :anuncioId")
    boolean existsByIdAndAnuncioId(
        @Param("fotoId") Long fotoId, 
        @Param("anuncioId") Long anuncioId);
    
    // Novo método para deletar fotos por ID do anúncio
    @Modifying
    @Transactional
    @Query("DELETE FROM AnuncioFoto f WHERE f.anuncio.id = :anuncioId")
    void deleteByAnuncioId(@Param("anuncioId") Long anuncioId);
}