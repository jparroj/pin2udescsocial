/**
 * Classe AvaliacaoCaronaRepository
 * 
 * Author: Elian
 * Data: 2025-05-15
 */

package br.udesc.udescsocial.backend.repository;

import br.udesc.udescsocial.backend.entity.AvaliacaoCarona;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AvaliacaoCaronaRepository extends JpaRepository<AvaliacaoCarona, Long> {
    List<AvaliacaoCarona> findByAvaliadoId(Long avaliadoId);
    List<AvaliacaoCarona> findByAvaliadorId(Long avaliadorId);
    List<AvaliacaoCarona> findByCaronaId(Long caronaId);
}