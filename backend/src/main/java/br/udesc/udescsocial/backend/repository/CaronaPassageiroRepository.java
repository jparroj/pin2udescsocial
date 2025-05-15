/**
 * Classe CaronaPassageiroRepository
 * 
 * Author: Elian
 * Data: 2025-05-15
 */

package br.udesc.udescsocial.backend.repository;

import br.udesc.udescsocial.backend.entity.CaronaPassageiro;
import br.udesc.udescsocial.backend.entity.CaronaPassageiroId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CaronaPassageiroRepository extends JpaRepository<CaronaPassageiro, CaronaPassageiroId> {
    List<CaronaPassageiro> findByCaronaId(Long caronaId);
    List<CaronaPassageiro> findByPassageiroId(Long passageiroId);
}