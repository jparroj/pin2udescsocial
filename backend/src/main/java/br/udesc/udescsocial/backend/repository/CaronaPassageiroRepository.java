// backend/src/main/java/br/udesc/udescsocial/backend/repository/CaronaPassageiroRepository.java
package br.udesc.udescsocial.backend.repository;

import br.udesc.udescsocial.backend.entity.CaronaPassageiro;
import br.udesc.udescsocial.backend.entity.CaronaPassageiroId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CaronaPassageiroRepository extends JpaRepository<CaronaPassageiro, CaronaPassageiroId> {
    List<CaronaPassageiro> findByCaronaId(Long caronaId);
    List<CaronaPassageiro> findByPassageiroId(Long passageiroId);

    Optional<CaronaPassageiro> findByCaronaIdAndPassageiroId(Long caronaId, Long passageiroId);
}
