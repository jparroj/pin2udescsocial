/*package br.udesc.udescsocial.backend.repository;

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
/*
Por estender JpaRepository, esta interface já possui muitos métodos prontos, incluindo:

save(Anuncio): Salva ou atualiza um anúncio

findById(Long): Busca um anúncio por ID

findAll(): Retorna todos os anúncios

deleteById(Long): Remove um anúncio por ID

count(): Retorna o total de anúncios
 */

package br.udesc.udescsocial.backend.repository;

import br.udesc.udescsocial.backend.entity.Anuncio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface AnuncioRepository extends JpaRepository<Anuncio, Long> {

    // Adicione este método para buscar categorias ativas
    @Query("SELECT DISTINCT a.tipo FROM Anuncio a")
    List<String> findCategoriasAtivas();

    // Método para buscar anúncios recentes
    @Query("SELECT a FROM Anuncio a ORDER BY a.dataPublicacao DESC")
    List<Anuncio> findRecentes(@Param("limit") int limit);
    
    // Método para filtro simples por tipo
    @Query("SELECT a FROM Anuncio a WHERE (:tipo IS NULL OR a.tipo = :tipo) ORDER BY a.dataPublicacao DESC")
    List<Anuncio> findWithFilters(@Param("tipo") String tipo);
    
    // Método alternativo com mais filtros (opcional)
    @Query("SELECT a FROM Anuncio a WHERE " +
           "(:tipo IS NULL OR a.tipo = :tipo) AND " +
           "(:local IS NULL OR a.local LIKE %:local%) " +
           "ORDER BY a.dataPublicacao DESC")
    List<Anuncio> findWithFilters(
        @Param("tipo") String tipo,
        @Param("local") String local);
    
    List<Anuncio> findByAutorId(Long autorId);
}